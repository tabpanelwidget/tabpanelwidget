import React, { createRef } from "react"

const ACCORDION = "accordion"
const TABPANEL = "tabpanel"

const debounced = function(fn, ms) {
  let timeout
  return function(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}

/*
 * <ReactTabpanelwidget>
 *      <TeactTabpanelwidget.Heading>Hello world</ReactTabpanelwidget.Heading>
 *      <TeactTabpanelwidget.Panel>This is a panel</ReactTabpanelwidget.Panel>
 *      <!-- ... -->
 * </ReactTabpanelwidget>
 */
export default class ReactTabpanelwidget extends React.Component {
  static defaultProps = {
    heading: 2,
  }

  // XXX most likely a better way to do all this
  static Heading = props => props.children
  static Panel = props => props.children

  constructor(props) {
    super(props)
    if (!(props.mode == null || props.mode === ACCORDION || props.mode === TABPANEL)) {
      throw new Error(`mode prop should be nullish, "${ACCORDION}", or "${TABPANEL}"`)
    }
    if (!window.tpwId) window.tpwId = 0
    this.id = window.tpwId++
    this.debouncedMaybeRecomputeLayout = debounced(this.maybeRecomputeLayout.bind(this), 100)

    // both of these are used to trigger resize observer callback but not basic refs because they change constantly... XXX fix
    this.el = null
    this.spanEls = {} // hash so we can remove/add at index without worrying about size + also used for focus()

    // assume used properly alternating... can't introspect (easily) while VueContainer wraps in testpage
    const [tabs, panels] = this.computeTabsAndPanels(props)
    this.tabs = tabs
    this.panels = panels

    // these are used in resize observer computation.. can just access .current and be okay
    this.shadowRef = createRef()
    this.shadowHxRefs = this.tabs.map(tab => createRef())

    this.refSkipLink = createRef()
    this.state = {
      key: 0,
      selectedTabIdx: props.selectedIdxs ? Math.min(props.selectedIdxs[0] || 0, this.tabs.length - 1) : 0,
      expandedTabsIdx: {},
      internalMode: props.mode || null,
    }
  }

  // this function does not work with vuea because of VueContainer (https://github.com/akxcv/vuera/blob/master/src/wrappers/Vue.js#L15)
  computeTabsAndPanels(props) {
    const tabs = []
    const panels = []
    // XXX this assumes proper ordering of children... should be improved but el.type, etc. doesn't help
    let idx = 0
    const processNode = el => {
      if (el.type === React.Fragment) {
        React.Children.forEach(el.props.children, subel => {
          processNode(subel)
        })
      } else {
        idx += 1
        if (idx % 2 === 0) {
          tabs.push(el)
        } else {
          panels.push(el)
        }
      }
    }
    React.Children.forEach(props.children, processNode)
    return [tabs, panels]
  }

  componentDidMount() {
    this.isDynamicManualWatcher(this.isDynamic) // "immediate"
  }

  maybeRecomputeLayout() {
    if (!this.shadowRef.current) return
    let maxShadowHxHeight = 0
    this.shadowHxRefs.forEach(shadowHxRef => {
      if (!shadowHxRef.current) return
      if (maxShadowHxHeight < shadowHxRef.current.clientHeight) {
        maxShadowHxHeight = shadowHxRef.current.clientHeight
      }
    })
    // XXX can't believe it calls render on setState even if state doesn't change... (so have to manually check)
    const newInternalMode = (this.shadowRef.current.clientHeight > maxShadowHxHeight) ? ACCORDION : TABPANEL
    if (this.state.internalMode !== newInternalMode) this.setState({internalMode: newInternalMode})
  }

  isDynamicManualWatcher(v) {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    if (v) {
      if (!this.resizeObserver) this.resizeObserver = new window.ResizeObserver(this.debouncedMaybeRecomputeLayout)
      if (this.el) this.resizeObserver.observe(this.el, {box: "border-box"})
      for (const idx in this.spanEls) this.resizeObserver.observe(this.spanEls[idx], {box: "border-box"})
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.mode !== this.props.mode) {
      this.setState({internalMode: nextProps.mode || null})
      const nextIsDynamic = !nextProps.mode
      this.isDynamicManualWatcher(nextIsDynamic)
    }
    const [newTabs, newPanels] = this.computeTabsAndPanels(nextProps)
    const tabLengthDiff = newTabs.length - this.tabs.length
    if (tabLengthDiff > 0) {
      for (let i = 0; i < tabLengthDiff; i++) this.shadowHxRefs.push(createRef())
    } else if (tabLengthDiff < 0) {
      this.shadowHxRefs.splice(0, -tabLengthDiff)
    }
    this.tabs = newTabs
    this.panels = newPanels
    // XXX trigger re-render on any props change... better way to do this probably
    this.setState({key: this.state.key + 1})
  }

  componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  get isDynamic() {
    return !this.props.mode
  }

  get isAccordion() {
    return this.state.internalMode === ACCORDION
  }

  get isTabpanel() {
    return this.state.internalMode === TABPANEL
  }

  get tabIds() {
    return this.tabs.map((_, idx) => this.tabId(idx))
  }

  panelId(idx) {
    return `tpw-${this.id}-${idx}-p`
  }

  tabId(idx) {
    return `tpw-${this.id}-${idx}-t`
  }

  renderShadow() {
    return (
      <div ref={this.shadowRef} aria-hidden="true" className="tpw-shadow">
        {this.tabs.map((tab, idx) => this.renderTabpanelHx(idx, true))}
      </div>
    )
  }

  renderSkipLink() {
    return (
      <a ref={this.refSkipLink} href={`#${this.tabId(0)}`} tabIndex={-1} className="tpw-skip">
        <b>Tab through to leave this widget<br/>or<br/> follow this link to go back to the first {this.isAccordion ? "header" : "tab"}</b>
      </a>
    )
  }

  renderTablist() {
    return (
      <div role="tablist" aria-owns={this.tabIds.join(" ")}></div>
    )
  }

  setSpanEl(idx, el) {
    this.spanEls[idx] = el
    if (this.resizeObserver) {
      if (this.spanEls[idx]) this.resizeObserver.unobserve(this.spanEls[idx])
      if (el) this.resizeObserver.observe(el, {box: "border-box"})
    }
    this.spanEls[idx]  = el
  }

  toggleExpandedIdx(idx) {
    const newExpandedTabsIdx = {...this.state.expandedTabsIdx}
    newExpandedTabsIdx[idx] = !newExpandedTabsIdx[idx]
    this.setState({expandedTabsIdx: newExpandedTabsIdx})
  }

  spanClick(idx) {
    if (this.isAccordion) {
      this.toggleExpandedIdx(idx)
    } else {
      this.setState({selectedTabIdx: idx})
    }
  }

  spanKeyDown(e, idx) {
    switch (e.which) {
      case 13: // enter
      case 32: // space
        if (this.isAccordion) {
          e.preventDefault()
          this.toggleExpandedIdx(idx)
        }
        break
      case 37: // arrow left
      case 38: // arrow up
        if (e.which === (this.isAccordion ? 38 : 37)) {
          e.preventDefault()
          this.wrapFocusIdx(idx - 1)
        }
        break
      case 39: // arrow right
      case 40: // arrow down
        if (e.which === (this.isAccordion ? 40 : 39)) {
          e.preventDefault()
          this.wrapFocusIdx(idx + 1)
        }
        break
    }
  }

  renderAccordion() {
    const CustomHeadingTag = `h${this.props.heading}`
    return (
      <>
        {this.tabs.map((tab, idx) => {
          const tabId = this.tabId(idx)
          const panelId = this.panelId(idx)
          let className = "tpw-hx"
          if (this.state.expandedTabsIdx[idx]) className += " tpw-selected"
          return (
            <React.Fragment key={idx}>
              <CustomHeadingTag className={className} dir={this.props.rtl ? "rtl" : null}>
                <span ref={el => this.setSpanEl(idx, el)} id={tabId} className="tpw-header" aria-controls={panelId} aria-expanded={this.state.expandedTabsIdx[idx] ? "true" : "false"} role="button" tabIndex={0} onClick={() => this.spanClick(idx)} onKeyDown={e => this.spanKeyDown(e, idx)}>
                  {this.tabs[idx]}
                </span>
              </CustomHeadingTag>
              <div id={panelId} className="tpw-shim" role="region" aria-labelledby={tabId} hidden={!this.state.expandedTabsIdx[idx]}>
                <div className="tpw-panel">
                  {this.panels[idx]}
                </div>
              </div>
            </React.Fragment>
          )
        })}
        {this.renderSkipLink()}
      </>
    )
  }

  wrapFocusIdx(idx) {
    if (idx < 0) {
      idx = this.tabs.length - 1
    } else if (idx >= this.tabs.length) {
      idx = 0
    }
    this.spanEls[idx].focus()
  }

  tabpanelSpanKeyDown(e, idx) {
    switch (e.which) {
      case 13: // enter
      case 32: // space
        e.preventDefault()
        const newExpandedTabsIdx = {...this.expandedTabsIdx}
        newExpandedTabsIdx[idx] = !newExpandedTabsIdx[idx]
        this.setState({expandedTabsIdx: newExpandedTabsIdx})
        break
      case 37: // arrow left
        e.preventDefault()
        this.wrapFocusIdx(idx - 1)
        break
      case 39: // arrow right
        e.preventDefault()
        this.wrapFocusIdx(idx + 1)
        break
    }
  }

  renderTabpanelHx(idx, shadow = false) {
    const CustomHeadingTag = `h${this.props.heading}`
    const panelId = this.panelId(idx)
    const tabId = this.tabId(idx)
    let hxClassName = "tpw-hx"
    if (this.state.selectedTabIdx === idx) hxClassName += " tpw-selected"
    return (
      <CustomHeadingTag key={idx} ref={shadow ? this.shadowHxRefs[idx] : null} className={hxClassName}>
        <span ref={el => this.setSpanEl(idx, el)} id={tabId} className="tpw-tab" role="tab" tabIndex={this.state.selectedTabIdx === idx ? 0 : -1} aria-controls={panelId} aria-selected={this.state.selectedTabIdx === idx} onClick={shadow ? null : () => this.spanClick(idx)} onFocus={shadow ? null : () => this.spanClick(idx)} onKeyDown={shadow ? null : e => this.spanKeyDown(e, idx)}>
          {this.tabs[idx]}
        </span>
      </CustomHeadingTag>
    )
  }

  renderTabpanelShim(idx) {
    const tabId = this.tabId(idx)
    const panelId = this.panelId(idx)
    return (
      <div id={panelId} className="tpw-shim" role="tabpanel" tabIndex={0} aria-labelledby={tabId} hidden={this.state.selectedTabIdx !== idx}>
        <div className="tpw-panel">{this.panels[idx]}</div>
      </div>
    )
  }

  renderTabpanel() {
    return (
      <>
        {this.renderTablist()}
        {this.tabs.map((tab, idx) => {
          return (
            <React.Fragment key={idx}>
              {this.renderTabpanelHx(idx)}
              {this.renderTabpanelShim(idx)}
            </React.Fragment>
          )
        })}
        {this.renderSkipLink()}
      </>
    )
  }

  // XXX why can't the parent div ref stay the same? mostly just class/attr changes :/
  setEl(el) {
    if (this.resizeObserver) {
      if (this.el) this.resizeObserver.unobserve(this.el)
      if (el) this.resizeObserver.observe(el, {box: "border-box"})
    }
    this.el = el
  }

  tabpanelKeyDown(e) {
    switch (e.which) {
      case 27: // escape
        if (document.activeElement === this.refSkipLink.current) {
          ;(this.prevFocused || this.el).focus()
        } else {
          this.prevFocused = document.activeElement
          this.refSkipLink.current.focus()
        }
        break
      case 35: // end
        e.preventDefault()
        this.spanEls[this.tabs.length - 1].focus() // XXX defensive
      case 36: // home
        e.preventDefault()
        this.spanEls[0].focus() // XXX defensive
    }
  }

  render() {
    let className = "tpw-widget tpw-js"
    className += ` ${this.isAccordion ? "tpw-accordion" : "tpw-tabpanel"}`
    if (this.props.animate) className += " tpw-animate"
    if (this.props.centered) className += " tpw-centered"
    if (this.props.disconnected) className += " tpw-disconnected"
    if (this.props.skin) className += ` tpw-${this.props.skin}`
    if (this.props.iconsAtTheEnd) className += " tpw-icons-at-the-end"
    if (this.props.iconStyle) className += ` tpw-${this.props.iconStyle}`
    if (this.props.rounded) className += " tpw-rounded"
    return (
      <div ref={el => this.setEl(el)} key={this.state.key} className={className} dir={this.props.rtl ? "rtl" : null} onKeyDown={this.isAccordion ? null : e => this.tabpanelKeyDown(e)}>
        {this.isDynamic && this.renderShadow()}
        {this.isAccordion ? this.renderAccordion() : this.renderTabpanel()}
      </div>
    )
  }
}

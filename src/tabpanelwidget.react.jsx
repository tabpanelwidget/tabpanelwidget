import React from "react"

const ACCORDION = "accordion"
const TABPANEL = "tabpanel"

const debounced = function(fn, ms) {
  let timeout
  return function(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}

export default class ReactTabpanelwidget extends React.Component {
  constructor(props) {
    super(props)
    console.log("PROPS", props)
    if (!(props.mode === null || props.mode === ACCORDION || props.mode === TABPANEL)) {
      throw new Error(`mode prop should be null, "accordion", or "tabpanel"`)
    }
    // XXX check props.selectedIdxs, props.tabs?
    if (!window.tpwId) window.tpwId = 0
    this.id = window.tpwId++
    this.debouncedMaybeRecomputeLayout = debounced(this.maybeRecomputeLayout, 100)
    this.state = {
      selectedTabIdx: props.selectedIdxs ? Math.min(props.selectedIdxs[0] || 0, props.tabs.length - 1) : 0,
      expandedTabsIdx: {},
      internalMode: props.mode || null,
    }
  }

  componentDidMount() {
    this.isDynamicManualWatcher(this.isDynamic) // "immediate"
  }

  maybeRecomputeLayout() {
    // TODO
    // const { shadow } = this.$refs
    // if (!shadow) return
    // let maxShadowHxHeight = 0
    // this.shadowHxs.forEach(shadowHx => {
    //   if (maxShadowHxHeight < shadowHx.clientHeight) {
    //     maxShadowHxHeight = shadowHx.clientHeight
    //   }
    // })
    // this.setState({
    //   internalMode = (shadow.clientHeight > maxShadowHxHeight) ? ACCORDION : TABPANEL,
    // })
  }

  isDynamicManualWatcher(v) {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
    if (v) {
      if (!this.resizeObserver) {
        // XXX optimize to just make one of these handlers for all tpws (instead of per widget)
        this.resizeObserver = new window.ResizeObserver(this.debouncedMaybeRecomputeLayout)
      }
      // XXX do this better
      process.nextTick(() => {
        // TODO...
        // this.resizeObserver.observe(this.$el, {box: "border-box"})
        for (let idx = 0; idx < this.props.tabs.length; idx++) {
          // this.resizeObserver.observe(this.$refs[`span-${idx}`], {box: "border-box"})
        }
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.mode !== this.props.mode) {
      this.setState({
        internalMode: nextProps.mode || null,
      })
      const nextIsDynamic = !nextProps.mode // XXX this is terrible
      this.isDynamicManualWatcher(nextIsDynamic)
    }
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
    return this.props.tabs.map((_, idx) => this.tabId(idx))
  }

  panelId(idx) {
    return `tpw-${this.id}-${idx}-p`
  }

  tabId(idx) {
    return `tpw-${this.id}-${idx}-t`
  }

  renderShadow() {
    return (
      <div aria-hidden="true" className="tpw-shadow">
        {this.props.tabs.forEach(tab => {
          // XXX renderTabpanelHx
          return (
            <div></div>
          )
        })}
      </div>
    )
  }

  renderSkipLink() {
    const refSkipLink = React.createRef()
    return (
      <a ref={refSkipLink} href={`#tpw-${this.id}-0-t`} tabIndex={-1} className="tpw-skip">
        <b>Tab through to leave this widget<br/>or<br/> Click to go back to the first {this.isAccordion ? "header" : "tab"}</b>
      </a>
    )
  }

  renderTablist() {
    return (
      <div role="tablist" aria-owns={this.tabIds.join(" ")}></div>
    )
  }

  renderAccordion() {
    return (
      <div className="tpw-widget tpw-js tpw-accordion">
        {this.isDynamic && this.renderShadow()}
        {this.renderSkipLink()}
      </div>
    )
  }

  renderTabpanelHx(idx) {
    const panelId = this.panelId(idx)
    const tabId = this.tabId(idx)
    // TODO spanOptions.ref, spanOptions.on
    // TODO slot
    let hxClassName = "tpw-hx"
    if (this.state.selectedTabIdx === idx) hxClassName += " tpw-selected"
    return (
      <div className={hxClassName}>
        <span id={tabId} className="tpw-tab" role="tab" tabIndex={this.state.selectedTabIdx === idx ? 0 : -1} aria-controls={panelId} aria-selected={this.state.selectedTabIdx === idx}>{this.props.tabs[idx]}</span>
      </div>
    )
  }

  renderTabpanelShim(idx) {
    const tabId = this.tabId(idx)
    const panelId = this.panelId(idx)
    return (
      <div id={panelId} className="tpw-shim" role="tabpanel" tabIndex={0} aria-labelledby={tabId} hidden={this.state.selectedTabIdx !== idx}>
        <div className="tpw-panel">SHIM {idx}</div>
      </div>
    )
  }

  renderTabpanel() {
    // TODO keydown stuff}
    console.log("this.props.tabs", this.props.tabs)
    return (
      <div className="tpw-widget tpw-js tpw-tabpanel" dir={this.props.rtl ? "rtl" : undefined}>
        {this.isDynamic && this.renderShadow()}
        {this.renderTablist()}
        {this.props.tabs.map((tab, idx) => {
          return (
            <React.Fragment key={idx}>
              {this.renderTabpanelHx(idx)}
              {this.renderTabpanelShim(idx)}
            </React.Fragment>
          )
        })}
        {this.renderSkipLink()}
      </div>
    )
  }

  render() {
    return this.isAccordion ? this.renderAccordion() : this.renderTabpanel()
  }
}

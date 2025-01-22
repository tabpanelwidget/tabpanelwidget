import { h, ref } from "vue"

const ACCORDION = "accordion"
const TABPANEL = "tabpanel"

const debounced = function(fn, ms) {
  let timeout
  return function(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}

const Tabpanelwidget = {
  name: "Tabpanelwidget",
  props: {
    heading: {
      type: Number,
      default: 2,
      validator(heading) {
        // XXX warn if heading === 1?
        return [1, 2, 3, 4, 5, 6].includes(heading)
      },
    },
    mode: {
      type: String,
      validator(mode) {
        if (typeof mode === "undefined") return true
        if (mode === ACCORDION || mode === TABPANEL) return true
        return false
      },
    },
    selectedIdxs: {
      type: Array,
      validator(selectedIdxs) {
        for (const el of selectedIdxs || []) {
          if (parseInt(el) != el) return false
          if (el < 0) return false
        }
        return true
      },
    },
    tabs: {
      type: Array,
      required: true,
      validator(tabs) {
        for (const tab of tabs) {
          if (typeof tab !== "string") return false
        }
        return true
      },
    },
    rtl: Boolean,
    // special classes (XXX for now just forward the vanilla classes but need to improve customizability)
    animate: Boolean,
    skin: String, // null | fancy | pills | bar
    iconStyle: String, // null | chevrons-east-south | plus-minus
    centered: Boolean,
    disconnected: Boolean,
    iconsAtTheEnd: Boolean,
    rounded: Boolean,
  },
  data() {
    if (!window.tpwId) window.tpwId = 0
    this.id = window.tpwId++
    this.debouncedMaybeRecomputeLayout = debounced(this.maybeRecomputeLayout, 100)
    return {
      selectedTabIdx: this.selectedIdxs ? Math.min(this.selectedIdxs[0] || 0, this.tabs.length - 1) : 0,
      expandedTabsIdx: {},
      internalMode: this.mode || null,
    }
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },
  computed: {
    isDynamic() {
      return !this.mode
    },
    isAccordion() {
      return this.internalMode === ACCORDION
    },
    isTabpanel() {
      return this.internalMode === TABPANEL
    },
    tabIds() {
      return this.tabs.map((_, idx) => this.tabId(idx))
    },
    // XXX maybe check which ones can go with which
    classes() {
      const ret = []
      if (this.animate) ret.push("tpw-animate")
      if (this.centered) ret.push("tpw-centered")
      if (this.iconStyle) ret.push(`tpw-${this.iconStyle}`)
      if (this.disconnected) ret.push("tpw-disconnected")
      if (this.skin) ret.push(`tpw-${this.skin}`)
      if (this.iconsAtTheEnd) ret.push("tpw-icons-at-the-end")
      if (this.rounded) ret.push("tpw-rounded")
      return ret
    },
  },
  methods: {
    maybeRecomputeLayout() {
      const shadow = this.refShadow?.value
      if (!shadow) return
      let maxShadowHxHeight = 0
      for (let idx = 0; idx < this.tabs.length; idx++) {
        const shadowHx = this.refShadowHxs[idx]?.value
        if (maxShadowHxHeight < shadowHx.clientHeight) {
          maxShadowHxHeight = shadowHx.clientHeight
        }
      }
      this.internalMode = (shadow.clientHeight > maxShadowHxHeight) ? ACCORDION : TABPANEL
    },
    tabId(idx) {
      return `tpw-${this.id}-${idx}-t`
    },
    panelId(idx) {
      return `tpw-${this.id}-${idx}-p`
    },
    wrapFocusIdx(idx) {
      if (idx < 0) {
        idx = this.tabs.length - 1
      } else if (idx >= this.tabs.length) {
        idx = 0
      }
      this.refSpans[idx]?.value?.focus()
    },
    spanClick(idx) {
      if (this.isAccordion) {
        this.expandedTabsIdx[idx] = !this.expandedTabsIdx[idx]
      } else {
        this.selectedTabIdx = idx
      }
    },
    spanKeydown(e, idx) {
      switch (e.which) {
        case 13: // enter
        case 32: // space
          if (this.isAccordion) {
            e.preventDefault()
            this.expandedTabsIdx[idx] = !this.expandedTabsIdx[idx]
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
    },
    renderSkipLink() {
      return h("a", {
        href: `#${this.tabId(0)}`,
        tabindex: "-1",
        class: "tpw-skip",
        ref: this.refSkip,
      }, [
        h("b", {}, [
          "Tab through to leave this widget ",
          h("br"),
          "or",
          h("br"),
          ` follow this link to go back to the first ${this.isAccordion ? "header" : "tab"}`,
        ]),
      ])
    },
    renderTablist() {
      return h("div", {
        role: "tablist",
        "aria-owns": this.tabIds.join(" "),
      })
    },
    renderTabpanel() {
      const children = []
      if (this.isDynamic) {
        children.push(this.renderShadow())
      }
      children.push(this.renderTablist())
      for (let idx = 0; idx < this.tabs.length; idx++) {
        this.refSpans[idx] = ref()
        children.push(this.renderTabpanelHx(h, idx))
        children.push(this.renderTabpanelShim(h, idx))
      }
      children.push(this.renderSkipLink())
      return h("div", {
        class: ["tpw-widget", "tpw-js", "tpw-tabpanel"].concat(this.classes),
        dir: this.rtl ? "rtl" : undefined,
        ref: this.refRoot,
        onKeydown: e => {
          switch (e.which) {
            case 27: // escape
              if (document.activeElement === this.refSkip?.value) {
                ;(this.prevFocused || this.$el).focus()
              } else {
                this.prevFocused = document.activeElement
                this.refSkip?.value?.focus()
              }
              break
            case 35: // end
              e.preventDefault()
              this.refSpans[this.tabs.length - 1]?.value?.focus()
            case 36: // home
              e.preventDefault()
              this.refSpans[0]?.value?.focus()
          }
        },
      }, children)
    },
    renderShadow() {
      const children = []
      this.refShadowHxs = []
      for (let idx = 0; idx < this.tabs.length; idx++) {
        children.push(this.renderTabpanelHx(h, idx, true))
      }
      return h("div", {
        "aria-hidden": true,
        ref: this.refShadow,
        class: "tpw-shadow",
      }, children)
    },
    renderTabpanelHx(h, idx, shadow = false) {
      const hxOptions = {
        class: {
          "tpw-hx": true,
          "tpw-selected": this.selectedTabIdx === idx,
        },
      }
      const spanOptions = {
        class: "tpw-tab",
      }
      if (shadow) {
        this.refShadowHxs[idx] = ref()
        hxOptions.ref = this.refShadowHxs[idx]
      } else {
        const panelId = this.panelId(idx)
        const tabId = this.tabId(idx)
        spanOptions["aria-controls"] = panelId
        spanOptions["aria-selected"] = this.selectedTabIdx === idx
        spanOptions.id = tabId
        spanOptions.role = "tab"
        spanOptions.tabindex = this.selectedTabIdx === idx ? "0" : "-1"
        spanOptions.ref = this.refSpans[idx]
        spanOptions.onClick = () => this.spanClick(idx)
        spanOptions.onFocus = () => this.spanClick(idx)
        spanOptions.onKeydown = e => this.spanKeydown(e, idx)
      }
      return h(`h${this.heading}`, hxOptions, [
        h("span", spanOptions, this.$slots[`tab-${idx}`]?.() || this.tabs[idx]),
      ])
    },
    renderTabpanelShim(h, idx) {
      const tabId = this.tabId(idx)
      const panelId = this.panelId(idx)
      return h("div", {
        "aria-labelledby": tabId,
        hidden: this.selectedTabIdx !== idx,
        id: panelId,
        role: "tabpanel",
        tabindex: "0",
        class: "tpw-shim",
      }, [
        h("div", {
          class: "tpw-panel",
        }, this.$slots[`panel-${idx}`]?.()),
      ])
    },
    renderAccordion() {
      const children = []
      if (this.isDynamic) {
        children.push(this.renderShadow())
      }
      for (let idx = 0; idx < this.tabs.length; idx++) {
        const tabId = this.tabId(idx)
        const panelId = this.panelId(idx)
        this.refSpans[idx] = ref()
        children.push(h(`h${this.heading}`, {
          class: {
            "tpw-hx": true,
            "tpw-selected": this.expandedTabsIdx[idx],
          },
          dir: this.rtl ? "rtl" : undefined,
        }, [
          h("span", {
            "aria-controls": panelId,
            "aria-expanded": this.expandedTabsIdx[idx] ? "true" : "false",
            id: tabId,
            role: "button",
            tabindex: "0",
            class: "tpw-header",
            onClick: () => this.spanClick(idx),
            onKeydown: e => this.spanKeydown(e, idx),
            ref: this.refSpans[idx],
          }, this.$slots[`tab-${idx}`]?.() || this.tabs[idx]),
        ]))
        children.push(h("div", {
          "aria-labelledby": tabId,
          hidden: !this.expandedTabsIdx[idx],
          id: panelId,
          role: "region",
          class: "tpw-shim",
        }, [
          h("div", {
            class: "tpw-panel",
          }, this.$slots[`panel-${idx}`]?.()),
        ]))
      }
      children.push(this.renderSkipLink())
      return h("div", {
        class: ["tpw-widget", "tpw-js", "tpw-accordion"].concat(this.classes),
        ref: this.refRoot,
      }, children)
    },
  },
  render() {
    this.refRoot = ref()
    this.refSkip = ref()
    this.refShadow = ref()
    this.refSpans = []
    const ret = this.isAccordion ? this.renderAccordion() : this.renderTabpanel()
    return ret
  },
  watch: {
    mode(v) {
      this.internalMode = v || null
    },
    isDynamic: {
      immediate: true,
      handler(v) {
        if (this.resizeObserver) {
          this.resizeObserver.disconnect()
        }
        if (v) {
          if (!this.resizeObserver) {
            // XXX optimize to just make one of these handlers for all tpws (instead of per widget)
            this.resizeObserver = new window.ResizeObserver(this.debouncedMaybeRecomputeLayout)
          }
          this.$nextTick(() => {
            if (this.refRoot.value) {
              this.resizeObserver.observe(this.refRoot.value, {box: "border-box"})
            }
            for (let idx = 0; idx < this.tabs.length; idx++) {
              const ref = this.refSpans[idx]
              if (ref?.value) {
                this.resizeObserver.observe(ref.value, {box: "border-box"})
              }
            }
          })
        }
      },
    },
  },
}

// install function executed by Vue.use()
const install = function(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component("Tabpanelwidget", Tabpanelwidget)
}

// To auto-install on non-es builds, when vue is found
// XXX do something similar for react
// eslint-disable-next-line no-redeclare
/* global window, global */
if (process.env.ES_BUILD === "true") {
  let GlobalVue = null
  if (typeof window !== "undefined") {
    GlobalVue = window.Vue
  } else if (typeof global !== "undefined") {
    GlobalVue = global.Vue
  }
  if (GlobalVue) {
    GlobalVue.use({ install })
  }
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
Tabpanelwidget.install = install

export default Tabpanelwidget

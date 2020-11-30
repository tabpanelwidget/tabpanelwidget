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
    bar: Boolean,
    centered: Boolean,
    chevronsEastSouth:  Boolean,
    disconnected: Boolean,
    fancy: Boolean,
    iconsAtTheEnd: Boolean,
    pills: Boolean,
    plusMinus: Boolean,
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
      if (this.bar) ret.push("tpw-bar")
      if (this.centered) ret.push("tpw-centered")
      if (this.chevronsEastSouth) ret.push("tpw-chevrons-east-south")
      if (this.disconnected) ret.push("tpw-disconnected")
      if (this.fancy) ret.push("tpw-fancy")
      if (this.iconsAtTheEnd) ret.push("tpw-icons-at-the-end")
      if (this.pills) ret.push("tpw-pills")
      if (this.plusMinus) ret.push("tpw-plus-minus")
      if (this.rounded) ret.push("tpw-rounded")
      return ret
    },
  },
  methods: {
    maybeRecomputeLayout() {
      const { shadow } = this.$refs
      if (!shadow) return
      let maxShadowHxHeight = 0
      for (let idx = 0; idx < this.tabs.length; idx++) {
        const shadowHx = this.$refs[`shadowHx-${idx}`]
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
      this.$refs[`span-${idx}`].focus()
    },
    renderSkipLink(h) {
      return h("a", {
        attrs: {
          href: `#tpw-${this.id}-0-t`,
          tabindex: "-1",
        },
        class: "tpw-skip",
        ref: "skip",
      }, [
        h("b", {}, [
          "Tab through to leave this widget ",
          h("br"),
          "or",
          h("br"),
          ` Click to go back to the first ${this.isAccordion ? "header" : "tab"}`,
        ]),
      ])
    },
    renderTablist(h) {
      return h("div", {
        attrs: {
          role: "tablist",
          "aria-owns": this.tabIds.join(" "),
        },
      })
    },
    renderTabpanel(h) {
      const children = []
      if (this.isDynamic) {
        children.push(this.renderShadow(h))
      }
      children.push(this.renderTablist(h))
      for (let idx = 0; idx < this.tabs.length; idx++) {
        children.push(this.renderTabpanelHx(h, idx))
        children.push(this.renderTabpanelShim(h, idx))
      }
      children.push(this.renderSkipLink(h))
      return h("div", {
        class: ["tpw-widget", "tpw-js", "tpw-tabpanel"].concat(this.classes),
        attrs: {
          "dir": this.rtl ? "rtl" : undefined,
        },
        on: {
          keydown: e => {
            switch (e.which) {
              case 27: // escape
                if (document.activeElement === this.$refs.skip) {
                  ;(this.prevFocused || this.$el).focus()
                } else {
                  this.prevFocused = document.activeElement
                  this.$refs.skip.focus()
                }
                break
              case 35: // end
                e.preventDefault()
                this.$refs[`span-${this.tabs.length - 1}`].focus()
              case 36: // home
                e.preventDefault()
                this.$refs[`span-0`].focus()
            }
          },
        },
      }, children)
    },
    renderShadow(h) {
      const children = []
      for (let idx = 0; idx < this.tabs.length; idx++) {
        children.push(this.renderTabpanelHx(h, idx, true))
      }
      return h("div", {
        attrs: {
          "aria-hidden": true,
        },
        ref: "shadow",
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
        hxOptions.ref = `shadowHx-${idx}`
      } else {
        const panelId = this.panelId(idx)
        const tabId = this.tabId(idx)
        spanOptions.attrs = {
          "aria-controls": panelId,
          "aria-selected": this.selectedTabIdx === idx,
          id: tabId,
          role: "tab",
          tabindex: this.selectedTabIdx === idx ? "0" : "-1",
        }
        spanOptions.ref = `span-${idx}`
        spanOptions.on = {
          click: () => this.selectedTabIdx = idx,
          focus: () => this.selectedTabIdx = idx,
          keydown: e => {
            switch (e.which) {
              case 13: // enter
              case 32: // space
                e.preventDefault()
                this.$set(this.expandedTabsIdx, idx, !this.expandedTabsIdx[idx])
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
          },
        }
      }
      console.log("this.$slots", this.$slots)
      return h(`h${this.heading}`, hxOptions, [
        h("span", spanOptions, this.$slots[`tab-${idx}`] || this.tabs[idx]),
      ])
    },
    renderTabpanelShim(h, idx) {
      const tabId = this.tabId(idx)
      const panelId = this.panelId(idx)
      return h("div", {
        attrs: {
          "aria-labelledby": tabId,
          hidden: this.selectedTabIdx !== idx,
          id: panelId,
          role: "tabpanel",
          tabindex: "0",
        },
        class: "tpw-shim",
      }, [
        h("div", {
          class: "tpw-panel",
        }, this.$slots[`panel-${idx}`]),
      ])
    },
    renderAccordion(h) {
      const children = []
      if (this.isDynamic) {
        children.push(this.renderShadow(h))
      }
      for (let idx = 0; idx < this.tabs.length; idx++) {
        const tabId = this.tabId(idx)
        const panelId = this.panelId(idx)
        children.push(h(`h${this.heading}`, {
          class: {
            "tpw-hx": true,
            "tpw-selected": this.expandedTabsIdx[idx],
          },
          attrs: {
            "dir": this.rtl ? "rtl" : undefined,
          },
        }, [
          h("span", {
            attrs: {
              "aria-controls": panelId,
              "aria-expanded": this.expandedTabsIdx[idx],
              id: tabId,
              role: "button",
              tabindex: "0",
            },
            class: "tpw-header",
            on: {
              click: () => this.$set(this.expandedTabsIdx, idx, !this.expandedTabsIdx[idx]),
              keydown: e => {
                switch (e.which) {
                  case 38: // arrow up
                    e.preventDefault()
                    this.wrapFocusIdx(idx - 1)
                    break
                  case 40: // arrow down
                    e.preventDefault()
                    this.wrapFocusIdx(idx + 1)
                    break
                }
              },
            },
            ref: `span-${idx}`,
          }, this.$slots[`tab-${idx}`] || this.tabs[idx]),
        ]))
        children.push(h("div", {
          attrs: {
            "aria-labelledby": tabId,
            hidden: !this.expandedTabsIdx[idx],
            id: panelId,
            role: "region",
          },
          class: "tpw-shim",
        }, [
          h("div", {
            class: "tpw-panel",
          }, this.$slots[`panel-${idx}`]),
        ]))
      }
      children.push(this.renderSkipLink(h))
      return h("div", {
        class: ["tpw-widget", "tpw-js", "tpw-accordion"].concat(this.classes),
      }, children)
    },
  },
  render(h) {
    return this.isAccordion ? this.renderAccordion(h) : this.renderTabpanel(h)
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
            this.resizeObserver.observe(this.$el, {box: "border-box"})
            for (let idx = 0; idx < this.tabs.length; idx++) {
              this.resizeObserver.observe(this.$refs[`span-${idx}`], {box: "border-box"})
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

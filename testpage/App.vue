<template lang="pug">
  div
    link(v-if="addNormalize" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css")
    link(v-if="stylesheetHref" rel="stylesheet" :href="stylesheetHref")
    link(v-if="customStylesheetHref" rel="stylesheet" :href="customStylesheetHref")
    header
      h1 TabPanelWidget Test Page &middot; #[a(title="TabpanelWidget.com" href="https://tabpanelwidget.com") tabpanelwidget.com]
      //-p All the widgets below are only styled via #[strong tabpanelwidget.min.css]
      p
        input#normalizeYN.input(type="checkbox" v-model="addNormalize")
        label(for="normalizeYN") Add normalize.css
      p
        label(for="stylesheet-switcher") Pick a Stylesheet
        select#stylesheet-switcher(v-model="stylesheetHref")
          option(value="") None
          option(value="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css") Bootstrap
          option(value="https://cdn.jsdelivr.net/npm/foundation-sites@6.6.3/dist/css/foundation.min.css") Foundation
          option(value="https://bulma.io/css/bulma-docs.min.css?v=202007241609") Bulma
          option(value="https://getuikit.com/css/theme.css?1318") Ulkit
          option(value="https://semantic-ui.com/dist/semantic.min.css") Semantic UI
          option(value="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css") Materialize
          option(value="https://unpkg.com/purecss@2.0.3/build/pure-min.css") Pure CSS
          option(value="http://getskeleton.com/dist/css/skeleton.css") Skeleton
          option(value="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.0/milligram.min.css") Milligram
      p.oh
        label(for="url") Add a Stylesheet
        input#url.input(inputmode="url" type="url" v-model="editCustomStylesheetHref" placeholder="https://example.com/styles.min.css" pattern="https://.*.css" size="30")
        button(type="button" @click="customStylesheetHref = editCustomStylesheetHref") Insert

    #controls
      h2.v-h Controls (options to style the widgets)
      p
        label(for="width") Width:
        input#width(type="range" v-model="width" step="1" min="10" max="100")
        input(:value="width+'%'" disabled="disabled")
      p
        label(for="fontSize") Font-size:
        input#fontSize(type="range" v-model="fontSize" step="1" min="10" max="30")
        input(:value="fontSize+'px'" disabled="disabled")
      p
        label(for="fontWeight") Font-weight:
        input#fontWeight(type="range" v-model="fontWeight" step="100" min="300" max="800")
        input(:value="fontWeight" disabled="disabled")
      p
        label(for="space") Space:
        input#space(type="range" v-model="space" step="2" min="0" max="30")
        input(:value="space" disabled="disabled")
      a(title="Refresh The Page" href="/")
        b.v-h Refresh The Page
        svg(role="presentation" xmlns="http://www.w3.org/2000/svg" width="50" height="35" viewBox="0 0 640 512")
          path(fill="#fff" d="M629.657 343.598L528.971 444.284c-9.373 9.372-24.568 9.372-33.941 0L394.343 343.598c-9.373-9.373-9.373-24.569 0-33.941l10.823-10.823c9.562-9.562 25.133-9.34 34.419.492L480 342.118V160H292.451a24.005 24.005 0 0 1-16.971-7.029l-16-16C244.361 121.851 255.069 96 276.451 96H520c13.255 0 24 10.745 24 24v222.118l40.416-42.792c9.285-9.831 24.856-10.054 34.419-.492l10.823 10.823c9.372 9.372 9.372 24.569-.001 33.941zm-265.138 15.431A23.999 23.999 0 0 0 347.548 352H160V169.881l40.416 42.792c9.286 9.831 24.856 10.054 34.419.491l10.822-10.822c9.373-9.373 9.373-24.569 0-33.941L144.971 67.716c-9.373-9.373-24.569-9.373-33.941 0L10.343 168.402c-9.373 9.373-9.373 24.569 0 33.941l10.822 10.822c9.562 9.562 25.133 9.34 34.419-.491L96 169.881V392c0 13.255 10.745 24 24 24h243.549c21.382 0 32.09-25.851 16.971-40.971l-16.001-16z")
    #test-container(:style="{fontSize: fontSize+'px', '--space': space, fontWeight: fontWeight}")
      h2#vue Stress Tester
      div
        input#vue-rtl(type="checkbox" v-model="stressRtl")
        label#swap(for="vue-rtl") Swap Script Direction to RTL
      div#tabsHeadersBox
        div
          h4 Tabs/Headers
          div(v-for="(tab, idx) in stressTabs" :key="idx")
            input.input(type="text" v-model="stressTabs[idx]" @input="e => stressSetTab(idx, e.target.value)")
            button(@click="stressRemoveTab(idx)") remove
          button.vue-remove(@click="stressAddTab()") add
      div.columns
        div.left
          div
            label(for="vue-mode") Mode
            select#vue-mode(v-model="stressMode")
              option(:value="null") Unspecified (Dynamic)
              option(value="accordion") Strictly Accordion
              option(value="tabpanel") Strictly TabPanel
          div
            label(for="vue-heading") Heading #[br] (the markup should change but not the styling)
            select#vue-style(v-model="stressHeading")
              option(v-for="i in 5" :value="i+1") h{{i+1}}
          div
            fieldset.vue-tabpanel-fieldset.vue-fieldset(v-if="stressMode !== 'accordion'")
              legend For TabPanel
              label(for="vue-style") Skins
              select#vue-style(v-model="stressSkin")
                option(:value="null") Default
                option(value="fancy") Fancy
                option(value="pills") Pills
                option(value="bar") Bar
              div
                input#vue-centered(type="checkbox" v-model="stressCentered")
                label(for="vue-centered") Center the tabs
              div(:style="{'opacity': stressSkin === 'bar' ? 0.5 : 1}")
                input#vue-rounded(type="checkbox" v-model="stressRounded" :disabled="stressSkin === 'bar'")
                label(for="vue-rounded") Add border-radius
          div
            fieldset.vue-accordion-fieldset.vue-fieldset(v-if="stressMode !== 'tabpanel'")
              legend For Accordion
              label(for="vue-icon-style") Icons
              select#vue-icon-style(v-model="stressIconStyle")
                option(:value="null") Chevrons North/South (default)
                option(value="chevrons-east-south") Chevrons East/South
                option(value="plus-minus") Plus/Minus
              div
                input#vue-disconnected(type="checkbox" v-model="stressDisconnected")
                label(for="vue-disconnected") Disconnected
              div
                input#vue-icon-at-the-end(type="checkbox" v-model="stressIconsAtTheEnd")
                label(for="vue-icon-at-the-end") Icons at the end
              div(:style="{'opacity': stressIconStyle === 'plus-minus' ? 0.5 : 1}")
                input#vue-icon-animate(type="checkbox" v-model="stressIconAnimate"  :disabled="stressIconStyle === 'plus-minus'")
                label(for="vue-icon-animate") Animate open/close
        div.right
          h4 Widget (Vue)
          .m-a(:style="{width: width+'%'}")
            div
              // TODO
              // a show code
              //-div
                pre
                  code {{vueCode}}
              //- XXX include html of the vue section below above automatically
              VueTabpanelwidget(:mode="stressMode" :tabs="stressTabs" v-bind="stressProps")
                template(v-for="i in stressTabs.length" v-slot:[`panel-${i-1}`]="")
                  p Panel {{i-1}}
                  p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus felis id urna vulputate maximus. Aliquam vitae arcu id nulla convallis aliquam. Vivamus at nisl semper, sagittis lectus eu, fringilla nisl.
                  small This #[a(href="#" title="Link used to test keyboard navigation within the widget") link] is here to test keyboard navigation.

          //- TODO react doesn't work with vuera... so we should remove those deps
          //-div
            h4 Widget (React &mdash; embedded in Vue via #[a(target="_blank" href="https://github.com/akxcv/vuera" title="Vuera on GitHub") vuera])
            //- vuera auto-wraps in div
            ReactTabpanelwidget(:mode="stressMode" v-bind="stressProps")
              template(v-for="tab in stressTabs")
                ReactTabpanelwidgetHeading {{tab}}
                ReactTabpanelwidgetPanel hello world

          div(ref="vanillaWrapper")
            div(style="display:flex")
              h4 Widget (Vanilla)
              button#unmount(v-if="vanillaMounted" @click="vanillaUnmount") unmount
              button#unmount(v-else @click="vanillaMount") mount
            .m-a(:style="{width: width+'%'}")
              //- un-mount and re-mount means we can't use vue to keep classes on here via template and instead need to use watchers
              //- ... looking up the node at that moment
              .tpw-widget
                template(v-for="(tab, idx) in initialStressTabs")
                  h2 {{tab}}
                  div
                    p Panel {{idx}}
                    p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus felis id urna vulputate maximus. Aliquam vitae arcu id nulla convallis aliquam. Vivamus at nisl semper, sagittis lectus eu, fringilla nisl.
                    small This #[a(href="#" title="Link used to test keyboard navigation within the widget") link] is here to test keyboard navigation.
      h2#vanilla.c-l Showcase
      div(ref="showcase")
        h3 "Dynamic" Widgets with default Accordion Styling
        div(:style="{width: width+'%'}")
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
            .tpw-widget
              include ./_vanilla-headings.pug
          //- tpw-rounded
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-rounded
            .tpw-widget.tpw-rounded
              include ./_vanilla-headings.pug
          //- tpw-fancy
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-rounded
              li
                code.code tpw-fancy
            .tpw-widget.tpw-rounded.tpw-fancy
              include ./_vanilla-headings.pug
          //- tpw-pills
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-rounded
              li
                code.code tpw-pills
            .tpw-widget.tpw-rounded.tpw-pills
              include ./_vanilla-headings.pug
          //- tpw-bar
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-bar
            .tpw-widget.tpw-bar
              include ./_vanilla-headings.pug
          //- tpw-bar, tpw-centered
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-bar
              li
                code.code tpw-centered
            .tpw-widget.tpw-bar.tpw-centered
              include ./_vanilla-headings.pug
        h3 "Dynamic" Widgets with custom Accordion Styling
        div(:style="{width: width+'%'}")
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-chevrons-east-south
            .tpw-widget.tpw-chevrons-east-south
              include ./_vanilla-headings.pug
          //- tpw-plus-minus
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-plus-minus
            .tpw-widget.tpw-plus-minus
              include ./_vanilla-headings.pug
          //- tpw-disconnected
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-disconnected
            .tpw-widget.tpw-disconnected
              include ./_vanilla-headings.pug
          //- tpw-animate
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-animate
            .tpw-widget.tpw-animate
              include ./_vanilla-headings.pug
          //- tpw-icons-at-the-end
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-icons-at-the-end
            .tpw-widget.tpw-icons-at-the-end
              include ./_vanilla-headings.pug
        h3 "Static" Widgets: TabPanels
        div(:style="{width: width+'%'}")
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-tabpanel
            .tpw-widget.tpw-tabpanel
              include ./_vanilla-headings.pug
          //- tpw-rounded
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-tabpanel
              li
                code.code tpw-rounded
            .tpw-widget.tpw-tabpanel.tpw-rounded
              include ./_vanilla-headings.pug
          //- tpw-fancy
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-tabpanel
              li
                code.code tpw-rounded
              li
                code.code tpw-fancy
            .tpw-widget.tpw-tabpanel.tpw-rounded.tpw-fancy
              include ./_vanilla-headings.pug
          //- tpw-pills
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-tabpanel
              li
                code.code tpw-rounded
              li
                code.code tpw-pills
            .tpw-widget.tpw-tabpanel.tpw-rounded.tpw-pills
              include ./_vanilla-headings.pug
          //- tpw-bar
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-tabpanel
              li
                code.code tpw-bar
            .tpw-widget.tpw-tabpanel.tpw-bar
              include ./_vanilla-headings.pug
          //- tpw-bar + tpw-centered
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-tabpanel
              li
                code.code tpw-bar
              li
                code.code tpw-centered
            .tpw-widget.tpw-tabpanel.tpw-bar.tpw-centered
              include ./_vanilla-headings.pug
        h3 "Static" Widgets: Accordions
        div(:style="{width: width+'%'}")
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-accordion
              li
                code.code tpw-chevrons-east-south
            .tpw-widget.tpw-accordion.tpw-chevrons-east-south
              include ./_vanilla-headings.pug
          //- tpw-plus-minus
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-accordion
              li
                code.code tpw-plus-minus
            .tpw-widget.tpw-accordion.tpw-plus-minus
              include ./_vanilla-headings.pug
          //- tpw-disconnected
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-accordion
              li
                code.code tpw-disconnected
            .tpw-widget.tpw-accordion.tpw-disconnected
              include ./_vanilla-headings.pug
          //- tpw-animate
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-accordion
              li
                code.code tpw-animate
            .tpw-widget.tpw-accordion.tpw-animate
              include ./_vanilla-headings.pug
          //- tpw-icons-at-the-end
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-accordion
              li
                code.code tpw-icons-at-the-end
            .tpw-widget.tpw-accordion.tpw-icons-at-the-end
              include ./_vanilla-headings.pug
          //- tpw-icons-at-the-end
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li
                code.code tpw-accordion
              li
                code.code tpw-icons-at-the-end
              li
                code.code tpw-animate
            .tpw-widget.tpw-accordion.tpw-icons-at-the-end.tpw-animate
              include ./_vanilla-headings.pug
</template>

<script>
import * as Tabpanelwidget from "../src/tabpanelwidget.js"
import VueTabpanelwidget from "../src/tabpanelwidget.vue.js"
import ReactTabpanelwidget from "../src/tabpanelwidget.react.jsx"

let _vanillaUnmount
export default {
  name: "App",
  components: {
    VueTabpanelwidget,
    ReactTabpanelwidget,
    ReactTabpanelwidgetHeading: ReactTabpanelwidget.Heading,
    ReactTabpanelwidgetPanel: ReactTabpanelwidget.Panel,
  },
  data() {
    this.examples = [
      {classes: []},
      {classes: ["fancy"]},
      {classes: ["pills"]},
      {classes: ["bar"], ignoreBorderRadius: true},
      {classes: ["bar", "plus-minus"], ignoreBorderRadius: true},
      {classes: ["bar", "plus-minus", "icons-at-the-end"], ignoreBorderRadius: true},
    ]
    this.uninstalls = []
    this.stressModes = [null, "accordion", "tabpanel"]
    this.initialStressTabs = ['Lorem', 'Ipsum', 'Dolor', 'Sit Amet'] // so not bound for vanilla
    return {
      addNormalize: false,
      customStylesheetHref: "",
      editCustomStylesheetHref: "",
      fontSize: 18,
      fontWeight: 500,
      space: 0,
      stylesheetHref: "",
      tpwOff: false,
      width: 100,

      vanillaMounted: false,
      vueShowCode: false,
      stressMode: this.stressModes[0],
      stressSkin: null,
      stressIconStyle: null,
      stressIconAnimate: false,
      stressDisconnected: false,
      stressIconsAtTheEnd: false,
      stressCentered: false,
      stressRounded: false,
      stressHeading: 2,
      stressRtl: false,
      stressTabs: [...this.initialStressTabs],
      // XXX some way to customize the panels
    }
  },
  mounted() {
    this.vanillaMount()
    this.$refs.showcase.querySelectorAll(".tpw-widget").forEach(widget => Tabpanelwidget.install(widget, () => {}, true))
  },
  computed: {
    // not just the true values because then react nextProps doesn't contain the value so it uses previous props
    stressProps() {
      const ret = {}
      ret.centered = !!this.stressCentered
      ret.rounded = !!this.stressRounded
      ret.rtl = !!this.stressRtl
      ret.skin = this.stressSkin
      ret.iconStyle = this.stressIconStyle
      ret.animate = !!this.stressIconAnimate
      ret.disconnected = !!this.stressDisconnected
      ret.iconsAtTheEnd = !!this.stressIconsAtTheEnd
      ret.heading = this.stressHeading
      return ret
    },
    vueCode() {
      const keys = Object.keys(this.stressProps)
      const props = keys.filter(k => this.stressProps[k]).join(" ")
      return `<template>
  <VueTabpanelwidget ${this.stressMode ? `mode="${this.stressMode}" ` : ''}:tabs="${JSON.stringify(this.stressTabs)}"${props ? ` ${props}` : ''}>
    <template v-for="i in stressTabs.length" v-slot:[\`panel-${i-1}\`]="">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus felis id urna vulputate maximus. Aliquam vitae arcu id nulla convallis aliquam. Vivamus at nisl semper, sagittis lectus eu, fringilla nisl.<p>
      <small>This <a href="#" title="Link used to test keyboard navigation within the widget">link</a> is here to test keyboard navigation.</small>
    </template>
  </VueTabpanelwidget>
</template>

<script>
import VueTabpanelwidget from "../src/tabpanelwidget.vue.js"

export default {
  components: {
    VueTabpanelwidget,
  },
}
<\/script>`
    },
  },
  methods: {
    vanillaMount() {
      const widget = this.$refs.vanillaWrapper.querySelector(".tpw-widget")
      const mounted = widget.classList.contains("tpw-js")
      if (!mounted) {
        // if (_vanillaUnmount) console.warn("_vanillaUnmount should not be set")
        // this needs to happen before install because determines dynamic
        this.vanillaApply("mode")
        Tabpanelwidget.install(widget, _uninstall => (_vanillaUnmount = _uninstall), true)
        this.vanillaApply()
      }
      this.vanillaMounted = true
    },
    vanillaUnmount() {
      this.vanillaMounted = false
      if (_vanillaUnmount) {
        _vanillaUnmount()
        _vanillaUnmount = null
        return true
      } else {
        // did not unmount
        return false
      }
    },
    vanillaApply(key, prevValue) {
      const widget = this.$refs.vanillaWrapper.querySelector(".tpw-widget")
      if (!key || key === "mode") {
        widget.classList.remove("tpw-tabpanel")
        widget.classList.remove("tpw-accordion")
        if (this.stressMode === "accordion") {
          widget.classList.add("tpw-accordion")
        } else if (this.stressMode === "tabpanel") {
          widget.classList.add("tpw-tabpanel")
        }
      }
      if (!key || key === "skin") {
        widget.classList.remove("tpw-fancy")
        widget.classList.remove("tpw-pills")
        widget.classList.remove("tpw-bar")
        if (this.stressSkin) widget.classList.add(`tpw-${this.stressSkin}`)
      }
      if (!key || key === "iconStyle") {
        widget.classList.remove("tpw-chevrons-east-south")
        widget.classList.remove("tpw-plus-minus")
        if (this.stressIconStyle) {
          widget.classList.add(`tpw-${this.stressIconStyle}`)
        }
      }
      if (!key || key === "centered") widget.classList[this.stressCentered ? "add" : "remove"](`tpw-centered`)
      if (!key || key === "rounded") widget.classList[this.stressRounded ? "add" : "remove"](`tpw-rounded`)
      if (!key || key === "disconnected") widget.classList[this.stressDisconnected ? "add" : "remove"](`tpw-disconnected`)
      if (!key || key === "iconsAtTheEnd") widget.classList[this.stressIconsAtTheEnd ? "add" : "remove"](`tpw-icons-at-the-end`)
      if (!key || key === "iconAnimate") widget.classList[this.stressIconAnimate ? "add" : "remove"](`tpw-animate`)
      if (!key || key === "rtl") widget.setAttribute("dir", this.stressRtl ? "rtl" : "ltr")
    },
    stressRemoveTab(idx) {
      this.stressTabs.splice(idx, 1)
      // remove hx+shim elements in vanilla widget
      const unmounted = this.vanillaUnmount()
      const widget = this.$refs.vanillaWrapper.querySelector(".tpw-widget")
      for (let i = 0; i < widget.children.length; i++) {
        if (widget.children[i].tagName.match(/^h[1-6]$/i)) {
          if (idx <= 0) {
            // delete this child and next
            widget.removeChild(widget.children[i+1])
            widget.removeChild(widget.children[i])
            break
          }
          idx -= 1
        }
      }
      if (unmounted) this.vanillaMount()
    },
    stressAddTab() {
      const v = Math.floor(Math.random()*20) + ""
      this.stressTabs.push(v)
      const unmounted = this.vanillaUnmount()
      const widget = this.$refs.vanillaWrapper.querySelector(".tpw-widget")
      const heading = document.createElement(`h${this.stressHeading}`)
      heading.innerText = v
      const div = document.createElement("div")
      div.innerText = v
      widget.appendChild(heading)
      widget.appendChild(div)
      if (unmounted) this.vanillaMount()
    },
    stressSetTab(idx, v) {
      const widget = this.$refs.vanillaWrapper.querySelector(".tpw-widget")
      for (let i = 0; i < widget.children.length; i++) {
        if (widget.children[i].tagName.match(/^h[1-6]$/i)) {
          if (idx <= 0) {
            // span
            widget.children[i].firstChild.innerText = v
            return
          }
          idx -= 1
        }
      }
    },
  },
  watch: {
    stressMode() {
      const unmounted = this.vanillaUnmount()
      if (unmounted) this.vanillaMount()
    },
    stressSkin() { this.vanillaApply("skin") },
    stressIconStyle() { this.vanillaApply("iconStyle") },
    stressCentered() { this.vanillaApply("centered") },
    stressRounded() { this.vanillaApply("rounded") },
    stressDisconnected() { this.vanillaApply("disconnected") },
    stressIconsAtTheEnd() { this.vanillaApply("iconsAtTheEnd") },
    stressIconAnimate() { this.vanillaApply("iconAnimate") },
    stressRtl() { this.vanillaApply("rtl") },
    stressHeading(nv, ov) {
      const unmounted = this.vanillaUnmount()
      const widget = this.$refs.vanillaWrapper.querySelector(".tpw-widget")
      widget.querySelectorAll(`h${ov}`).forEach(node => {
        const newNode = document.createElement(`h${nv}`)
        newNode.innerText = node.innerText
        node.parentNode.replaceChild(newNode, node)
      })
      if (unmounted) this.vanillaMount()
    },
  },
}
</script>

<template lang="pug">
  div
    link(v-if="addNormalize" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css")
    link(v-if="stylesheetHref" rel="stylesheet" :href="stylesheetHref")
    link(v-if="customStylesheetHref" rel="stylesheet" :href="customStylesheetHref")
    header
      h1 TabpanelWidget Test Page &middot; #[a(title="TabpanelWidget.com" href="https://tabpanelwidget.com") tabpanelwidget.com]
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

      div(ref="vueSection")
        h2 Vue
        h3 just for h3+div margin auto style
        h4 Mode
        select(v-model="vueMode")
          option(:value="null") unspecified (dynamic)
          option(value="accordion") strictly accordion
          option(value="tabpanel") strictly tabpanel
        h4 Pick a style
        select(v-model="vueStyle")
          option(:value="null") Default
          option(value="fancy") Fancy
          option(value="pills") Pills
          option(value="bar") Bar
        div(:style="{'opacity': vueStyle === 'bar' ? 0.5 : 1}")
          input#vue-rounded(type="checkbox" v-model="vueRounded" :disabled="vueStyle === 'bar'")
          label(for="vue-rounded") Add border-radius
        div
          input#vue-centered(type="checkbox" v-model="vueCentered")
          label(for="vue-centered") Center the tabs
        div
          input#vue-rtl(type="checkbox" v-model="vueRtl")
          label(for="vue-rtl") RTL
        h4 Tabs
        div(v-for="(tab, idx) in vueTabs" :key="idx")
          input(type="text" v-model="vueTabs[idx]")
          button(@click="vueTabs.splice(idx, 1)") remove
        button(@click="vueTabs.push('')") add
        div(:style="{width: width+'%'}")
          div
            //- XXX include html of the vue section below above automatically
            VueTabpanelwidget(:mode="vueMode" :tabs="vueTabs" v-bind="vueProps")
              template(v-slot:panel-0="")
                p Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus felis id urna vulputate maximus. Aliquam vitae arcu id nulla convallis aliquam. Vivamus at nisl semper, sagittis lectus eu, fringilla nisl.
                small This #[a(href="#" title="Link used to test keyboard navigation within the widget") link] is here to test keyboard navigation.
          div
            pre
              code {{vueCode}}



      //- because vanilla takes over and replaces widgets... we cannot use vue to update them live (addCentered)
      div(ref="vanillaSection")
        h2 Vanilla
        fieldset.fieldset
          legend Options
          input#turn-off-tpw.input(type="checkbox" v-model="tpwOff")
          label(for="turn-off-tpw") Turn the Widgets off [#[abbr(title="Plain Old Semantic HTML") POSH]]
          br
          input#tabpanel-check-option-centered.input(type="checkbox" v-model="addCentered")
          label(for="tabpanel-check-option-centered") Center the tabs
          br
          input#rtl-switcher.input(type="checkbox" v-model="rtlEnabled")
          label(for="rtl-switcher") Check RTL context
        h3 "Dynamic" Widgets with default Accordion Styling
        div(:style="{width: width+'%'}")
          div
            p Classes applied to the Widget:
            ul
              li
                code.code tpw-widget
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
            .tpw-widget.tpw-bar
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
            .tpw-widget.tpw-tabpanel.tpw-bar
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
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
              li(v-if="addCentered")
                code.code.centered tpw-centered
            .tpw-widget.tpw-accordion.tpw-icons-at-the-end.tpw-animate
              include ./_vanilla-headings.pug
</template>

<script>
import * as Tabpanelwidget from "../src/tabpanelwidget.js"
import VueTabpanelwidget from "../src/tabpanelwidget.vue.js"

export default {
  name: "App",
  components: {
    VueTabpanelwidget,
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
    this.vueModes = [null, "accordion", "tabpanel"]
    // TODO allow controls of these
    // this.vueClassProps = ["animate", "chevrons-east-south", "disconnected", "icons-at-the-end", "plus-minus"]
    return {
      addCentered: false, // TODO to examples say whether this is supported or not
      addNormalize: false,
      customStylesheetHref: "",
      editCustomStylesheetHref: "",
      fontSize: 18,
      fontWeight: 500,
      rtlEnabled: false,
      space: 0,
      stylesheetHref: "",
      tpwOff: false,
      width: 72,

      vueMode: this.vueModes[0],
      vueStyle: null,
      vueCentered: false,
      vueRounded: false,
      vueRtl: false,
      vueTabs: ['Lorem', 'Ipsum', 'Dolor', 'Sit Amet'],
      // XXX some way to customize the panels
    }
  },
  mounted() {
    this.enableTpw()
  },
  computed: {
    vueProps() {
      const ret = {}
      if (this.vueCentered) ret.centered = true
      if (this.vueRounded) ret.rounded = true
      if (this.vueRtl) ret.rtl = true
      if (this.vueStyle) ret[this.vueStyle] = true
      return ret
    },
    vueCode() {
      const keys = Object.keys(this.vueProps)
      const props = keys.filter(k => this.vueProps[k]).join(" ")
      // XXX .script because otherwise parse fail
      return `<template>
  <VueTabpanelwidget ${this.vueMode ? `mode="${this.vueMode}" ` : ''}:tabs="${JSON.stringify(this.vueTabs)}"${props ? ` ${props}` : ''}>
    <template v-slot:panel-0="">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus felis id urna vulputate maximus. Aliquam vitae arcu id nulla convallis aliquam. Vivamus at nisl semper, sagittis lectus eu, fringilla nisl.<p>
      <small>This <a href="#" title="Link used to test keyboard navigation within the widget">link</a> is here to test keyboard navigation.</small>
    </template>
  </VueTabpanelwidget>
</template>

<.script>
import VueTabpanelwidget from "../src/tabpanelwidget.vue.js"

export default {
  components: {
    VueTabpanelwidget,
  },
}
</.script>`
    },
  },
  methods: {
    enableTpw() {
      this.uninstalls = []
      this.$refs.vanillaSection.querySelectorAll(`.tpw-widget`).forEach(w => Tabpanelwidget.install(w, _uninstall => {
        this.uninstalls.push(_uninstall)
      }, true))
    },
    disableTpw() {
      this.uninstalls.forEach(uninstall => uninstall())
    },
  },
  watch: {
    // not immediate because we have to wait until mount
    tpwOff(v) {
      if (v) {
        this.disableTpw()
      } else {
        this.enableTpw()
      }
    },
    addCentered(v) {
      this.$refs.vanillaSection.querySelectorAll(`.tpw-widget`).forEach(w => {
        if (v) {
          w.classList.add("tpw-centered")
        } else {
          w.classList.remove("tpw-centered")
        }
      })
    },
    rtlEnabled(v) {
      this.$refs.vanillaSection.querySelectorAll(`.tpw-widget`).forEach(w => {
        const dir = w.getAttribute("dir") || "ltr"
        w.setAttribute("dir", dir === "ltr" ? "rtl" : "ltr")
      })
    },
  },
}
</script>

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
      fieldset
        legend Options
        input#turn-off-tpw.input(type="checkbox" v-model="tpwOff")
        label(for="turn-off-tpw") Turn the Widgets off [#[abbr(title="Plain Old Semantic HTML") POSH]]
        br
        input#tabpanel-check-option-rounded.input(type="checkbox" v-model="addBorderRadius")
        label(for="tabpanel-check-option-rounded") Add "border-radius" to tabs/panels
        br
        input#tabpanel-check-option-centered.input(type="checkbox" v-model="addCentered")
        label(for="tabpanel-check-option-centered") Center the tabs
        br
        input#rtl-switcher.input(type="checkbox" v-model="rtlEnabled")
        label(for="rtl-switcher") Check RTL context
    #controls
      p
        label(for="width") Width:
        input#width(type="range" v-model="width" step="1" min="30" max="100")
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
        svg(width="30px" height="30px" viewbox="0 0 286 315" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink")
          g(stroke="none" stroke-width="1" fill="none" fill-rule="evenodd")
            g(fill="#ffffff")
              path#Path(d="M114.294,21.429 C98.78,33.018 86.087,42.725 86.087,43 C86.087,43.275 98.893,53.065 114.544,64.756 L143,86.012 L143,71.408 L143,56.804 L149.25,57.442 C174.418,60.013 194.178,67.216 211.173,80.018 C220.734,87.219 234.712,102.435 240.292,111.716 C263.404,150.152 263.404,193.379 240.292,232.407 C233.675,243.582 214.582,262.675 203.407,269.292 C168.172,290.158 128.743,292.219 93.434,275.041 C28.675,243.536 8.148,160.908 50.935,103.964 C53.177,100.979 54.897,98.222 54.756,97.837 C54.399,96.862 34.773,80 33.994,80 C33.076,80 23.998,92.463 19.646,99.7 C10.769,114.457 4.257,132.652 1.464,150.5 C-0.746,164.63 -0.084,189.259 2.85,202 C15.805,258.268 58.369,300.241 115.04,312.633 C127.107,315.271 158.883,315.27 171,312.631 C228.317,300.148 271.079,257.371 283.633,199.96 C285.08,193.341 285.482,187.256 285.482,172 C285.482,151.094 284.415,143.527 279.285,128.04 C260.907,72.57 210.327,32.798 153.776,29.351 L143.052,28.697 L142.776,14.528 L142.5,0.359 L114.294,21.429")
    #test-container(:style="{fontSize: fontSize+'px', '--space': space, fontWeight: fontWeight}")
      //- because vanilla takes over and replaces widgets... we cannot use vue to update them live (addBorderRadius + addCentered)
      div(ref="vanillaSection")
        h2 TabPanels
        div(:style="{width: width+'%'}")
          div
            h3 Headings (#[code h5])
            template(v-for="example in examples")
              h4
                code.code .tpw-widget
                code.code .tpw-tabpanel
                code.code(v-for="cls in example.classes") .tpw-{{cls}}
                code.code.centered(v-if="addCentered && !example.ignoreCentered") .tpw-centered
                code.code.rounded(v-if="addBorderRadius && !example.ignoreBorderRadius") .tpw-rounded
              .tpw-widget.tpw-tabpanel(:class="example.classes.map(cls => `tpw-${cls}`)")
                include ./_vanilla-headings.pug
          div
            h3 Definition List #[code dl]
            template(v-for="example in examples")
              h4
                code.code .tpw-widget
                code.code .tpw-tabpanel
                code.code(v-for="cls in example.classes") .tpw-{{cls}}
                code.code.centered(v-if="addCentered && !example.ignoreCentered") .tpw-centered
                code.code.rounded(v-if="addBorderRadius && !example.ignoreBorderRadius") .tpw-rounded
              dl.tpw-widget.tpw-tabpanel(:class="example.classes.map(cls => `tpw-${cls}`)")
                include ./_vanilla-dl.pug
        h2 Accordions
        div(:style="{width: width+'%'}")
          div
            h3 Headings (#[code h5])
            template(v-for="example in examples")
              h4
                code.code .tpw-widget
                code.code .tpw-accordion
                code.code(v-for="cls in example.classes") .tpw-{{cls}}
                code.code.centered(v-if="addCentered && !example.ignoreCentered") .tpw-centered
                code.code.rounded(v-if="addBorderRadius && !example.ignoreBorderRadius") .tpw-rounded
              .tpw-widget.tpw-accordion(:class="example.classes.map(cls => `tpw-${cls}`)")
                include ./_vanilla-headings.pug
          div
            h3 Definition List (#[code dl])
            template(v-for="example in examples")
              h4
                code.code .tpw-widget
                code.code .tpw-accordion
                code.code(v-for="cls in example.classes") .tpw-{{cls}}
                code.code.centered(v-if="addCentered && !example.ignoreCentered") .tpw-centered
                code.code.rounded(v-if="addBorderRadius && !example.ignoreBorderRadius") .tpw-rounded
              dl.tpw-widget.tpw-accordion(:class="example.classes.map(cls => `tpw-${cls}`)")
                include ./_vanilla-dl.pug
</template>

<script>
import * as Tabpanelwidget from "../src/tabpanelwidget.js"

export default {
  name: "App",
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
    return {
      addBorderRadius: false,
      addCentered: false, // TODO to examples say whether this is supported or not
      addNormalize: false,
      customStylesheetHref: "",
      editCustomStylesheetHref: "",
      fontSize: 10,
      fontWeight: 500,
      rtlEnabled: false,
      space: 0,
      stylesheetHref: "",
      tpwOff: false,
      width: 100,
    }
  },
  mounted() {
    this.enableTpw()
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
    addBorderRadius(v) {
      this.$refs.vanillaSection.querySelectorAll(`.tpw-widget`).forEach(w => {
        if (v) {
          w.classList.add("tpw-rounded")
        } else {
          w.classList.remove("tpw-rounded")
        }
      })
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

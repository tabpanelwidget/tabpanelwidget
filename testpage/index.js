import Vue from "vue"
import * as vuera from "vuera"

import App from "./App.vue"

Vue.use(vuera.VuePlugin)

new Vue({
  el: "#app",
  render: h => h(App),
})

import { assign } from 'es6-object-assign' // parcel is incorrectly leaving Object.assign in i believe :(
if (!Object.assign) Object.assign = assign

import Vue from "vue"
// import * as vuera from "vuera"

import App from "./App.vue"

// Vue.use(vuera.VuePlugin)

new Vue({
  el: "#app",
  render: h => h(App),
})

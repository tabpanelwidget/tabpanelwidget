// use require instead of import to order polyfill first
require('es6-object-assign').polyfill() // parcel is incorrectly leaving Object.assign in i believe :(
const Vue = require('vue').default
const App = require('./App.vue').default

// Vue.use(vuera.VuePlugin)

new Vue({
  el: '#app',
  render: h => h(App),
})

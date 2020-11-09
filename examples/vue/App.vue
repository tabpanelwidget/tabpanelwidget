<template>
  <div>
    <Tabpanelwidget :tabs="['a', 'b', 'c']">
      <template #panel-0>hello world</template>
      <template #panel-1>{{panel1}}</template>
    </Tabpanelwidget>
  </div>
</template>

<script>
// import Tabpanelwidget from "tabpanelwidget/vue"
// import "tabpanelwidget/tabpanelwidget.min.css"
import Tabpanelwidget from "../../src/tabpanelwidget.vue.js"
import "../../dist/tabpanelwidget.min.css"

export default {
  name: "App",
  components: {
    Tabpanelwidget,
  },
  created() {
    this.panel1 = "panel 1 value"
  },
}
</script>

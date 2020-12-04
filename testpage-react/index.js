import React from "react"
import ReactDOM from "react-dom"
import ReactTabpanelwidget from "../src/tabpanelwidget.react.jsx"

ReactDOM.render(<ReactTabpanelwidget>
  <ReactTabpanelwidget.Heading>heading1</ReactTabpanelwidget.Heading>
  <ReactTabpanelwidget.Panel>panel1</ReactTabpanelwidget.Panel>
  <ReactTabpanelwidget.Heading>heading2</ReactTabpanelwidget.Heading>
  <ReactTabpanelwidget.Panel>panel2</ReactTabpanelwidget.Panel>
</ReactTabpanelwidget>, document.querySelector("#app"))

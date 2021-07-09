import React from "react"
import ReactDOM from "react-dom"
import ReactTabpanelwidget from "../src/tabpanelwidget.react.jsx"

const jsx1 =
  <ReactTabpanelwidget>
    <ReactTabpanelwidget.Heading>heading1</ReactTabpanelwidget.Heading>
    <ReactTabpanelwidget.Panel>panel1</ReactTabpanelwidget.Panel>
    <ReactTabpanelwidget.Heading>heading2</ReactTabpanelwidget.Heading>
    <ReactTabpanelwidget.Panel>panel2</ReactTabpanelwidget.Panel>
    <ReactTabpanelwidget.Heading>heading3</ReactTabpanelwidget.Heading>
    <ReactTabpanelwidget.Panel>panel3</ReactTabpanelwidget.Panel>
  </ReactTabpanelwidget>

// https://github.com/tabpanelwidget/tabpanelwidget/issues/5
const tabs = [
  {
    name: "Tab 1",
    content: "Tab 1 Content"
  },
  {
    name: "Tab 2",
    content: "Tab 2 Content"
  },
  {
    name: "Tab 3",
    content: "Tab 3 Content"
  }
];
const jsx2 = 
  <ReactTabpanelwidget heading={2}>
    {tabs.map(tab => (
      <React.Fragment key={tab.name}>
        <ReactTabpanelwidget.Heading>{tab.name}</ReactTabpanelwidget.Heading>
        <ReactTabpanelwidget.Panel>{tab.content}</ReactTabpanelwidget.Panel>
      </React.Fragment>
    ))}
  </ReactTabpanelwidget>

ReactDOM.render(<div>
  {jsx1}
  {jsx2}
</div>, 
document.querySelector("#app"))

import cp from "child_process"
// this happens after:bump by release-it so we know the version has been changed
import pkg from "../package.json" assert {type: "json"}

const distFiles = [
  "tabpanelwidget.min.js",
  "tabpanelwidget-polyfill.min.js",
  "tabpanelwidget.min.css",
  "tabpanelwidget.scss",
]

cp.execSync(`cd dist && zip -r tabpanelwidget-${pkg.version}.zip ${distFiles.join(" ")}`)

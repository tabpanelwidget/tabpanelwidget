const cp = require("child_process")

// this happens after:bump by release-it so we know the version has been changed
const pkg  = require("../package.json")

const distFiles = [
  "tabpanelwidget.min.js",
  "tabpanelwidget.min.css",
  "tabpanelwidget.scss",
]

cp.execSync(`cd dist && zip -r tabpanelwidget-${pkg.version}.zip ${distFiles.join(" ")}`)

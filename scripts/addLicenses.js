const fs = require("fs")
const path = require("path")

const pkg  = require("../package.json")

const licenseText = `/*!
 * TABPANELWIDGET v${pkg.version}
 * https://tabpanelwidget.com
 * Licensed MIT © Thierry Koblentz ${new Date().getFullYear()}
 */
`

for (const file of fs.readdirSync(path.resolve(__dirname, "../dist"))) {
  const p = path.resolve(__dirname, `../dist/${file}`)
  const data = fs.readFileSync(p, "utf8")
  fs.writeFileSync(p, licenseText + '\n' + data)
}

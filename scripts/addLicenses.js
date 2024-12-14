import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import pkg from "../package.json" assert {type: "json"}

const licenseText = `/*!
 * TABPANELWIDGET v${pkg.version}
 * https://tabpanelwidget.com
 * Licensed MIT © Thierry Koblentz ${new Date().getFullYear()}
 */
`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

for (const file of fs.readdirSync(path.resolve(__dirname, "../dist"))) {
  const p = path.resolve(__dirname, `../dist/${file}`)
  const data = fs.readFileSync(p, "utf8")
  fs.writeFileSync(p, licenseText + '\n' + data)
}

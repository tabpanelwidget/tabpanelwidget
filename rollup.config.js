import babel from "rollup-plugin-babel"
import jsx from "rollup-plugin-jsx"
import { terser } from "rollup-plugin-terser"

const configureBabel = () => {
  return babel({
    exclude: "node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
  })
}

const configureJsx = () => {
  return jsx({
    factory: "React.createElement",
    include: "*.jsx",
  })
}

const configureTerser = () => {
  return terser({
    output: {
      ecma: 5,
    },
  })
}

const builds = []

builds.push({
  input: "src/tabpanelwidget.js",
  output: {
    compact: true,
    file: "dist/tabpanelwidget.min.js",
    format: "iife",
    exports: "named",
    name: 'Tabpanelwidget',
  },
  plugins: [
    configureBabel(),
    configureTerser(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.vue.js",
  output: {
    compact: true,
    file: "dist/tabpanelwidget.vue.min.js",
    format: "iife",
    exports: "named",
    name: 'Tabpanelwidget',
  },
  plugins: [
    configureBabel(),
    configureTerser(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.react.jsx",
  output: {
    compact: true,
    file: "dist/tabpanelwidget.react.min.js",
    format: "iife",
    exports: "named",
    name: 'Tabpanelwidget',
  },
  plugins: [
    configureBabel(),
    configureJsx(),
    configureTerser(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.js",
  output: {
    file: "dist/esm/tabpanelwidget.js",
    format: "esm",
    exports: "named",
  },
  plugins: [
    configureBabel(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.vue.js",
  output: {
    file: "dist/esm/tabpanelwidget.vue.js",
    format: "esm",
    exports: "named",
  },
  plugins: [
    configureBabel(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.react.jsx",
  output: {
    file: "dist/esm/tabpanelwidget.react.js",
    format: "esm",
    exports: "named",
  },
  plugins: [
    configureBabel(),
    configureJsx(),
  ],
})

// scss gets copied

export default builds

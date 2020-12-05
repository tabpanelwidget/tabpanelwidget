import babel from "rollup-plugin-babel"
import jsx from "rollup-plugin-jsx"
import { terser } from "rollup-plugin-terser"
import replace from "@rollup/plugin-replace"
import { nodeResolve } from "@rollup/plugin-node-resolve"

const configureBabel = () => {
  return babel({
    exclude: "node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
    plugins: ["@babel/plugin-proposal-class-properties"],
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

const configureReplace = (esbuild) => {
  return replace({
    "process.env.ES_BUILD": ""+esbuild,
  })
}

const builds = []

builds.push({
  input: "src/polyfill.js",
  output: {
    compact: true,
    file: "dist/tabpanelwidget-polyfill.min.js",
    format: "iife",
  },
  plugins: [
    configureReplace(false),
    nodeResolve(),
    configureBabel(),
    configureTerser(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.js",
  output: {
    compact: true,
    file: "dist/tabpanelwidget.min.js",
    format: "iife",
    exports: "named",
    name: "Tabpanelwidget",
  },
  plugins: [
    configureReplace(false),
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
    name: "Tabpanelwidget",
  },
  plugins: [
    configureReplace(false),
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
    name: "Tabpanelwidget",
  },
  plugins: [
    configureReplace(false),
    configureBabel(),
    configureJsx(),
    configureTerser(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.js",
  output: {
    file: "dist/tabpanelwidget.mjs",
    format: "esm",
    exports: "named",
  },
  plugins: [
    configureReplace(true),
    configureBabel(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.vue.js",
  output: {
    file: "dist/tabpanelwidget.vue.mjs",
    format: "esm",
    exports: "named",
  },
  plugins: [
    configureReplace(true),
    configureBabel(),
  ],
})

builds.push({
  input: "src/tabpanelwidget.react.jsx",
  output: {
    file: "dist/tabpanelwidget.react.mjs",
    format: "esm",
    exports: "named",
  },
  plugins: [
    configureReplace(true),
    configureBabel(),
    configureJsx(),
  ],
})

export default builds

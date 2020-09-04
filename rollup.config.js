import babel from "rollup-plugin-babel"
import jsx from "rollup-plugin-jsx"

const configureBabel = () => {
  return babel({
    exclude: "node_modules/**",
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
  })
}

// TODO esm, iife, etc.
export default [
  {
    input: "src/tabpanelwidget.js",
    output: {
      file: "dist/tabpanelwidget.js",
    },
    plugins: [
      configureBabel(),
    ],
  },
  {
    input: "src/tabpanelwidget.vue.js",
    output: {
      file: "dist/tabpanelwidget.vue.js",
    },
    plugins: [
      configureBabel(),
    ],
  },
  {
    input: "src/tabpanelwidget.react.jsx",
    output: {
      file: "dist/tabpanelwidget.react.js",
    },
    plugins: [
      configureBabel(),
      jsx({
        factory: "React.createElement",
        include: "*.jsx",
      }),
    ],
  },
]

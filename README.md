# Tabpanelwidget

This module contains the [standalone (vanilla) script](#vanilla), a [Vue component](#vue), and a [React component](#react).

## TODO

- [ ] use storybook instead of index.html (and vite)...? (would make playing with components better)

## Different ways to use Tabpanelwidget

   * [Vanilla](#vanilla)
   * [Vue](#vue)
   * [React](#react)
   * [Angular](#angular)
   * [Ember](#ember)
   * ["Old School"](#old-school)
   
### Vanilla

```js
import * as Tabpanelwidget from "@tabpanelwidget/tabpanelwidget"

const el = document.querySelector('#my-element')
const uninstall = Tabpanelwidget.install(el)
// or Tabpanelwidget.autoinstall()

// later...
uninstall()
```

### Vue

```js
<script>
import VueTabpanelwidget from "@tabpanelwidget/tabpanelwidget"

Vue.use(VueTabpanelwidget)
// or Vue.component("Tabpanelwidget", VueTabpanelwidget)
// or in component, components: { VueTabpanelwidget, ... }
```

```html
<Tabpanelwidget prop1={} prop2={}>
	<!-- TODO -->
</Tabpanelwidget>
```

### React

```jsx
import ReactTabpanelwidget from "@tabpanelwidget/tabpanelwidget"

<ReactTabpanelwidget prop1={} prop2={}>
	<!-- TODO -->
</ReactTabpanelwidget>
```

### Angular

Coming soon!

### Ember

Coming soon!

### Old School

Coming soon!

## Development

Install dependencies and then opens index.html with vite (hot reload, etc.)

```bash
% npm install
% npm run dev
```

Various build scripts, for example:

```bash
% npm run build:css
% npm run build:js
```

To release new version of npm package:

```bash
% npx release-it
```

To check things post release (open index.html without vite),

```bash
% open index.html
```

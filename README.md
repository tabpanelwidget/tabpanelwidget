# Tabpanelwidget

This module contains the [standalone (vanilla) script](#vanilla), a [Vue component](#vue), and a [React component](#react).

## TODO

- [ ] use storybook instead of index.html (and vite)...? (would make playing with components better)

# Vanilla

```js
import { Tabpanelwidget } from "@tabpanelwidget/tabpanelwidget"

const el = document.querySelector('#my-element')
const uninstall = Tabpanelwidget.install(el)
// or Tabpanelwidget.autoinstall()

// later...
uninstall()
```

# Vue

```js
<script>
import { VueTabpanelwidget } from "@tabpanelwidget/tabpanelwidget"

Vue.use(VueTabpanelwidget)
// or Vue.component("Tabpanelwidget", VueTabpanelwidget)
// or in component, components: { VueTabpanelwidget, ... }
```

```html
<Tabpanelwidget prop1={} prop2={}>
	<!-- TODO -->
</Tabpanelwidget>
```

# React

```jsx
import { ReactTabpanelwidget } from "@tabpanelwidget/tabpanelwidget"

<ReactTabpanelwidget prop1={} prop2={}>
	<!-- TODO -->
</ReactTabpanelwidget>
```

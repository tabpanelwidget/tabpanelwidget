# Changelog

## [3.0.2]

- FIXED: Include dist/tabpanelwidget.min.css again

> Was caused by build error from upgrading sass and no pipefail in build:css command, ~this is now caught~ (fix npm script sh pipefail illegal)

## [3.0.1]

- FIXED: don't break accordion headings on long strings

## [3.0.0]

- CHANGED: New CSS rules mostly related to focus state (criterion 1.4)

## [2.0.1]

- FIXED: don't break on bad tpw-hist indices
- CHANGED: remove role=presentation on headings

## [2.0.0]

**BREAKING CHANGE**: `tabpanelwidget/vue` only supports vue 3

- ADDED: vue 3 support
- ADDED: History mode (via `data-tpw-id`) to vanilla script (not in React, Vue)
- REMOVED: vue <=2.6 support

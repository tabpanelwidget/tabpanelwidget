import React, { useEffect, useRef, useState } from "react"

const ACCORDION = "accordion"
const TABPANEL = "tabpanel"

export default function ReactTabpanelwidget(props) {
  if (!(typeof props.mode === "undefined" || props.mode === ACCORDION || props.mode === TABPANEL)) {
    throw new Error(`mode prop should be undefined, "accordion", or "tabpanel"`)
  }
  // XXX check props.selectedIdxs, props.tabs?

  if (!window.tpwId) window.tpwId = 0

  const [id] = useState(window.tpwId++)
  const [selectedTabIdx, setSelectedTabIdx] = useState(props.selectedIdxs ? Math.min(props.selectedIdxs[0] || 0, this.tabs.length - 1) : 0)
  const [expandedTabsIdx, setExpandedTabsIdx] = useState({})
  const [internalMode, setInternalMode] = useState(props.mode)

  const refSkipLink = useRef(null) // TODO

  const tabId = idx => `tpw-${id}-${idx}-t`
  const panelId = idx => `tpw-${id}-${idx}-p`

  const isDynamic = !props.mode
  const isAccordion = internalMode.current === ACCORDION
  const isTabpanel = internalMode.current === TABPANEL
  const tabIds = props.tabs.map((_, idx) => tabId(idx))

  useEffect(() => {
    if (isDynamic) {
      // TODO set up resize shit
    }
  })

  function renderShadow() {
    return (
      <div>
      </div>
    )
  }

  function renderSkipLink() {
    return (
      <a ref={refSkipLink} href={`#tpw-${id.current}-0-t`} tabindex={-1} className="tpw-skip">
        <b>Tab through to leave this widget<br/>or<br/> Click to go back to the first {isAccordion ? "header" : "tab"}</b>
      </a>
    )
  }

  function renderTablist() {
    return (
      <div role="tablist" aria-owns={tabIds.join(" ")}></div>
    )
  }

  function renderShadow() {
    return (
      <div aria-hidden="true" className="tpw-shadow">
        {tabs.forEach(tab => {
          // XXX renderTabpanelHx
          return (
            <div></div>
          )
        })}
      </div>
    )
  }

  function renderAccordion() {
    return (
      <div className="tpw-widget tpw-js tpw-accordion">
        {isDynamic && renderShadow()}
        {renderSkipLink()}
      </div>
    )
  }

  function renderTabpanel() {
    // TODO keydown stuff}
    return (
      <div className="tpw-widget tpw-js tpw-tabpanel">
        {isDynamic && renderShadow()}
        {renderTablist()}
        {tabs.forEach(tab => {
          return (
            <div>TAB</div> // TODO
          )
        })}
        {renderSkipLink()}
      </div>
    )
  }

  return isAccordion ? renderAccordion() : renderTabpanel()
}

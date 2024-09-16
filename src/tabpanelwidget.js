const debounced = function(fn, ms) {
  let timeout
  return function(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}
const noop = () => {}
let buffered = []
let popstateDispose
let hist
const applyHistByKey = {}

// must alternate heading element(div) heading element.. etc
// XXX better name for automatic (something about the recursion behavior)
function _install(orig, automatic, cb) {
  if (orig.classList.contains("tpw-js")) return cb(noop) // already installed
  if (!orig.parentNode) return cb(noop)
  if (automatic) {
    // wait for parent to automatically install first
    const parent = orig.parentNode.closest(".tpw-widget")
    if (parent && !parent.classList.contains("tpw-js")) return cb(noop) // recursion will handle us
  }

  const { tpwId: histKey, tpwPush } = orig.dataset

  const origVisibility = orig.style.visibility
  orig.style.visibility = "hidden"

  const widget = document.createElement("div")
  for (let i = 0; i < orig.attributes.length; i++) {
    const attr = orig.attributes.item(i)
    widget.setAttribute(attr.name, attr.value)
  }

  widget.classList.add("tpw-widget")
  widget.classList.add("tpw-js")
  if (!window.tpwId) window.tpwId = 0
  const id = window.tpwId++

  const forceAccordion = orig.classList.contains("tpw-accordion")
  const forceTabpanel = orig.classList.contains("tpw-tabpanel")
  if (forceAccordion && forceTabpanel) {
    throw new Error("should only use .tpw-accordion OR .tpw-tabpanel, not both (for dynamic just use .tpw-widget)")
  }
  const dynamic = !(forceAccordion || forceTabpanel)

  const hxs = []
  const shadowHxs = []
  const spans = []
  const shims = []
  const skipB = document.createElement("b")

  const tablist = document.createElement("div")
  tablist.setAttribute("role", "tablist")

  let accordion
  function setAccordion(v, resizeCheck) {
    accordion = v
    skipB.innerHTML = `Tab through to leave this widget <br />or<br /> follow this link to go back to the first ${accordion ? "header" : "tab"}`
    if (v) {
      widget.classList.remove("tpw-tabpanel")
      widget.classList.add("tpw-accordion")
      if (tablist.parentNode) {
        tablist.parentNode.removeChild(tablist)
      }
    } else {
      widget.classList.remove("tpw-accordion")
      widget.classList.add("tpw-tabpanel")
      if (!resizeCheck) {
        expandedTabIdxs = {}
        expandedTabIdxs[selectedTabIdx] = true
      }
      widget.insertBefore(tablist, hxs[0]) // so that tpw-shadow stays first
    }
    for (let idx = 0; idx < hxs.length; idx++) {
      const hx = hxs[idx]
      const span = spans[idx]
      const shim = shims[idx]
      if (v) {
        span.classList.remove("tpw-tab")
        span.classList.add("tpw-header")
        span.setAttribute("role", "button")
        span.removeAttribute("aria-selected")
        // keep tpw-selected on shadow so it is still styled the same as tabpanel would be
        // if (shadow) shadowHxs[idx].classList.remove("tpw-selected")
        if (expandedTabIdxs[idx]) {
          hx.classList.add("tpw-selected")
          span.setAttribute("aria-expanded", "true")
        } else {
          hx.classList.remove("tpw-selected")
          span.setAttribute("aria-expanded", "false")
        }
        span.setAttribute("tabindex", "0")
        shim.setAttribute("role", "region")
        hx.removeAttribute("role")
      } else {
        span.classList.remove("tpw-header")
        span.classList.add("tpw-tab")
        span.setAttribute("role", "tab")
        span.removeAttribute("aria-expanded")
        if (selectedTabIdx === idx) {
          span.setAttribute("aria-selected", "true")
          hx.classList.add("tpw-selected")
          if (shadow) shadowHxs[idx].classList.add("tpw-selected")
        } else {
          span.removeAttribute("aria-selected")
          hx.classList.remove("tpw-selected")
          if (shadow) shadowHxs[idx].classList.remove("tpw-selected")
        }
        span.setAttribute("tabindex", selectedTabIdx === idx ? "0" : "-1")
        shim.setAttribute("role", "tabpanel")
        hx.setAttribute("role", "presentation")
      }
      if ((v && expandedTabIdxs[idx]) || (!v && selectedTabIdx === idx)) {
        shim.removeAttribute("hidden")
      } else {
        shim.setAttribute("hidden", "")
      }
    }
    widget.style.visibility = "visible"
  }

  let selectedTabIdx
  let expandedTabIdxs = {}

  let maybeUpdateHist = () => {}
  if (histKey) {
    if (!hist) {
      const url = new URL(window.location)
      const queryTpw = url.searchParams.get("_tpw")
      if (queryTpw) {
        try {
          hist = JSON.parse(atob(queryTpw))
        } catch (e) {}
      }
      hist = hist || {}
    }

    maybeUpdateHist = (idx) => {
      hist[histKey] = idx
      const url = new URL(window.location)
      url.searchParams.set("_tpw", btoa(JSON.stringify(hist)).replace(/=*$/, ""))
      window.history[tpwPush ? "pushState" : "replaceState"]({tpwHist: hist}, "", url.toString())
    }

    applyHistByKey[histKey] = (idx) => setSelectedTabIdx(idx, false)
    if (hist[histKey] != null) {
      selectedTabIdx = hist[histKey]
    }

    if (!popstateDispose) {
      const onPopstate = (e) => {
        if (!e.state?.tpwHist) {
          return
        }
        hist = e.state.tpwHist
        for (const k in hist) {
          applyHistByKey[k]?.(hist[k])
        }
      }
      window.addEventListener("popstate", onPopstate)
      popstateDispose = () => window.removeEventListener("popstate", onPopstate)
    }
  }

  function setSelectedTabIdx(idx, updateHist = true) {
    if (selectedTabIdx === idx) {
      return
    }
    if (selectedTabIdx != null) {
      spans[selectedTabIdx].setAttribute("tabindex", "-1")
      spans[selectedTabIdx].removeAttribute("aria-selected")
      hxs[selectedTabIdx].classList.remove("tpw-selected")
      if (shadow) shadowHxs[selectedTabIdx].classList.remove("tpw-selected")
      shims[selectedTabIdx].setAttribute("hidden", "")
    }
    spans[idx].setAttribute("tabindex", "0")
    spans[idx].setAttribute("aria-selected", "true")
    hxs[idx].classList.add("tpw-selected")
    if (shadow) shadowHxs[idx].classList.add("tpw-selected")
    shims[idx].removeAttribute("hidden")
    selectedTabIdx = idx
    if (updateHist) {
      maybeUpdateHist(idx)
    }
  }

  function wrapFocusTabIdx(idx) {
    if (idx < 0) {
      idx = spans.length - 1
    } else if (idx >= spans.length) {
      idx = 0
    }
    spans[idx].focus()
  }

  // XXX what is aria-hidden... should we be setting aria-expanded to false instead of removing attribute?
  // ... remove when switch accordion status
  function toggleExpandedIdx(idx) {
    expandedTabIdxs[idx] = !expandedTabIdxs[idx]
    if (expandedTabIdxs[idx]) {
      selectedTabIdx = idx // remember last expanded for converting back to tabpanel
      hxs[idx].classList.add("tpw-selected")
      spans[idx].setAttribute("aria-expanded", "true")
      shims[idx].removeAttribute("hidden")
    } else {
      hxs[idx].classList.remove("tpw-selected")
      spans[idx].setAttribute("aria-expanded", "false")
      shims[idx].setAttribute("hidden", "")
    }
  }

  const eventListeners = []
  function addEventListener(el, e, handler) {
    el.addEventListener(e, handler)
    eventListeners.push([el, e, handler])
  }

  let movedNodes = [] // [node, oldParent, nextSibling]
  function moveNode(node, newParent) {
    movedNodes.push([node, node.parentNode, node.nextSibling])
    node.parentNode.removeChild(node)
    newParent.appendChild(node)
  }
  function unmoveNodes() {
    for (let i = movedNodes.length - 1; i >= 0; i--) {
      const [node, oldParent, oldNextSibling] = movedNodes[i]
      node.parentNode.removeChild(node)
      oldParent.insertBefore(node, oldNextSibling)
    }
    movedNodes = []
  }

  let prevOrigElements = []
  function makeShim(hx, last = false) {
    if (!hx) return
    const shimIdx = shims.length
    const shim = document.createElement("div")
    shims.push(shim)
    shim.classList.add("tpw-shim")
    shim.setAttribute("id", `tpw-${id}-${shimIdx}-p`)
    shim.setAttribute("tabindex", "0")
    shim.setAttribute("hidden", "")
    shim.setAttribute("aria-labelledby", `tpw-${id}-${shimIdx}-t`)
    const panel = document.createElement("div")
    shim.appendChild(panel)
    panel.classList.add("tpw-panel")
    prevOrigElements.forEach(prevElement => {
      if (prevElement.tagName === "DD") {
        for (const node of [...prevElement.childNodes]) {
          moveNode(node, panel)
        }
      } else {
        moveNode(prevElement, panel)
      }
    })
    if (last) {
      hx.parentNode.appendChild(shim)
    } else {
      hx.parentNode.insertBefore(shim, hx.nextSibling)
    }
    prevOrigElements = []
  }

  // origHx can be dt or h{1,6} tag
  function makeHx(origHx) {
    const tagName = origHx.tagName === "DT" ? "div" : origHx.tagName
    const hx = document.createElement(tagName)
    for (let i = 0; i < origHx.attributes.length; i++) {
      const attr = origHx.attributes.item(i)
      hx.setAttribute(attr.name, attr.value)
    }
    const hxIdx = hxs.length
    widget.appendChild(hx)
    hxs.push(hx)
    hx.classList.add("tpw-hx")
    // XXX should we recal initial position of tpw-selected and restore it on uninstall?
    if (origHx.classList.contains("tpw-selected")) {
      selectedTabIdx = hxIdx
      expandedTabIdxs[hxIdx] = true
    }
    const span = document.createElement("span")
    spans.push(span)
    for (const node of [...origHx.childNodes]) {
      moveNode(node, span)
    }
    hx.appendChild(span)
    span.setAttribute("id", `tpw-${id}-${hxIdx}-t`)
    span.setAttribute("tabindex", "-1")
    span.setAttribute("aria-controls", `tpw-${id}-${hxIdx}-p`)
    addEventListener(span, "click", () => {
      if (accordion) {
        toggleExpandedIdx(hxIdx)
      } else {
        setSelectedTabIdx(hxIdx)
      }
    })
    addEventListener(span, "focus", () => {
      if (!accordion) {
        setSelectedTabIdx(hxIdx)
      }
    })
    addEventListener(span, "keydown", e => {
      switch (e.which) {
        case 13: // enter
        case 32: // space
          if (accordion) {
            e.preventDefault()
            toggleExpandedIdx(hxIdx)
          }
          break
        case 37: // arrow left
        case 38: // arrow up
          if (e.which === (accordion ? 38 : 37)) {
            e.preventDefault()
            wrapFocusTabIdx(hxIdx - 1)
          }
          break
        case 39: // arrow right
        case 40: // arrow down
          if (e.which === (accordion ? 40 : 39)) {
            e.preventDefault()
            wrapFocusTabIdx(hxIdx + 1)
          }
          break
      }
    })
    return hx
  }

  let shadow
  if (dynamic) {
    shadow = document.createElement("div")
    shadow.classList.add("tpw-shadow")
    shadow.setAttribute("aria-hidden", "true")
  }

  const isDl = orig.tagName === "DL"
  let child = orig.children[0]
  const firstChildTagName = child.tagName
  if (!isDl && !/H[1-6]/.test(firstChildTagName)) {
    console.warn("tabpanelwidget: first child must be heading")
    return cb(noop)
  }
  let hx
  while (child) {
    const nextChild = child.nextElementSibling
    if (isDl ? child.tagName === "DT" : child.tagName === firstChildTagName) {
      if (hx) makeShim(hx)
      hx = makeHx(child)
      if (shadow) {
        const shadowHx = hx.cloneNode(true)
        shadowHx.removeAttribute("id")
        const shadowSpan = shadowHx.children[0]
        shadowSpan.classList.add("tpw-tab")
        shadowSpan.removeAttribute("aria-controls")
        shadowSpan.removeAttribute("aria-selected")
        shadowSpan.removeAttribute("id")
        shadowSpan.removeAttribute("role")
        shadowSpan.removeAttribute("tabindex")
        shadowHxs.push(shadowHx)
        shadow.appendChild(shadowHx)
      }
    } else {
      // only allow one element in prevOrigElements for dl
      if (isDl && (prevOrigElements.length || child.tagName !== "DD")) {
        console.warn("tabpanelwidget: dl must have alternating dt, dd")
        return cb(noop)
      }
      prevOrigElements.push(child)
    }
    child = nextChild
  }
  makeShim(hx, true)

  tablist.setAttribute("aria-owns", spans.map(tab => tab.id).join(" "))

  if (!selectedTabIdx) {
    selectedTabIdx = 0
  }

  let resizeObserver

  const maybeRecomputeLayout = () => {
    if (!shadowHxs.length) return
    // heuristic ignores margin / border because css sets to 0 !important
    let maxShadowHxHeight = 0
    shadowHxs.forEach(shadowHx => {
      if (maxShadowHxHeight < shadowHx.clientHeight) {
        maxShadowHxHeight = shadowHx.clientHeight
      }
    })
    setAccordion(shadow.clientHeight > maxShadowHxHeight)
  }
  const debouncedMaybeRecomputeLayout = debounced(maybeRecomputeLayout, 100)

  if (dynamic) {
    // XXX optimize to just make one of these handlers for all tpws (instead of per widget)
    resizeObserver = new window.ResizeObserver(debouncedMaybeRecomputeLayout)
    resizeObserver.observe(widget, {box: "border-box"})
    spans.forEach(span => resizeObserver.observe(span, {box: "border-box"}))
  } else {
    setAccordion(forceAccordion)
  }

  const skip = document.createElement("a")
  skip.classList.add("tpw-skip")
  skip.setAttribute("tabindex", "-1")
  skip.setAttribute("href", `#tpw-${id}-0-t`)
  skip.appendChild(skipB)
  widget.appendChild(skip)

  let prevFocused
  addEventListener(widget, "keydown", e => {
    switch (e.which) {
      case 27: // escape
        if (document.activeElement === skip) {
          (prevFocused || widget).focus()
        } else {
          prevFocused = document.activeElement
          skip.focus()
        }
        break
      case 35: // end
        e.preventDefault()
        spans[spans.length - 1].focus()
        break
      case 36: // home
        e.preventDefault()
        spans[0].focus()
        break
    }
  })

  if (dynamic) {
    widget.insertBefore(shadow, widget.firstChild)
  }

  orig.parentNode.replaceChild(widget, orig)
  orig.style.visibility = origVisibility

  const childUninstalls = []
  let continuePromise
  if (automatic) {
    const childWidgets = widget.querySelectorAll(".tpw-widget")
    const childInstallPromises = []
    childWidgets.forEach(w => childInstallPromises.push(_install(w, true)))
    continuePromise = Promise.all(childInstallPromises)
  } else {
    continuePromise = Promise.resolve()
  }

  // XXX ensure no closure leakagages (even elsewhere)
  let uninstalled
  continuePromise.then(() => {
    cb(() => {
      if (uninstalled) return
      childUninstalls.forEach(uninstall => uninstall())
      if (resizeObserver) resizeObserver.disconnect()
      window.removeEventListener("resize", debouncedMaybeRecomputeLayout)
      eventListeners.forEach(([el, e, handler]) => el.removeEventListener(e, handler))
      unmoveNodes()
      widget.parentNode.replaceChild(orig, widget)
      uninstalled = true
    })
  })
}

function _areFeaturesSupported() {
  // XXX improve this
  return !!window.ResizeObserver
}

function _documentReady() {
  return document.readyState !== "loading"
}

function _runBuffered() {
  if (_areFeaturesSupported()) {
    if (!_documentReady()) {
      // we will _runBuffered again when ready
      return
    }
    buffered.forEach(fn => fn())
    buffered = []
  }
  // either we have completed our first pass or they may not have polyfill and we
  // dont want to end up with visibility:hidden, so just disable fouc protection
  // XXX in reality we may not wait until all widgets have finished mounting, but should be good enough
  // usage: html:not(.no-js):not(.tpw-\!fouc) .tpw-widget {visibility:hidden}
  document.documentElement.classList.add("tpw-!fouc")
}

// install(orig) -> returns promise
// install(orig, cb)
// install(orig, cb, automatic)
// install(orig, automatic) -> returns promise
function install(...args) {
  const orig = args[0]
  let cb = null, automatic = false
  if (typeof args[2] === "undefined") {
    if (typeof args[1] === "function") {
      cb = args[1]
    } else if (typeof args[1] === "boolean") {
      automatic = args[1]
    }
  } else {
    cb = args[1]
    automatic = args[2]
  }
  let p
  if (cb) {
    buffered.push(() => _install(orig, automatic, cb))
  } else {
    p = new Promise(resolve => buffered.push(() => _install(orig, automatic, resolve)))
  }
  _runBuffered()
  return p
}

function autoinstall() {
  buffered.push(() => document.querySelectorAll(`.tpw-widget`).forEach(w => _install(w, true, noop)))
  _runBuffered()
}

if (document.readyState == 'loading') {
  document.addEventListener("DOMContentLoaded", () => _runBuffered())
}

export {
  install,
  autoinstall,
  _runBuffered, // this is exported but just used by polyfill... so we don't have to poll
}

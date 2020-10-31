const debounced = function(fn, ms) {
  let timeout
  return function(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), ms)
  }
}
const noop = () => {}
let buffered = []

// this allows us to do FOUC protection html:not(.no-js):not(.tpw-\!fouc) .tpw-widget {visibility:hidden}
function _addNoFouc() {
  document.documentElement.classList.add("tpw-!fouc")
}

// must alternate heading element(div) heading element.. etc
// XXX better name for automatic (something about the recursion behavior)
function _install(orig, cb = null, automatic = false) {
  if (orig.classList.contains("tpw-js")) return cb && cb(noop) // already installed
  if (automatic) {
    // wait for parent to automatically install first
    const parent = orig.parentNode.closest(".tpw-widget")
    if (parent && !parent.classList.contains("tpw-js")) return cb && cb(noop) // recursion will handle us
  }

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
    skipB.innerHTML = `Tab through to leave this widget <br />or<br /> Click to go back to the first ${accordion ? "header" : "tab"}`
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
        if (shadow) shadowHxs[idx].classList.remove("tpw-selected")
        if (expandedTabIdxs[idx]) {
          hx.classList.add("tpw-selected")
          span.setAttribute("aria-expanded", "true")
        } else {
          hx.classList.remove("tpw-selected")
        }
        span.setAttribute("tabindex", "0")
        shim.setAttribute("role", "region")
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

  function setSelectedTabIdx(idx) {
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
      spans[idx].removeAttribute("aria-expanded")
      shims[idx].setAttribute("hidden", "")
    }
  }

  const eventListeners = []
  function addEventListener(el, e, handler) {
    el.addEventListener(e, handler)
    eventListeners.push([el, e, handler])
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
        panel.innerHTML = prevElement.innerHTML
      } else {
        panel.appendChild(prevElement.cloneNode(true))
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
    span.innerHTML = origHx.innerHTML
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

  // TODO do we want to start with fresh nodes and carry over only what we need so they don't screw things up?
  // ... maybe they want an attribute or something to target with so need to figure out best thing
  const isDl = orig.tagName === "DL"
  let child = orig.children[0]
  const firstChildTagName = child.tagName
  if (!isDl && !/H[1-6]/.test(firstChildTagName)) {
    console.warn("tabpanelwidget: first child must be heading")
    return cb && cb(noop)
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
        return cb && cb(noop)
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

  // if in accordion, can only go into tabpanel if the widget width grows...
  const maybeRecomputeLayout = () => {
    if (!shadowHxs.length) return
    let offsetTop = shadowHxs[0].offsetTop
    let offsetBot = offsetTop + shadowHxs[0].clientHeight
    shadowHxs.forEach(shadowHx => {
      if (shadowHx.offsetTop !== offsetTop) offsetTop = null
      if (shadowHx.offsetTop + shadowHx.clientHeight !== offsetBot) offsetBot = null
    })
    setAccordion(offsetTop === null && offsetBot === null)
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
  if (automatic) {
    const childWidgets = widget.querySelectorAll(".tpw-widget")
    childWidgets.forEach(w => childUninstalls.push(install(w, true)))
    // XXX ideally we want to do this when all widgets have been replaced after first pass
    _addNoFouc()
  }

  // XXX ensure no closure leakagages (even elsewhere)
  let uninstalled
  return cb && cb(() => {
    if (uninstalled) return
    childUninstalls.forEach(uninstall => uninstall())
    if (resizeObserver) resizeObserver.disconnect()
    window.removeEventListener("resize", debouncedMaybeRecomputeLayout)
    eventListeners.forEach(([el, e, handler]) => el.removeEventListener(e, handler))
    widget.parentNode.replaceChild(orig, widget)
    uninstalled = true
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
    if (_documentReady()) {
      buffered.forEach(fn => fn())
      buffered = []
    }
  } else {
    // dont want to end up with visibility:hidden (if they don't load polyfill)
    // so just disable fouc protection in that case
    _addNoFouc()
  }
}

function install(...args) {
  buffered.push(() => _install(...args))
  _runBuffered()
}

function autoinstall() {
  buffered.push(() => {
    document.querySelectorAll(`.tpw-widget`).forEach(w => _install(w, null, true))
  })
  _runBuffered()
}

if (document.readyState == 'loading') {
  document.addEventListener("DOMContentLoaded", () => {
    _runBuffered()
  })
}

export {
  install, // no longer returns install, but returns promise that resolves to uninstall
  autoinstall,
  _runBuffered, // this is exported but just used by polyfill... so we don't have to poll
}

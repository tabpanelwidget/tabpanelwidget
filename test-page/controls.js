//- XXX convert all this to vue?
//- fix the uninstall
;(function() {
  const html = document.documentElement
  let tabpanelCheckOptionRounded = document.querySelector("#tabpanel-check-option-rounded")
  let tabpanelCheckOptionCentered = document.querySelector("#tabpanel-check-option-centered")
  let thePage = document.querySelector("#test-container")
  let tabPanels = document.querySelector("#test-container > div:first-of-type")
  let accordions = document.querySelector("#test-container > div:last-of-type")
  let fontSize = document.querySelector("#fontSize")
  let fontWeight = document.querySelector("#fontWeight")
  let space = document.querySelector("#space")
  let sizeSlider = document.querySelector("#width")
  let stylesheetSwitcher = document.querySelector("#stylesheet-switcher")
  let stylesheet = document.querySelector("#the-sheet")
  let normalize = document.querySelector("#normalize")
  let setURL = document.querySelector("#set-url")
  let theURL = document.querySelector("#url")
  let normalizeYN = document.querySelector("#normalizeYN")
  let rtlSwitcher = document.querySelector("#rtl-switcher");
  // resize the main container
  sizeSlider.addEventListener("change", (e) => {
    tabPanels.style.width = sizeSlider.value + '%';
    accordions.style.width = sizeSlider.value + '%';
  });
  // Increase/Decrease the font-size
  fontSize.addEventListener("change", (e) => {
    html.style.fontSize = fontSize.value + 'px';
  });
  // Increase/Decrease the font-weight
  fontWeight.addEventListener("change", (e) => {
    document.querySelectorAll(".tpw-tab").forEach(el => {
      el.style.fontWeight = fontWeight.value;
    })
  });
  // Increase/Decrease space
  space.addEventListener("change", (e) => {
    thePage.style.setProperty('--space', space.value)
  });
  // Inserts Stylesheet via input
  setURL.addEventListener("click", (e) => {
    stylesheet.href = theURL.value;
  });
  // Inserts Normalize
  normalizeYN.addEventListener("change", (e) => {
    e.target.checked ? normalize.href = normalizeYN.value : normalize.href = ""
  });
  // Inserts Stylesheet via select
  stylesheetSwitcher.addEventListener("change", (e) => {
    stylesheet.href = stylesheetSwitcher.value;
  });
  // Add border-radius to tabs in tabpanel
  tabpanelCheckOptionRounded.addEventListener("change", (e) => {
    document.querySelectorAll(".rounded").forEach(el => {
      el.classList.toggle("hidden");
    })
    document.querySelectorAll(".tpw-tabpanel").forEach(el => {
      el.classList.toggle("tpw-rounded");
    })
  });
  // Centers the tabs in tabpanel
  tabpanelCheckOptionCentered.addEventListener("change", (e) => {
    document.querySelectorAll(".centered").forEach(el => {
      el.classList.toggle("hidden");
    })
    document.querySelectorAll(".tpw-tabpanel").forEach(el => {
      el.classList.toggle("tpw-centered");
    })
  });
  let uninstalls = []

  function installWidgets() {
    document.querySelectorAll(".tpw-widget").forEach(el => {
      uninstalls.push(tpw.install(el, true));
    })
  }

  function uninstallWidgets() {
    uninstalls.map(uninstall => uninstall())
    uninstalls = []
  }
  installWidgets()
  document.querySelector("#turn-off-tpw").addEventListener("change", e => {
    e.target.checked ? uninstallWidgets() : installWidgets()
  }, {
    passive: true
  })
  // RTL switcher
  let widgets = document.querySelectorAll(".tpw-widget")
  rtlSwitcher.addEventListener("change", (e) => {
    widgets.forEach(el => {
      const dir = el.getAttribute("dir") || "ltr"
      el.setAttribute("dir", dir === "ltr" ? "rtl" : "ltr");
    })
  });
})()

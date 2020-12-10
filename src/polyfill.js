// XXX would be better to use core-js / babel to detect which features are needed...

import ResizeObserver from 'resize-observer-polyfill'
if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver
}

// https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach#Polyfill
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;

    do {
      if (Element.prototype.matches.call(el, s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

import Set from '@ungap/set'
if (!window.Set) {
  window.Set = Set
}

// https://stackoverflow.com/a/62682524/387413
function arrayFrom(arr, callbackFn, thisArg)
{
    var arNew = [],
        k = [], // used for convert Set to an Array
        i = 0;
    if(window.Set && arr instanceof Set)
    {
        arr.forEach(function(v){k.push(v)});
        arr = k
    }
    for(; i < arr.length; i++)
        arNew[i] = callbackFn
            ? callbackFn.call(thisArg, arr[i], i, arr)
            : arr[i];
    return arNew
}
Array.from = Array.from || arrayFrom;

if (window.Tabpanelwidget && window.Tabpanelwidget._runBuffered) {
  window.Tabpanelwidget._runBuffered()
}

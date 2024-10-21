export let query = document.querySelector.bind(document);
export let queryAll = document.querySelectorAll.bind(document);
// var fromId = document.getElementById.bind(document);
// var fromClass = document.getElementsByClassName.bind(document);
// var fromTag = document.getElementsByTagName.bind(document);

export function siblings(node, children) {
    children = [].slice.call(children);
    let siblingList = children.filter(function(val) {
        return [node].indexOf(val) == -1;
    });
    return siblingList;
}

// Find first ancestor of el with tagName
// or undefined if not found
export function upTo(el, tagName) {
  tagName = tagName.toLowerCase();

  while (el && el.parentNode) {
    el = el.parentNode;
    if (el.tagName && el.tagName.toLowerCase() == tagName) {
      return el;
    }
  }

  // Many DOM methods return null if they don't
  // find the element they are searching for
  // It would be OK to omit the following and just
  // return undefined
  return null;
}
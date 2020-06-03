## 参考 https://github.com/koromon/Frontend-01-Template/blob/master/week08/match.js

function match(element, selector) {
  if (!selector || !element.attributes)
    return false;
    let matchRet = selector.match(/(#\w+)+/g);

if (selector.charAt(0) == "#") {
    var attr = element.attributes.filter(attr => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", ''))
      return true;
  } else if (selector.charAt(0) === ".") {
    var attr = element.attributes.filter(attr => attr.name === "class")[0];
    var selectorClassName = selector.replace(".", "")
    if (attr && attr.value && attr.value.split(" ").indexOf(selectorClassName) >= 0)
      return true;
  } else if (selector.indexOf(".") > -1 && selector.indexOf("#") > -1) {
// TODO: 实现复合选择器
  } else {
    if (element.tagName === selector)
      return true;
  }
}

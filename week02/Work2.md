# Week 2 作业

## Work 1 写一个正则表达式 匹配所有 Number 直接量

### 16进制
- /^[0-9a-fA-F]+$/

### 8进制
/^[0-7]+$/

### 2进制
/^[01]+$/

### 10进制
/^0|[1-9]\d*$/

### 汇总
/^(\.\d+|(0|[1-9]\d*)\.?\d*?)([eE][-\+]?\d+)?$|^0[bB][01]+$|^0[oO][0-7]+$|^0[xX][0-9a-fA-F]+$/

## Work 2 写一个 UTF-8 Encoding 的函数
- 参考：https://gist.github.com/MarcelloDiSimone/933a13c6a5b6458ce29d972644bb5892

````javascript
function Utf8Encode(strUni) {
  return String(strUni).replace(
    /[\u0080-\u07ff]/g, 
    function (c) {
      var cc = c.charCodeAt(0);
      return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
    }
  ).replace(
    /[\u0800-\uffff]/g,  
    function (c) {
      var cc = c.charCodeAt(0);
      return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
    }
  );
}
````

## WOrk 3 写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

/[\u4e00-\u9fa5\

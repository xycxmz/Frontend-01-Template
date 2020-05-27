# 爬取CSS标准

let css = document.getElementById("container").children
let result = [];
for (let cs of css) {
    if (cs.getAttribute('data-tag').match(/css/))
        result.push({
            name: cs.children[1].innerText,
            url: cs.children[1].children[0].href
        })
}
console.log(result);
console.log(JSON.stringify(result, "      ", null));

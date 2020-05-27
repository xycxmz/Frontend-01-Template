## 参考：https://github.com/alvin-xianer/Frontend-01-Template/blob/master/week06/practice0516/parser.js
## 参考：https://github.com/daybreakcold/Frontend-01-Template/blob/master/week06/domParse.js

let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;
let stack = [{
    type: 'document',
    children: []
}];

function emit(token) {
    let top = stack[stack.length - 1];

    if (token.type == "startTag") {
        let element = {
            type: "element",
            attributes: [],
            children: [],
        }
        element.tagName = token.tagName;

        for (let p in token) {
            if (p != "type" && p != "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        top.children.push(element);

        if (!token.isSelfClosing) {
            stack.push(element)
        }

        currentTextNode = null;

    } else if (!token.type == "endTag") {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type == 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol('EOF');//end of file

/**
 * 初始状态
 */
function data(item) {
    if (item == "<") {
        return tagOpen;
    }
    else if (item == EOF) {
        emit({
            type: 'EOF'
        });
        return;
    }
    else {
        //如\n
        emit({
            type: 'text',
            content: item
        });
        return data;
    }
}

function tagOpen(item) {
    if (item == '/') {
        return endTagOpen;
    }
    else if (item.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(item);
    }
    else {
        emit({
            type: 'text',
            content: item
        });
        return;
    }
}

function tagName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    }
    else if (item == '/') {
        return selftClosingStartTag;
    }
    else if (item.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += item.toLowerCase();
        return tagName;
    }
    else if (item == '>') {
        emit(currentToken);
        return data;
    }
    else {
        currentToken.tagName += item;
        return tagName;
    }
}


function beforeAttributeName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (item == '/' || item == '>' || item == EOF) {
        return afterAttributeName(item);
    } else if (item == '=') {

    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(item);
    }
}

function attributeName(item) {
    if (item.match(/^[\t\n\f ]$/) || item == '/' || item == '>' || item == EOF) {
        return afterAttributeName(item);
    } else if (item == '=') {
        return beforeAttributeValue;
    } else if (item == '\u0000') {

    } else if (item == '\"' || item == "'" || item == '<') {

    } else {
        currentAttribute.name += item;
        return attributeName;
    }
}

function beforeAttributeValue(item) {
    if (item.match(/^[\t\n\f ]$/) || item == '/' || item == '>' || item == EOF) {
        return beforeAttributeValue;
    } else if (item == "\"") {
        return doubleQuoteAttributeValue;
    } else if (item == "\'") {
        return singleQuotedAttributeValue;
    } else if (item == ">") {

    } else {
        return UnquotedAttributeValue(item);
    }
}

function doubleQuoteAttributeValue(item) {
    if (item == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (item == "\u0000") {

    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return doubleQuoteAttributeValue;
    }
}

function singleQuotedAttributeValue(item) {
    if (item == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (item == "\u0000") {

    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return singleQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (item == "/") {
        return selftClosingStartTag;
    } else if (item == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return doubleQuoteAttributeValue;
    }
}

function UnquotedAttributeValue(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (item == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selftClosingStartTag;
    } else if (item == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (item == "\u0000") {

    } else if (item == "\"" || item == "'" || item == "<" || item == "=" || item == "`") {

    } else if (item == EOF) {

    } else {
        currentAttribute.value += item;
        return UnquotedAttributeValue;
    }
}

function selftClosingStartTag(item) {
    if (item == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    }
    else if (item == EOF) {

    } else {

    }
}

function endTagOpen(item) {
    if (item.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag ",
            tagName: ""
        }
        return tagName(item);
    } else if (item == '>') {

    } else if (item == EOF) {

    }
    else {

    }
}

function afterAttributeName(item) {
    if (item.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (item == "/") {
        return selftClosingStartTag;
    } else if (item == "=") {
        return beforeAttributeValue;
    } else if (item == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (item == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(item);
    }
}


module.exports.parseHTML = function parseHTML(html) {
    let state = data;
    for (let item of html) {
        state = state(item);
    }
    state = state(EOF);
    return stack[0];
}

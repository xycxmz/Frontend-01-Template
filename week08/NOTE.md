# 本周作业：
- 编写一个 match 函数，完善你的 toy-browser
```
function match(selector, element) {
    return true;
}


match("div #id.class", document.getElementById("id"));
```

# CSS基本语法

## 简单选择器
- 标签选择器
- class选择器
- id选择器
- 属性选择器
- 伪类选择器
- 伪元素选择器

## 符合选择器
= <简单选择器><简单选择器><简单选择器>
- *或div在最前

## 复杂选择器
- <复合选择器><space><复合选择器>
- <复合选择器>">"<复合选择器>
- <复合选择器>"~"<复合选择器>
- <复合选择器>"+"<复合选择器>
- <复合选择器>"||"<复合选择器>

## 选择器优先级
- [行内, id, class, tagName]
- 复杂选择器=各个简单选择器的优先级组合

## 伪类选择器
- 链接/行为
- 树结构
- 逻辑型
- 其他

## 伪类元素

# CSS排版

## 盒模型
- content
- padding
- border
- margin

## 正常流
- 收集进盒子
- 计算盒在行中的排布
- 计算行的排布

## Flex排版
- 收集盒进行
- 计算盒在主轴方向的排布
- 计算盒在交叉轴方向的排布





# 每周总结

    挑战题：我们如何用状态机处理完全未知的 pattern（选做）
    跟上课堂内容，完成 DOM 树构建
    实现复合选择器，实现支持空格的 Class 选择器（选做）
    本周学习总结

## 浏览器工作原理（上周）
- 字符流——>状态机——>词Token——>栈——>DOM树
- HTTP报文格式（Content-Type和Content-Length）
- 响应报文格式（Chunkn=0的结尾）

## 有限状态机
- 每一个状态都是一个机器
	-  在每一个机器里，我们可以做计算、存储、输出
	-  所有的这些机器接收的输入是一致的
	-  状态机的每一个机器本身没有状态（纯函数）
- 每一个机器知道下一个状态
	- 每个机器都有确定的下一个状态（Moore）
	- 每个机器根据输入决定下一个状态（Mealy）

## JS中的有限状态机
```javascript
// 每个函数是一个状态
function state(input) {  // 函数参数就是输入
  // 在函数中，可以自由地编写代码，处理每个状态的逻辑
  return next; //返回值作为下一个状态
}
// 以下是调用
while(input) {
  // 获取输入
  state = state(inpust); // 把状态机的返回值作为下一个状态
}
```

## HTML的解析
- 拆分文件
- 创建状态机
- 解析标签
- 创建元素
- 处理属性
- 构建DOM树
- 文本节点

## CSS计算
- 收集CSS规则（CSS Parser）
- 添加调用
- 获取父元素序列
- 拆分选择器
- 计算选择器（三种基本选择器）
- 生成Computed属性
- 确定规则覆盖关系

### 详细过程参考：https://github.com/Spicycrayfish/Frontend-01-Template/blob/master/week06/NOTE.md 的笔记

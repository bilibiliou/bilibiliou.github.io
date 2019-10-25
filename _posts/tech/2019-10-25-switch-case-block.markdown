---
layout: post
title: 解决 Unexpected lexical declaration in case block 的问题
category: 技术
keywords: 技术,js
---

使用新版的 es-lint 的时候扫描旧的项目，发现报了

Unexpected lexical declaration in case block(no-case-declarations)

这么一个错误提示
当时很奇怪，就去查了一下文档，发现中文文档中解释比较简单

`该规则禁止词法声明 (let、const、function 和 class) 出现在 case或default 子句中。`

[https://cn.eslint.org/docs/rules/no-case-declarations](https://cn.eslint.org/docs/rules/no-case-declarations)


几番实验后，其实归根结底是代码作用域的问题：
```js
switch (2) {
  case 1:
    function f () {console.log('Wanna a girl friend !')}
    break
  case 2:
    f() // 会输出：Wanna a girl friend !
    break
}
```

```js
switch (1) {
  case 1:
    let foo = 1
    break
  case 2:
    let foo = 2
    console.log(foo) // 会报错：Uncaught SyntaxError: Identifier 'foo' has already been declared
    break
}
```

如上实验可知，就算switch 逻辑没有走到 case 1 的代码块，由于作用域提升，会导致case 1 影响到case 2

所以，eslint 会对这种情况做校验，现在必须 使用花括号将代码块确定具体的作用域

```js
switch (1) {
  case 1: {
    // do something
    break
  }
}
```

从而限制上述问题的发生
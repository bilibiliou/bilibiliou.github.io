---
layout: post
title: 关于一种特殊的逻辑前缀表达式的解析和抽象规则
category: 算法
keywords: 算法
---

基于空间存储性能和高效的考虑，我新设计了一种的新的逻辑前缀表达式

## 适用场景

![img](https://bilibiliou.github.io/assets/img/logic_tree.png)

如图，我们可以用这种前缀表达式： `(|A, (&B, C, (|E, F, G)), (|D, (&H, I)))`
对逻辑如上逻辑节点进行表达

## 概念

我们将节点ID代表节点,节点ID可以是数字或字母

两个概念： 条件 和 分组

条件一定存在于分组中

条件之间存在 且 和 或的关系

例如一个简单的分组

`(&1, 2)` 那么说明 条件1  和 条件2 为且的关系

`(|1, 2)` 那么说明 条件1 和 条件2 为或的关系

子分组 和 条件也存在逻辑关系

例如：`(&1, 2, (|3, 4))`

那么 条件1 和 条件2 和 子分组(3, 4) 的关系为且，有且仅当条件1、条件2和子分组的条件同时成立，该输出项才输出 true

## 解析算法

```
测试用例1：(&10,20,30,(|4,5,6),(&7,8,9))

测试用例2：(&(|3),20,(&5,6,7))

测试用例3：(&(|A),B,(&C,D,E))

测试用例4：(|A, (&B, C, (|E, F, G)), (|D, (&H, I)))
```

### 逻辑式解析为对象的方法：

```js
function logicExpression2Object (str) {
  try {

    let at = 0
    let ch = ''

    let next = function () {
      ch = str.charAt(at)
      at += 1
      while (ch && ch.trim() === '') {
        next()
      }
      return ch
    }

    let group = function () {
      let newGroup = {
        _logic: void 0,
        _values: []
      }

      next('(')
      newGroup._logic = value()
      while (ch !== ')') {
        newGroup._values.push(value())
      }
      next(')')
      return newGroup
    }

    let and = function () {
      let r = ch
      next()
      return r
    }

    let or = function () {
      let r = ch
      next()
      return r
    }

    let strings = function () {
      let chars = ''
      while (/\w/.test(ch)) {
        chars += ch
        next()
      }
      return chars
    }

    let number = function () {
      /** 只考虑无符号整型数字字符 */
      let chars = ''
      while (/\d/.test(ch)) {
        chars += ch
        next()
      }

      return chars
    }

    let value = function () {
      switch (ch) {
        case '(':
          return group()
        case '&':
          return and()
        case '|' :
          return or()
        case ',':
          next()
          return value()
        default:
          if (/\d/.test(ch)) {
            return number()
          } else if (/\w/.test(ch)) {
            return strings()
          } else {
            throw new Error('逻辑式不合法，解析出错')
          }
      }
    }

    next()

    return value()
  } catch (e) {
    console.error(e)
    return void 0
  }
}
logicExpression2Object('(|A, (&B, C, (|E, F, G)), (|D, (&H, I)))')

// {_logic: "|", _values: Array(3)}
// _logic: "|"
// _values: (3) ["A", {…}, {…}]
// __proto__: Object
```

### 对象抽象为逻辑式的方法：

```js
function object2LogicExpression (obj) {
  let result = '('
  // _groupId 仅前端数据结构使用，方便进行单通道标注，不与数据库同步
  let {_logic, _values} = obj
  result += _logic
  for (let i = 0; i < _values.length; i++) {
    let value = _values[i]

    if (typeof value === 'string') {
      result += value
    } else {
      result += this.object2LogicExpression(value)
    }

    if (!(i === _values.length - 1)) {
      result += ','
    }
  }
  result += ')'
  return result
}

object2LogicExpression(logicExpression2Object('(|A, (&B, C, (|E, F, G)), (|D, (&H, I)))'))
// (|A,(&B,C,(|E,F,G)),(|D,(&H,I)))
```
## Caveat

从存储上看，这种数据结构较JSON结构轻量不少

以`(&A, B)` 为例

JSON需要{ "logic": "&", values: ["A", "B"] } 这么多字符

但是，从可读性和易用性的角度来看，Json 结构更符合多人协作的场景

## Creator

[github@bilibiliou](https://github.com/bilibiliou)
---
layout: post
title: leetcode 刷刷刷
category: 算法
keywords: 算法
---

### 1. 键盘行

给定一个单词列表，只返回可以使用在键盘同一行的字母打印出来的单词。键盘如下图所示。

![image](https://user-images.githubusercontent.com/25907273/63665072-2f413780-c7fc-11e9-9236-411795480f7a.png)

示例：

输入: ["Hello", "Alaska", "Dad", "Peace"]
输出: ["Alaska", "Dad"]
 

注意：

你可以重复使用键盘上同一字符。
你可以假设输入的字符串将只包含字母。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/keyboard-row
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```js
var regs = [/q|w|e|r|t|y|u|i|o|p/i, /a|s|d|f|g|h|j|k|l/i, /z|x|c|v|b|n|m/i]
var input = ["Hello", "Alaska", "Dad", "Peace"]

var map = {}
for (var k = 0; k < regs.length; k++) {
    var reg = regs[k]
    map[k] = []
    for (var i = 0; i < input.length; i++) {
      var str = input[i]
      var belong = true

      for (var j = 0; j < str.length; j++) {
        var w = str[j]
        var isBelong = !reg.test(w)
        if (isBelong) {
          belong = false
          break
        }
      }
      if (belong) {
        map[k].push(str)
      }
    }
}

var result = []
for (var key in map) {
  var r = map[key]
  result = result.concat(r)
}

result // ["Alaska", "Dad"]
```

### 2. N叉树的最大深度

给定一个 N 叉树，找到其最大深度。

最大深度是指从根节点到最远叶子节点的最长路径上的节点总数。

例如，给定一个 3叉树 :

![image](https://user-images.githubusercontent.com/25907273/63665222-02415480-c7fd-11e9-9a1b-f6939340fe55.png)

我们应返回其最大深度，3。

说明:

树的深度不会超过 1000。
树的节点总不会超过 5000。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/maximum-depth-of-n-ary-tree
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```js
/**
  function Node (v, childs) {
    this.v = v
    this.childs = childs
  }
*/


function maxDepth (root) {
  if (!root) {
    return 0
  }
  
  const stack = [{node: root, deep: 1}]
  let result = 1
  while (stack.length > 0) {
    let currentNode = stack.pop()
    let { node, deep } = currentNode
    let children = node.children
    result = Math.max(result, deep)
    if (children && children.length) {
      for (let i = 0; i < children.length; i++) {
        let child = children[i]
        stack.push({node: child, deep: deep + 1})
      }
    }
  }
  return result
}

maxDepth ({
  v: 'A',
  childs: [{
    v: 'B',
    childs: [{
      v: 'E',
      childs: [{
        v: 'G'
      }]
    }]
  }, {
    v: 'C',
    childs: [{
      v: 'F',
      childs: [{
        v: 'H',
        childs: [{
          v: 'J',
          childs: [{
            v: 'K'
          }]
        }]
      }]
    }]
  }, {
    v: 'D'
  }]
})
```

时间复杂度已经战胜 98.72 % 的 javascript 提交记录

### 3.字符的最短距离

给定一个字符串 S 和一个字符 C。返回一个代表字符串 S 中每个字符到字符串 S 中的字符 C 的最短距离的数组。

示例 1:

```
输入: S = "loveleetcode", C = 'e'
输出: [3, 2, 1, 0, 1, 0, 0, 1, 2, 2, 1, 0]
```

说明:

```
字符串 S 的长度范围为 [1, 10000]。
C 是一个单字符，且保证是字符串 S 里的字符。
S 和 C 中的所有字母均为小写字母。
```

一种低效 O(n)²，但是便于理解的解决方案

```js
var reverse = function( str ){
  var newStr = '', i = str.length;
   for(; i >= 0; i--) {
        newStr += str.charAt(i);
   }
   return newStr;
}

function shortestToChar (S, C) {
  // 如果字符串中没有目标字符，则返回null
  if (S.indexOf(C) === -1) {
    return null
  }
  let result = []
  let len = S.length
  let pos = 0
  while (S[pos]) {
    if (S[pos] === C) {
      result.push(0)
      pos++
      continue
    }
    
    // 截取游标左边的逆序字符串 和 右边的正序字符串
    let prev = reverse(S.slice(0, pos))
    let next = S.slice(pos + 1, len)
    // 计算左边逆序字符串目标字符的距离 和 计算右边正序字符串的目标字符的距离
    let prevShort = prev.indexOf(C)
    let nextShort = next.indexOf(C)
    let psr = prevShort !== -1 ? prevShort : Infinity
    let nsr = nextShort !== -1 ? nextShort : Infinity
    result.push(Math.min(psr, nsr) + 1)
    pos++
  }
  return result
}

shortestToChar('loveleetcode', 'e')
```

### 4.字符串转换整数 (atoi)

请你来实现一个 atoi 函数，使其能将字符串转换成整数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。

当我们寻找到的第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字组合起来，作为该整数的正负号；假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成整数。

该字符串除了有效的整数部分之后也可能会存在多余的字符，这些字符可以被忽略，它们对于函数不应该造成影响。

注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0。

说明：

假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−231,  231 − 1]。如果数值超过这个范围，请返回  INT_MAX (231 − 1) 或 INT_MIN (−231) 。

示例 1:

输入: "42"
输出: 42
示例 2:

输入: "   -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。
     我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
示例 3:

输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
示例 4:

输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。
     因此无法执行有效的转换。
示例 5:

输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。 
     因此返回 INT_MIN (−231) 。


```js
/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function(str) {
  var raw = str.trim()
  var len = raw.length
  var at = 0
  var result = ''
  var isFirst = false
  var hasSymbol = false
  function eat () {
    var char = raw.charAt(at)
    at++
    return char
  }

  function value () {
    if (at >= len) {return}
    var char = eat()
    switch (true) {
      case char === '+':
      case char === '-':
        if (!hasSymbol) {
            isFirst = true
            hasSymbol = true
            result += char
            return value()
        } else {
            return
        }
      case /^\d$/.test(char):
        isFirst = true
        result += char
        return value()
      default:
        if (isFirst) {
          return result
        }
    }
  }
  value()
  /** 如果没有有效结果那么返回 0 **/
  if (!result || result === '+' || result === '-') {
    return 0
  }

  var output = parseInt(result, 10)

  if (output > Math.pow(2, 31) - 1) {
    return Math.pow(2, 31) - 1
  }

  if (output <= Math.pow(-2, 31)) {
    return Math.pow(-2, 31)
  }

  return output
};
```
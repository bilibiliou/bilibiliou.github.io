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
    let children = node.childs
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

### 两数相加

给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

示例：

输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/add-two-numbers
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```js
var addTwoNumbers = function(l1, l2) {
  var n = 0
  var m = 0

  function eat (L) {
    var stack = []
    var pointer = L
    while (pointer.next) {
        stack.push(pointer.val)
        pointer = pointer.next
    }
    stack.push(pointer.val)
    return stack
  }

  function format (n) {
    var t = {}
    var p = t
    for (var i = 0; i < n.length; i++) {
      var char = n[i]
      t.val = parseInt(char, 10)
      
      if (i !== n.length - 1) {
        t.next = {}
      } else {
        t.next = null
      }
      t = t.next
    }
    return p
  }
  n = eat(l1)
  m = eat(l2)
  var r = []
  var sumLen = Math.max(n.length, m.length)
  var tt = 0
  for (var i = 0; i < sumLen; i++) {
  var a = n[i] ? n[i] : 0
  var b = m[i] ? m[i] : 0
  var k = a + b + tt
  tt = 0

  if (k < 10) {
      r[i] = k
    } else {
      r[i] = k - 10
      tt = 1
    }
  }

  if (tt) {
    r[r.length] = 1
  }

  return format(r)
};
```

执行用时 : 144 ms, 在所有 JavaScript 提交中击败了 29.63% 的用户
内存消耗 : 38.9 MB, 在所有 JavaScript 提交中击败了 45.50% 的用户
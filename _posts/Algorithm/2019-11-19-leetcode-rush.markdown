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
执行用时 :88 ms
内存消耗 :33.8 MB

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
执行用时：172 ms
内存消耗：41.8 MB

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

### 罗马数字

罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。

字符          数值
I             1
V             5
X             10
L             50
C             100
D             500
M             1000
例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。 
C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。

示例 1:

输入: "III"
输出: 3
示例 2:

输入: "IV"
输出: 4
示例 3:

输入: "IX"
输出: 9
示例 4:

输入: "LVIII"
输出: 58
解释: L = 50, V= 5, III = 3.
示例 5:

输入: "MCMXCIV"
输出: 1994
解释: M = 1000, CM = 900, XC = 90, IV = 4.

https://leetcode-cn.com/problems/roman-to-integer/


```js
var romanToInt = function(s) {
  function value (n) {
    switch (n) {
      case 'IV':
        return 4
      case 'IX':
        return 9
      case 'XL':
        return 40
      case 'XC':
        return 90
      case 'CD':
        return 400
      case 'CM':
        return 900
      case 'I':
        return 1
      case 'V':
        return 5
      case 'X':
        return 10
      case 'L':
        return 50
      case 'C':
        return 100
      case 'D':
        return 500
      case 'M':
        return 1000
    } 
  }

  function isSpecial (n, v) {
    if (
      ('V' === n || 'X' === n)
      && v === 'I'
    ) {
      return v + n
    }

    if (
      ('L' === n || 'C' === n)
      && v === 'X'
    ) {
      return v + n
    }

    if (
      ('D' === n || 'M' === n)
      && v === 'C'
    ) {
      return v + n
    }

    return ''
  }

  function analysis (s) {
    var str = s.toUpperCase().split('').reverse()
    var temp = ''
    var result = 0
    for (var i = 0; i < str.length; i++) {
      var char = str[i]
      var charNext = str[i + 1]

      if (charNext) {
        var ss = isSpecial(char, charNext)
        if (ss) {
          result += value(ss)
          i++
        } else {
          result += value(char)
        }
      } else {
        result += value(char)
      }
    }

    return result
  }
  return analysis(s)
};
```

执行用时 :164 ms, 在所有 JavaScript 提交中击败了69.32%的用户
内存消耗 :40.4 MB, 在所有 JavaScript 提交中击败了41.77%的用户

### 路径总和 II

给定一个二叉树和一个目标和，找到所有从根节点到叶子节点路径总和等于给定目标和的路径。

说明: 叶子节点是指没有子节点的节点。

示例:
给定如下二叉树，以及目标和 sum = 22，

              5
             / \
            4   8
           /   / \
          11  13  4
         /  \    / \
        7    2  5   1
返回:

[
   [5,4,11,2],
   [5,8,4,5]
]

https://leetcode-cn.com/problems/path-sum-ii/

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {number[][]}
 */
var pathSum = function(root, sum) {
    if (!root) {
        return [];
    }
  var result = []
  
  function generate (node, genList, thisSum) {
    if (!node.right && !node.left) {
      if (thisSum + node.val === sum) {
        result.push([...genList, node.val])
      }
      return
    }


    if (node && node.left) {
      generate(node.left, [...genList, node.val], thisSum + node.val)
    }

    if (node && node.right) {
      generate(node.right, [...genList, node.val], thisSum + node.val)
    }

  }
  generate(root, [], 0)

  return result
};
```
执行用时：92 ms
内存消耗：46.3 MB
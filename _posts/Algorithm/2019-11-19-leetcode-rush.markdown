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

```
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
```

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

### 原地反转字符

将 "www.bytedance.com" 反转为 "moc.ecnadetyb.www"

```js
var str = 'www.bytedance.com'.split('')
var len = str.length
var tempChar
for (var i = 0; i < parseInt(len / 2); i++) {
  tempChar = str[i]
  str[i] = str[len - 1 - i]
  str[strLen - 1 - i] = tempChar
}

str.join('')
```

### 从路径中查找出最短路径

输入：['aa/bb/sd/bb', 'aa/bb/wwewer', 'aa/bb/sd/ddfff']

输出：aa/bb/

https://leetcode-cn.com/problems/longest-common-prefix/

```js
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
    if (!strs.length) {
        return ''
    }
    var str = ''
    var p = 0
    var temp = ''
    var getPrefix = function (arr) {
        while (true) {
            if (!arr[0]) { return '' }
            if (arr.length < 2) { return arr[0] }
            temp = arr[0][p]
            for (var i = 1; i < arr.length; i++) {
                var arrStr = arr[i]
                var pstr = arrStr[p]
                if (!temp || !pstr || pstr !== temp) {
                    return str
                }
            }
            str += temp
            temp = ''
            p++
        }
        return str
    }
    return getPrefix(strs)
};
```

执行用时：72 ms

内存消耗：35.2 MB

### 移除重复节点

编写代码，移除未排序链表中的重复节点。保留最开始出现的节点。

示例1:

 输入：[1, 2, 3, 3, 2, 1]

 输出：[1, 2, 3]

示例2:

 输入：[1, 1, 1, 1, 2]

 输出：[1, 2]

提示：

链表长度在[0, 20000]范围内。

链表元素在[0, 20000]范围内。

进阶：

如果不得使用临时缓冲区，该怎么解决？

来源：力扣（LeetCode）

链接：https://leetcode-cn.com/problems/remove-duplicate-node-lcci

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */

var removeDuplicateNodes = function(head) {
  if (!head) {
    return null
  }
  var result = new ListNode(head.val)
  var resultPointer = result
  var temp = null
  var hashmap = {[head.val]: 1}
  head = head.next
  while (head) {
    if (!hashmap[head.val]) {
      hashmap[head.val] = 1
      temp = head.next
      head.next = null
      resultPointer.next = head
      resultPointer = resultPointer.next
      head = temp
      continue
    }

    head = head.next
  }

  return result
};


removeDuplicateNodes(test([1, 2, 3, 3, 2, 1]))
```

执行用时 :

执行用时 : 84 ms, 在所有 JavaScript 提交中击败了 92.78% 的用户

内存消耗 : 39 MB, 在所有 JavaScript 提交中击败了 100.00% 的用户

### 等价多米诺骨牌对的数量

给你一个由一些多米诺骨牌组成的列表 dominoes。

如果其中某一张多米诺骨牌可以通过旋转 0 度或 180 度得到另一张多米诺骨牌，我们就认为这两张牌是等价的。

形式上，dominoes[i] = [a, b] 和 dominoes[j] = [c, d] 等价的前提是 a==c 且 b==d，或是 a==d 且 b==c。

在 0 <= i < j < dominoes.length 的前提下，找出满足 dominoes[i] 和 dominoes[j] 等价的骨牌对 (i, j) 的数量。

示例：

输入：dominoes = [[1,2],[2,1],[3,4],[5,6]]

输出：1
 

提示：

1 <= dominoes.length <= 40000

1 <= dominoes[i][j] <= 9

来源：力扣（LeetCode）

链接：https://leetcode-cn.com/problems/number-of-equivalent-domino-pairs

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```js
/**
 * @param {number[][]} dominoes
 * @return {number}
 */
var numEquivDominoPairs = function(dominoes) {
  if (!dominoes.length) {
      return 0
  }
  var result = 0
  var hashMap = {}

  // 1 -> 0
  // 2 -> 1
  // 3 -> 3
  // 4 -> 6
  // 5 -> 10
  // n -> Σ(n-1) -> n * (n - 1) / 2
  for (var i = 0; i < dominoes.length; i++) {
    var stone = dominoes[i]
    var [A, B] = stone
    var key1 = A + ',' + B
    var key2 = B + ',' + A
    if (hashMap[key1]) {
        hashMap[key1] += 1
    } else {
        hashMap[key1] = 1
    }

    if (hashMap[key2]) {
        hashMap[key2] += 1
    } else {
        hashMap[key2] = 1
    }
  }

  for (var key in hashMap) {
    var num = hashMap[key]
    var A = key.charAt(0)
    var B = key.charAt(2)
    var reverseKey = B + ',' + A

    if (A !== B && hashMap[reverseKey]) {
        result += ((num * (num - 1)) / 2)
        hashMap[reverseKey] = 0
    }

    // 如果只有一个前后相同的元组
    if (A === B && num > 2) {
        var half = num / 2
        result += ((half * (half - 1)) / 2)
    }
  }
  hashMap = null
  return result
};
```

效率如下：

执行用时 :80 ms, 在所有 JavaScript 提交中击败了91.07%的用户

内存消耗 :43.9 MB, 在所有 JavaScript 提交中击败了30.77%的用户

### 回文链表

字符链表存，是否是回文？

判断是不是回文链表

```js
function generatorStrLinkList(str) {
  if (!str) {
    return null
  }
  const LinkList = {};

  let currentNode = LinkList;
  for (let i = 0; i < str.length; i++) {
    currentNode.val = str[i];
    if (str[i + 1]) {
      currentNode.next = {};
    }
    currentNode = currentNode.next;
  }
  return LinkList;
}

var isPalindrome = function(head) {
  if (!head) {
    return true
  }

  if (!head.next) {
    // 一个字符也算回文
    return true
  }

  // 快慢指针
  var slow = head
  var fast = head
  var prev = null
  
  while (fast && fast.next) {
    // 先用一个变量将当前慢指针记录下来，
    var current = slow
    
    fast = fast.next.next
    slow = slow.next
    current.next = prev
    prev = current
  }
  
  if (fast) {
    slow = slow.next
  }

  // 遍历两条链表，判断是否是回文
  while (prev || slow) {
    if (prev.val !== slow.val) {
      return false
    }

    if (!prev || !slow) {
      return false
    }

    prev = prev.next
    slow = slow.next
  }
  return true
};
```

执行用时：76 ms
内存消耗：39.2 MB

来源：力扣（LeetCode）

链接：https://leetcode-cn.com/problems/palindrome-linked-list-lcci/submissions/

著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

## 两数相加

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
function ListNode(val) {
  this.val = val;
  this.next = null;
}

function gen (arr) {

  var current = null
  for (var i = arr.length - 1; i >= 0; i--) {
    var item = arr[i]
    var node = new ListNode(item)
    node.next = current
    current = node
  }
  return current
}

var reverseList = function(head) {
  if (!head) { return null }
  var current = head
  var prev = null
  var next = head.next
  while (next) {
    current.next = prev
    prev = current
    current = next
    next = next.next
    current.next = prev
  }

  return current
};

var addTwoNumbers = function (l1, l2) {
  if (!l1 && l2) {
    return l2
  }

  if (!l2 && l1) {
    return l1
  }

  if (!l2 && !l1) {
    return null
  }
  var rl1 = reverseList(l1)
  var rl2 = reverseList(l2)
  var result = new ListNode(-1)
  var next = result
  var hasCarry = 0

  while (rl1 && rl2) {
    var v1 = rl1.val
    var v2 = rl2.val
    var sum = v1 + v2 + hasCarry
    var node
    if (sum <= 9) {
      hasCarry = 0
      node = new ListNode(sum)
    } else {
      hasCarry = 1
      node = new ListNode(sum % 10)
    }
    next.next = node
    next = next.next

    rl1 = rl1.next
    rl2 = rl2.next
  }

  if (rl1) {
    while (rl1) {
      var v = rl1.val
      var sum = v + hasCarry
      var node
      if (sum <= 9) {
        hasCarry = 0
        node = new ListNode(sum)
      } else {
        hasCarry = 1
        node = new ListNode(sum % 10)
      }
      next.next = node
      next = next.next
      rl1 = rl1.next
    }
  }

  if (rl2) {
    while (rl2) {
      var v = rl2.val
      var sum = v + hasCarry
      var node
      if (sum <= 9) {
        hasCarry = 0
        node = new ListNode(sum)
      } else {
        hasCarry = 1
        node = new ListNode(sum % 10)
      }
      next.next = node
      next = next.next
      rl2 = rl2.next
    }
  }

  if (hasCarry) {
    node = new ListNode(1)
    next.next = node
    next = next.next
  }
  return reverseList(result.next)
}
addTwoNumbers(gen([3,9,9,8,9]), gen([3,4, 9,1]))
```

执行用时：144 ms
内存消耗：38.1 MB

## 二维数组查找

在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```js
var matrix = [
  [1,   4,  7, 11, 15],
  [2,   5,  8, 12, 19],
  [3,   6,  9, 16, 22],
  [10, 13, 14, 17, 24],
  [18, 21, 23, 26, 30]
]
/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var findNumberIn2DArray = function(matrix, target) {
  if (!matrix.length) { return false }
  var find = function (target, arr) {
    var s = 0
    var e = arr.length - 1
    var Index = parseInt((s + e) / 2)
    while (s <= e) {
      var value = arr[Index]
      if (target === value) {
        return true
      }


      if (target < value) {
        e = Index - 1
      }

      if (target > value) {
        s = Index + 1
      }

      Index = parseInt((s + e) / 2)
    }

    return false
  }

  for (var i = 0; i < matrix.length; i++) {
    var arr = matrix[i]
    if (find(target, arr)) {
      return true
    }
  }

  return false
};
findNumberIn2DArray(matrix, 5)
```
执行用时：76 ms
内存消耗：36.6 MB

## 二叉树的层序遍历

给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。

示例：
二叉树：[3,9,20,null,null,15,7],

    3
   / \
  9  20
    /  \
   15   7
返回其层次遍历结果：

[
  [3],
  [9,20],
  [15,7]
]

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/binary-tree-level-order-traversal
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

说白了就是 BFS 广度遍历的算法：

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
 * @return {number[][]}
 */
var levelOrder = function(root) {
  // 请你实现
  if (!root) { return [] }
  var result = []
  var queue = [{node: root, deep: 1}]

  while (queue.length) {
    var treeNode = queue.shift()
    var { node, deep } = treeNode

    if (node.left) {
      queue.push({node: node.left, deep: deep + 1})
    }

    if (node.right) {
      queue.push({node: node.right, deep: deep + 1})
    }

    if (result[deep - 1]) {
      result[deep - 1].push(node.val)
    } else {
      result[deep - 1] = [node.val]
    }
  }

  return result
};

levelOrder({
  val: 1,
  left: {
    val: 4,
    left: null,
    right: null
  },
  right: {
    val: 6,
    left: {
      val: 2,
      left: null,
      right: null
    },
    right: {
      val: 5,
      left: null,
      right: null
    }
  }
})
// [
//   [1],
//   [4, 6],
//   [2, 5]
// ]
```

## 二叉树的深度遍历

前、中、后序遍历

```js
function lvl(root) {
  if (!root) {
    return
  }
  var result = []
  var _ = function (root) {
    // 前序
    result.push(root.val)
    if (root.left) {
      _(root.left)
    }
    // 中序
    // result.push(root.val)
  
    if (root.right) {
      _(root.right)
    }

    // 后序
    // result.push(root.val)
  }
  _(root)
  return result
}

lvl({
  val: 1,
  left: {
    val: 4,
    left: null,
    right: null
  },
  right: {
    val: 6,
    left: {
      val: 2,
      left: null,
      right: null
    },
    right: {
      val: 5,
      left: null,
      right: null
    }
  }
})

// 
```

## 循环数组输出

给定一个包含 m x n 个元素的矩阵（m 行, n 列），请按照顺时针螺旋顺序，返回矩阵中的所有元素。

示例 1:

输入:
[
 [ 1, 2, 3 ],
 [ 4, 5, 6 ],
 [ 7, 8, 9 ]
]
输出: [1,2,3,6,9,8,7,4,5]
示例 2:

输入:
[
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9,10,11,12]
]
输出: [1,2,3,4,8,12,11,10,9,5,6,7]

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/spiral-matrix
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。

```js
var spiralOrder = function(matrix) {
  var i = 0
  var j = 0
  var n = matrix.length
  if (n === 0) {
    return []
  }
  var m = matrix[0].length
  var result = []

  // 边界值设定
  var left = 0
  var right = m - 1
  var top = 0
  var bottom = n - 1
  var turn = m === 1 ? 'bottom' : 'right'
  for (var a = 0; a < (m * n); a++) {
    var value = matrix[i][j]
    result.push(value)

    switch (turn) {
      case 'right':
        // 如果方向是从左往右的情况
        j++
        if (j === right) {
          // 当已经遍历到右边后，那么上边界算是遍历完一次了
          // 这时候上边界需要往下移一栏
          turn = 'bottom'
          top++
        }
        break
      case 'bottom':
        // 此时方向是从上到下
        i++
        if (i === bottom) {
          turn = 'left'
          right--
        }
        break
      case 'left':
        // 此时方向是从右到左
        j--
        if (j === left) {
          turn = 'top'
          bottom--
        }
        break
      case 'top':
        // 此时方向是从下到上
        i--
        if (i === top) {
          turn = 'right'
          left++
        }
        break
    }
  }

  return result
};
```

执行用时：68 ms

内存消耗：33.8 MB

## 汉诺塔问题

```
在经典汉诺塔问题中，有 3 根柱子及 N 个不同大小的穿孔圆盘，盘子可以滑入任意一根柱子。一开始，所有盘子自上而下按升序依次套在第一根柱子上(即每一个盘子只能放在更大的盘子上面)。移动圆盘时受到以下限制:
(1) 每次只能移动一个盘子;
(2) 盘子只能从柱子顶端滑出移到下一根柱子;
(3) 盘子只能叠在比它大的盘子上。

请编写程序，用栈将所有盘子从第一根柱子移到最后一根柱子。

你需要原地修改栈。

示例1:

 输入：A = [2, 1, 0], B = [], C = []
 输出：C = [2, 1, 0]
示例2:

 输入：A = [1, 0], B = [], C = []
 输出：C = [1, 0]
提示:

A中盘子的数目不大于14个。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/hanota-lcci
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
```

```js
var hanota = function (A, B, C) {
  var n = A.length
  if (n > 14) {
    return void 0
  }
  var _ = function (n, A, B, C) {
    if (n === 1) {
      var item = A.pop()
      C.push(item)
      return
    }
  
    if (n > 1) {
      // 将 A 的 n-1 个元素移动到 B
      _(n - 1, A, C, B)

      // 此时，A柱只剩下一个圆盘，已经空了
      var item = A.pop()
      C.push(item)

      // 将 B 柱剩下的圆盘移动到 C 柱
      _(n - 1, B, A, C)
    }
  }

  _(n, A, B, C)
  return C
}

hanota([3, 2, 1, 0], [], [])
```

执行用时 : 72 ms, 在所有 JavaScript 提交中击败了 33.33% 的用户

内存消耗 : 34.1 MB, 在所有 JavaScript 提交中击败了 100.00% 的用户
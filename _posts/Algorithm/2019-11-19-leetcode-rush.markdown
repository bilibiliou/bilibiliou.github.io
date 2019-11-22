---
layout: post
title: leetcode 刷刷刷
category: 算法
keywords: 算法
---

1. 键盘行

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

2. N叉树的最大深度

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
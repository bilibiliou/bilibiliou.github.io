
## Create Tree from flat data

将输入的数组组装成一颗树状的数据结构，时间复杂度越小越好。要求程序具有侦测错误输入的能力。

测试用例：

```js
[
  {id:4, name:'i4', parentId: 3},
  {id:6, name:'i6', parentId: 2},
  {id:2, name:'i2', parentId: 1},
  {id:1, name: 'i1'},
  {id:3, name:'i3', parentId: 2},
  {id:5, name:'i5', parentId: 2},
  {id:8, name:'i8', parentId: 7}
]

[
  {id:1, name: 'i1'},
  {id:2, name:'i2', parentId: 1},
  {id:4, name:'i4', parentId: 3},
  {id:3, name:'i3', parentId: 2},
  {id:8, name:'i8', parentId: 7}
]
```

```js
var createFlatData2Tree = function (flatData) {
  var temp = {}
  var root = null

  for (var i = 0; i < flatData.length; i++) {
    var node = flatData[i]
    var { id, parentId } = node
    if (parentId) {
      if (temp[parentId]) {
        temp[parentId].childs.push(id)
      } else {
        temp[parentId] = {
          node: null,
          childs: [id]
        }
      }
    }

    if (temp[id]) {
      temp[id].node = node
    } else {
      temp[id] = {
        node,
        childs: []
      }
    }

    if (!parentId) {
      root = temp[id]
    }
  }

  function createTree (node) {
    if (!node.childs.length) {
      delete node.childs
      return node
    }
    
    var result = []
    for (var i = 0; i < node.childs.length; i++) {
      var childId = node.childs[i]
      var childNode = temp[childId]

      result.push(createTree(childNode))
    }
    node.children = result
    delete node.childs
    return node
  }
  root = createTree(root)
  temp = null
  return root
}
```

### Dominoes

```
Make a chain of dominoes.

Compute a way to order a given set of dominoes in such a way that they form a correct domino chain (the dots on one half of a stone match the dots on the neighbouring half of an adjacent stone) and that dots on the halfs of the stones which don't have a neighbour (the first and last stone) match each other.

For example given the stones 21, 23 and 13 you should compute something like 12 23 31 or 32 21 13 or 13 32 21 etc, where the first and last numbers are the same.

For stones 12, 41 and 23 the resulting chain is not valid: 41 12 23's first and last numbers are not the same. 4 != 3

Some test cases may use duplicate stones in a chain solution, assume that multiple Domino sets are being used.

Input example: (1, 2), (5, 3), (3, 1), (1, 2), (2, 4), (1, 6), (2, 3), (3, 4), (5, 6)
```

```js
var test = [[1, 2], [5, 3], [3, 1], [1, 2], [2, 4], [1, 6], [2, 3], [3, 4], [5, 6]]

var dominoes = function (chains) {
  var temp = {}
  for (var i = 0; i < chains.length; i++) {
    var chain = chains[i]
    var [first, last] = chain

    if (temp[first]) {
      temp[first].push(i)
    } else {
      temp[first] = [i]
    }

    if (temp[last]) {
      temp[last].push(i)
    } else {
      temp[last] = [i]
    }
  }
  // 如果骨牌的个数存在单数，那么肯定不能匹配
  var tempList = Object.keys(temp)
  var canContinue = true
  for (var i = 0; i < tempList.length; i++) {
    var chainlist = tempList[i]
    if (chainlist.length % 2) {
      canContinue = false
      break
    }
  }

  if (!canContinue) { return [] }

  function match (c1, c2) {
    if () {}
  }

  console.log(temp)
}
dominoes(test)
```
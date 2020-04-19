---
layout: post
title: Alipay-cicada 团队面试题
category: 算法
keywords: 算法
---

### Tournament

Tally the results of a small football competition.

Tally the results of a small football competition. Based on an input file containing which team played against which and what the outcome was create a file with a table like this:

Team                           | MP |  W |  D |  L |  P
Devastating Donkeys            |  3 |  2 |  1 |  0 |  7
Allegoric Alaskans             |  3 |  2 |  0 |  1 |  6
Blithering Badgers             |  3 |  1 |  0 |  2 |  3
Courageous Californians        |  3 |  0 |  1 |  2 |  1
What do those abbreviations mean?

MP: Matches Played
W: Matches Won
D: Matches Drawn (Tied)
L: Matches Lost
P: Points
A win earns a team 3 points. A draw earns 1. A loss earns 0.

The outcome should be ordered by points, descending. In case of a tie, teams are ordered alphabetically.

Input

Your tallying program will receive input that looks like:

Allegoric Alaskans;Blithering Badgers;win
Devastating Donkeys;Courageous Californians;draw
Devastating Donkeys;Allegoric Alaskans;win
Courageous Californians;Blithering Badgers;loss
Blithering Badgers;Devastating Donkeys;loss
Allegoric Alaskans;Courageous Californians;win
The result of the match refers to the first team listed. So this line

Allegoric Alaskans;Blithering Badgers;win
Means that the Allegoric Alaskans beat the Blithering Badgers.

This line:

Courageous Californians;Blithering Badgers;loss
Means that the Blithering Badgers beat the Courageous Californians.

And this line:

Devastating Donkeys;Courageous Californians;draw
Means that the Devastating Donkeys and Courageous Californians tied.

Your program should only process input lines that follow this format. All other lines should be ignored: If an input contains both valid and invalid input lines, output a table that contains just the results from the valid lines.


测试用例：
```
Allegoric Alaskans;Blithering Badgers;win
Devastating Donkeys;Courageous Californians;draw
Devastating Donkeys;Allegoric Alaskans;win
Courageous Californians;Blithering Badgers;loss
Blithering Badgers;Devastating Donkeys;loss
Allegoric Alaskans;Courageous Californians;win
```

```js
function Tally (matchRecords) {
  var map = {}
  for (var i = 0; i < matchRecords.length; i++) {
    var record = matchRecords[i]
    if (record) {
      var [A, B, result] = record.split(';')
      // 如果没有存入，就要初始化一次
      if (!map[A]) {
        map[A] = {
          teamName: A,
          MP: 0,
          W: 0,
          L: 0,
          D: 0,
          P: 0
        }
      }

      if (!map[B]) {
        map[B] = {
          teamName: B,
          MP: 0,
          W: 0,
          L: 0,
          D: 0,
          P: 0
        }
      }

      map[A].MP++
      map[B].MP++

      if (result === 'win') {
        map[A].W++
        map[A].P+=3
        map[B].L++
      }

      if (result === 'loss') {
        map[B].W++
        map[B].P+=3
        map[A].L++
      }

      if (result === 'draw') {
        map[A].D++
        map[B].D++
        map[A].P+=1
        map[B].P+=1
      }
    }
  }

  var tempArray = []
  for (item in map) {
    tempArray.push(map[item])
  }

  tempArray.sort((a, b) => {
    return b.P - a.P
  })

  function render (tempArray) {
    var model = '\nTeam                           | MP | W | D | L | P\n'
    var namePadding = 60
    for (var i = 0; i < tempArray.length; i++) {
      var record = tempArray[i]
      var { teamName, MP, W, D, L, P } = record
      var name = teamName.padEnd(30, ' ')
      model += `${name} | ${MP}  | ${W} | ${D} | ${L} | ${P}\n`
    }
    return model
  }
  return render(tempArray)
}

Tally([
  'Allegoric Alaskans;Blithering Badgers;win',
  'Devastating Donkeys;Courageous Californians;draw',
  'Devastating Donkeys;Allegoric Alaskans;win',
  'Courageous Californians;Blithering Badgers;loss',
  'Blithering Badgers;Devastating Donkeys;loss',
  'Allegoric Alaskans;Courageous Californians;win'
])
```

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
// var test = [[1, 2], [5, 3], [3, 1], [1, 2], [2, 4], [1, 6], [2, 3], [3, 4], [5, 6]]

// var dominoes = function (chains) {
//   var temp = {}
//   for (var i = 0; i < chains.length; i++) {
//     var chain = chains[i]
//     var [first, last] = chain

//     if (temp[first]) {
//       temp[first].push(i)
//     } else {
//       temp[first] = [i]
//     }

//     if (temp[last]) {
//       temp[last].push(i)
//     } else {
//       temp[last] = [i]
//     }
//   }
//   // 如果骨牌的个数存在单数，那么肯定不能匹配
//   var tempList = Object.keys(temp)
//   var canContinue = true
//   for (var i = 0; i < tempList.length; i++) {
//     var chainlist = tempList[i]
//     if (chainlist.length % 2) {
//       canContinue = false
//       break
//     }
//   }

//   if (!canContinue) { return [] }

//   function matchGroup (c1, c2) {
//     var [A, B] = c1
//     var [C, D] = c2
//     var result = []
//     if (A === C) {
//       // 可能的头尾
//       result.push({
//         possible: [ [[B, A], [C, D]], [[D, A], [C, B]] ]
//       })
//       return result
//     }

//     if (A === D) {
//       // 可能的头尾
//       result.push({
//         possible: [ [[B, A], [D, C]], [[C, A], [D, B]] ]
//       })
//       return result
//     }

//     if (B === C) {
//       // 可能的头尾
//       result.push({
//         possible: [ [[A, B], [C, D]], [[D, B], [C, A]] ]
//       })
//       return result
//     }

//     if (C === D) {
//       result.push({
//         possible: [ [[A, C], [D, B]], [[B, C], [D, A]] ]
//       })
//       return result
//     }
//   }

//   console.log(temp)
// }
// dominoes(test)
```
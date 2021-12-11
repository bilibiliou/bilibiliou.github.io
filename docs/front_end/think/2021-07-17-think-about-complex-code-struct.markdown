---
layout: post
title: 关于修改复杂数据结构的思考
category: 技术
keywords: 技术, js, javascript
---

## 注意

本文需要要求读者由 typescript 和 react 的相关知识才能理解!

如果在业务中遇到代码难梳理，逻辑错综复杂，维护性不高的情况，可以继续读一读，瞧一瞧

## TL;DR

在我业务中遇到过对复杂结构的数据修改，例如现在有一个数据结构如下（这些都是真实地业务中脱敏出来的）

## 关于复杂数据的结构描述

```ts
interface complexData {
  complexDataUniqueId: string; // 复杂数据结构的 唯一id
  relatedDatas: OtherComplexData[];

  ...otherUnconsideredInfos; // 其他和本文无关的数据
}

interface OtherComplexData {
  otherComplexDataUniqueId: string; // 复杂数据结构2的 唯一id
  user_info: userInfo;

  ...otherUnconsideredInfos; // 其他和本文无关的数据
}

interface userInfo {
  user_id: string;
  user_name: string;
  age: number;
  user_follow_info: userFollowInfo;

  ...otherUnconsideredInfos; // 其他和本文无关的数据
}

interface userFollowInfo {
  relation_type: RelationType;

  ...otherUnconsideredInfos; // 其他和本文无关的数据
}

enum RelationType {
  // 互不关注
  NON_FOLLOW = 0,
  // 已关注
  FOLLOWED = 1,
  // 被关注
  FOLLOWING = 2,
  // 互相关注
  MUTUAL_FOLLOWING = 3
}
```

## 正文

如上所示数据结构相当之复杂，一个复杂的数据结构中包含了另外一个复杂的数据结构，另外一种复杂的数据结构中包含了用户的信息，用户的信息中包含了该用户和当前登录用户的关系

然后在现在业务上需求是，由一个 complexData[] 的数组，输入一个 otherComplexDataUniqueId 匹配到其对应的关联的数据，然后修改这个结构的用户关系（比如 从 互不关注 变成 已关注）

按照面向过程的思考方式，我们可以很快的写出一段伪代码

```ts
state = {
  complexDatas: [complexData, complexData, complexData, ...]
}

followSomeUser (targetId: string) {
  // 也许就在你的业务代码中也会像我一样，充斥着大量大段大段的类似这样的函数
  // 逻辑错综复杂，功能难以维护
  this.setState({
      complexDatas: complexDatas.map(item => {
      item.relatedDatas.map(cItem => {
        if (targetId === cItem.otherComplexDataUniqueId) {
          cItem = {
            ...cItem,
            cItem.user_info = {
              ...cItem.user_info,
              user_follow_info: {
                ...cItem.user_info.user_follow_info,
                relation_type: RelationType.FOLLOWED // 修改成已经关注
              }
            }
          }
        }
      })
    })
  })
}
```

思路很清晰，保持所有其他的数据不变，并返回新的引用（react）
但是这样写实在是非常的复杂丑陋，让人摸不清逻辑，作者可能没几个月后也会忘记

所以，我们在写业务代码中，需要可以很好的把代码逻辑拆分，下面让我们来简单把上述的伪代码做一个拆分和解构

我们把代码分成两个部分，查找 和 赋值

首先是查找，我们可以把查找抽象成一个函数来做

```ts
// 函数式的查找需要修改的目标, 匹配目标id
const match = (o: otherComplexData, targetId: string) =>  o.otherComplexDataUniqueId === targetId;
```

```ts
// 赋值(对于数据结构的更新，和更新补丁类似，所以叫patch)
const patchOtherComplexDataFollowRelation = (o: otherComplexData, relation_type: RelationType) => {
  return  {
    ...o,
    o.user_info = {
      ...o.user_info,
      user_follow_info: {
        ...o.user_info.user_follow_info,
        relation_type // 修改成已经关注
      }
    }
  }
}
```

然后是遍历并修改

```ts
const updateList = (list: complexData[], targetId: string) => {
  return list.map(item => item.relatedDatas.map(cItem => { match(cItem, targetId) ? ...patchOtherComplexDataFollowRelation(cItem, RelationType.FOLLOWED) : cItem} ))
}
```

让我们完整地看看用函数式 + 解耦的方式写

```ts
state = {
  complexDatas: [complexData, complexData, complexData, ...]
}

followSomeUser (targetId: string) {
  const match = (o: otherComplexData, targetId: string) =>  o.otherComplexDataUniqueId === targetId;

  const patchOtherComplexDataFollowRelation = (o: otherComplexData, relation_type: RelationType) => {
    return  {
      ...o,
      o.user_info = {
        ...o.user_info,
        user_follow_info: {
          ...o.user_info.user_follow_info,
          relation_type // 修改成已经关注
        }
      }
    }
  }

  const updateList = (list: complexData[], targetId: string) => {
    return list.map(item => item.relatedDatas.map(cItem => { match(cItem, targetId) ? ...patchOtherComplexDataFollowRelation(cItem, RelationType.FOLLOWED) : cItem} ))
  }

  // 这样看起来是不是非常的清晰，让人易于理解？
  this.setState(s => ({ complexDatas: updateList(s.complexDatas) }))
}
```


通过两种方式的比较，我们可以明确认识到，当我们平时业务中遇到一大段非常复杂的逻辑的时候，一定要学会梳理脉络
把复杂的逻辑多解耦，该拆分拆分，这样才能让我们写的代码更具备更好的可读性和可维护性

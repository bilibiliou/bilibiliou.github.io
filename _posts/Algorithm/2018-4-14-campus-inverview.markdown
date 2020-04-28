---
layout: post
title: 校招笔试题
category: 算法
keywords: 算法
---

## 题1

小Q的父母要出差N天，走之前给小Q留下了M块巧克力。小Q决定每天吃的巧克力数量不少于前一天吃的一半，但是他又不想在父母回来之前的某一天没有巧克力吃，请问他第一天最多能吃多少块巧克力

输入描述:

每个输入包含一个测试用例。
每个测试用例的第一行包含两个正整数，表示父母出差的天数N(N<=50000)和巧克力的数量M(N<=M<=100000)。
输出描述:

输出一个数表示小Q第一天最多能吃多少块巧克力。
输入例子1:

3 7
输出例子1:

4

这题思路很清晰，首先封装一个函数 canEat 判断一个 1 到 M 间的数，是否能够满足 N 天内的条件食用量
然后使用二分查找，从 1 到 M间找到这个数即可

```js
var N = 1
var M = 7
var canEat = function (n, N, M) {
  var sum = 0
  for (var i = 0; i < N; i++) {
    sum += Math.ceil(n * Math.pow(0.5, i))
  }
  return sum <= M
}

var howMuchCanEat = function (N, M) {
  if (N < 2) {return M}
  var mid = Math.floor(M / 2)
  var left = 1
  var right = M
  while (right - left > 1) {
    var isCan = canEat(mid, N, M)
    if (isCan) {
      left = mid
      mid = Math.floor((right + mid) / 2)
    } else {
      right = mid
      mid = Math.floor((left + mid) / 2)
    }
  }
  return left
}
howMuchCanEat(N, M)
```

## 题2

某国货币系统包含面值1元，4元，16元，64元共计4钟硬币，以及面值1024元的纸币。现在某人使用1024元的纸币购买了一件价格为N(0≤N≤1024)的商品。请问最少他会收到多少硬币?

```js
function main (consume) {
  var surplus = 1024 - consume
  var radix = 6
  var result = 0

  while (surplus) {
    var level = Math.pow(2, radix)
    result += parseInt(surplus / level)
    surplus = surplus % level
    radix -= 2
  }
  return result
}

main(1022)
```
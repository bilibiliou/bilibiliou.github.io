---
layout: post
title: 动态规划相关题和思考
category: 算法
keywords: 算法
---

## 动态规划

动态规划的本质是：不断基于前一个状态的最优解，进行递归计算，最终找到一个最终的解决方案

其中的核心还是构建 dp 表 （dynamic programming table）

构建dp表的过程，找到状态转换的相关方程

### 背包问题

假设你是一个小偷，带了一个只能N斤东西的背包 （N 不确定）

现在可以偷的东西分量和价值如下

A物品 3斤 值 4$
B物品 4斤 值 5$
C物品 5斤 值 6$

需要设计一套算法，求出无论当N取多少时，都能输出一个最优解

这题影响的因素 一个是物品的重量，一个是能背的重量，

1. 我们每次都从零开始决策，找到一个最优状态

2. 每次循环都是一次决策，通过状态转换的方程，进行状态的转换

3. 循环结束，找到最后一次状态得到最优解

```js
var max = 10
var prices = [4, 5, 6]
var items = [3, 4, 5]
var packDynamicProgram = function (max, prices, items) {
  var result = []
  // 放第几件物品
  for (var i = 0; i < items.length; i++) {
    result[i] = []
    // 背包有多重
    for (var j = 0; j <= max;j++) {
      // 当背包的重量为0的时候，根本不可能装任何东西
      // 所以 第 零 列 能产生的价值一定都是0
      if (j === 0) {
        result[i][j] = 0
        continue;
      }

      // 如果当前背包剩余重量小于当前的质量
      if (j < items[i]) {
        // 如果只是放第一件，那么肯定是放不下的，所以 产生的结果价值一定是0
        if (i === 0) {
          result[i][j] = 0
        } else {
          // 如果现在想放第2，第3，第4... 件，那么此时肯定也是放不下的，那么产生的结果价值只能是维持上一阶的状态
          result[i][j] = result[i - 1][j]
        }
        continue
      }
      

      // 如果当前背包可以塞得进东西，且
      if (i === 0) {
        // 如果塞第一件物品，之前背包里没塞任何东西，那么产生的结果价值是第一件物品
        result[i][j] = prices[i]
      } else {
        // 如果现在想放第2，第3，第4... 件，说明放这玩意需要消耗背包质量
        // 这时候就需要进行权衡
        // 到底是 prices[i] + result[i-1][j-items[i]] 可以产生的结果价值大
        // 还是 result[i-1][j] 可以产生的价值大
        result[i][j] = Math.max(prices[i] + result[i-1][j-items[i]], result[i-1][j])
      }
    }
  }
  return result[items.length - 1][max]
}
```

### 青蛙爬台阶问题

一只青蛙，一次可以跳一阶或两阶，输入台阶数N

问，青蛙能够有多少种跳法

```js
var numWays = function (n) {
  var func = function (x, a = 1, b = 1) {
    if (x < 2) {
      return b
    }

    return func(x - 1, b, (a + b) % 1000000007)
  }

  return func(n)
}
```

本质可以转为当最后一次，青蛙可以跳一阶还是跳两阶

```
f(n) = f(n - 1) + f(n - 2)
```

尾递归优化： func(n - 1) + f(n - 2)
在n 较大的情况下，会由于递归栈内塞入了大量的函数，导致堆栈溢出
解决这个问题的做法依然是需要基于尾递归的方式进行优化

```
初始化 a = 1, b = 1
func(x - 1, b, (a + b))
```

[看这里](https://leetcode-cn.com/problems/qing-wa-tiao-tai-jie-wen-ti-lcof/solution/mian-shi-ti-10-ii-qing-wa-tiao-tai-jie-wen-ti-dong/)

### 股票问题

[看这里](https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock-iii/solution/yi-ge-tong-yong-fang-fa-tuan-mie-6-dao-gu-piao-wen/)

### 最小编辑距离

[看这里](http://bilibiliou.github.io/posts/min-edit-distance/)
## 动态规划

动态规划的本质是：不断基于前一个条件的最优解，进行递归计算，最终找到一个最终的解决方案

### 背包问题

假设你是一个小偷，带了一个只能N斤东西的背包 （N 不确定）

现在可以偷的东西分量和价值如下

A物品 3斤 值 4$
B物品 4斤 值 5$
C物品 5斤 值 6$

需要设计一套算法，求出无论当N取多少时，都能输出一个最优解

```js
var max = 10
var prices = [4, 5, 6]
var items = [3, 4, 5]
var packDynamicProgram = function (max, prices, items) {
  var result = []
  for (var i = 0; i < items.length; i++) {
    result[i] = []
    for (var j = 0; j <= max;j++) {
      if (j === 0) {
        result[i][j] = 0
        continue;
      }

      // 如果背包剩余重量小于当前的质量
      if (j < items[i]) {
        if (i === 0) {
          result[i][j] = 0
        } else {
          result[i][j] = result[i - 1][j]
        }
        continue
      }

      if (i === 0) {
        result[i][j] = prices[i]
      } else {
        result[i][j] = Math.max(prices[i] + result[i-1][j-items[i]], result[i-1][j])
      }
    }
  }
  return result
}
```

### 青蛙爬台阶问题

### 股票问题
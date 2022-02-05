#  怎么把女朋友的照片揉成心形

## 效果

![gif](/assets/images/heart-animation.gif)
## 原理

这个效果是利用了Threejs来实现的，首先把女朋友的照片加载进来，然后加载一个3维的平面网格，当女朋友点击的时候，控制网格的顶点运动成一个爱你的心形，这样就实现了揉纸动画。
本文是一个很简单教学帖，略点一二，具体细节请看源码的注释

## 代码文件结构

```
女朋友的照片.jpg
heart.js  // 计算心形轨迹
plane.js  // 定义的平面类，通过Three的网格和材质来把女朋友画出来
point.js  // 定义的点类，用来把平面里的点运动到计算好的心形轨迹
world.js  // 定义的基本的ThreeJs的舞台、场景、摄像机
index.html // 你画的一个浪漫温馨的页面
```

## 心形的实现

这里的心形我是采用下面这个极坐标方程来实现

```
ρ = 11
x = ρ * 16 * Sin³(θ)
y = ρ * (13 * Cos(θ) - 5Cos(2θ) - 2Cos(2θ) - 2Cos(3θ) - Cos(4θ))
```

由此我们可以封装一个函数

```js
function calcHeartPosition(θ) {
  const { cos, sin, pow } = Math;
  const p = 11;
  return {
    x: p * 16 * pow(sin(θ), 3),
    y: p * (13 * cos(θ) - 5 * cos(2 * θ) - 2 * cos(3 * θ) - cos(4 * θ))
  }
}

// 根据需要控制的点数量，每个点分配为一弧度，输入进函数中即可
// pointsTotal 一共有几个点
// index 点的索引，0、1、2、3、4、... pointsTotal - 1
const degree = 2 * PI / totalLength * (index + 1);
const { x, y } = calcHeartPosition(degree); // 得到了一个点在心形中的坐标
```

## 搭建场景

我们先搭建 ThreeJs 的场景，包括渲染器、相机、场景、舞台等类，并调整好相机的距离，定义好渲染函数，既每一帧执行的函数，具体代码请见`world.js`

## 将女朋友绘制出来

我们通过 `plane.js` 中定义的 `PlaneGeometry` 平面几何体是可以加载材质的，将女朋友的照片以材质的方式加载进来，ThreeJs 同时也会帮我们根据入参的分段的宽高，计算出一个个分段的点，
将这些点输入到 `point.js` 中可以就可以得到点类，通过补间动画控制这些点，就能够实现爱心动画的变化

## 源码

很多细节我都在源代码里备注了，大家可以看看👇
[https://github.com/bilibiliou/animations](https://github.com/bilibiliou/animations)

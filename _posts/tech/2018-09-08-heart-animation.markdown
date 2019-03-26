---
layout: post
title: 基于ThreeJs Heart animation 动画
category: 技术
keywords: 技术,js,ThreeJs
---

## 效果

![gif](https://bilibiliou.github.io/assets/download/animations/heart-animation.gif)

## 思路

基于ThreeJs设置一个 PlaneGeometry ，加载图片 Texture，获取 PlaneGeometry 下的所有 vertices , 依照 心形函数 

```
x = 16sin³(t)
y = 13Cos(t) - 5Cos(2t) - 2Cos(3t) - Cos(4t)
t ∈ [0,2π]
```

将原有Mesh内的点集均匀的排布在心形的轨迹上，渲染函数

间补动画通过位移差进行计算

## 坑 和 Caveats

### 加载Texture

加载Texture 一定要在服务器环境下（推荐Http-server）

### 心形轨迹计算

```js
var vdeg = ((2 * Math.PI) / _obj._geo.vertices.length) * _id
var _tx = 11 * 16 * Math.pow( Math.sin(vdeg) , 3);
var _ty = 11 * (13 * Math.cos( vdeg ) - 5 * Math.cos( 2 * vdeg ) - 2 * Math.cos( 3 * vdeg ) - Math.cos( 4 * vdeg ));
```

众所周知，圆 === 2π 所以心形也是一样
这里将 2π除以点集数，等到每一份的度数，在根据公式计算出具体的位置（x,y）

注意，原有函数所绘制的心形太小，这里我给x和y都乘以了一个 11 的倍数
这个参数可以自行调整

### 速度算法

随机生成一个速度倍率 s

```js
this._speedA = Math.random() * 18 * 0.01 + 0.08;  // 我们称为s
```

```js
this._currentV.x = ( this._currentV.x * this._speedB ) + ( this._trgV.x * this._speedA );
```

新当前点位置 === 旧当前点位置 * s + 目标点位置 * （1 - s）

目标点 * s > 旧当前位置 * s

所以每次渲染实际上点的增量为 s * (目标点 - 当前旧位置)

### 原理

由于Three 的核心是 几何体（Geometry） + 材质（Material） => 网格模型（Mesh）

内置的 几何体模型 就包含了很多 Vector3 (三维向量)  本质就是点

这里我们可以在声明 Geometry 的时候通过设置 几何体分段来实现

```js
this._geo = new THREE.PlaneGeometry( this._world._stageWidth, this._world._stageHeight, this._segW, this._segH );

// 这里的_segW 和 _segH 分别为 x轴的分段和y轴的分段
// 分别为 12 和 6
// 也就是说产生了 (12+1) * (6+1) 个 Vector3
// 我们所操控的 vertices 就是由这些 Vector3 来组成的 
``` 

Three 会自动将 Vector3 连起来， 这个我们可以通过 设置 wireframe: true 来看到

这样如果我们将 PlaneGeometry 的透明度调低，就能够看到这个互相连线心形点集

如果想要心画的更密集，可以增加分段数，但是过多的分段数将会影响性能体验

## 感谢

感谢 homunculus （https://homunculus.jp/ ）株式会社的创意，有些东西，咱们真的暂时还没法超过人家

## 最后

本文章严禁用于商业行为，仅供学习参考

## 源码

[https://github.com/bilibiliou/animations](https://github.com/bilibiliou/animations)

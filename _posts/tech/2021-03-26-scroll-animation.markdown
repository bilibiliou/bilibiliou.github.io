---
layout: post
title: 浅谈滚动驱动动画实现原理
category: 技术
keywords: 技术, 滚动驱动动画
---

## 前言

如果你平时对苹果的网页感兴趣，你会发现他们很多产品的首发都采用了滚动式驱动技术来控制网站动效，举两个例子:

[Apple arcade](https://www.apple.com/apple-arcade/)

[Apple big sur](https://www.apple.com/macos/big-sur/)

关于这块技术，今天想在这里和大家简单讨论一下，其背后的实现原理

并写出来一个可以跑的小demo

### 笔者小贴士

1. 时间和时刻概念不一样，请先行了解时刻的意思
2. 会用到 react-hook 相关知识
3. 本文仅在[我的博客](http://bilibiliou.github.io/)和掘金+知乎发布，未经过我的同意，谢绝一切商用和无脑全文复制粘贴

## 分析

笔者认为一个合格的滚动驱动动画框架，最最最起码，需要包含以下几个要素：
1. 具有动画的功能，能够解决怎么让div或者canvas绘制的图层动起来的问题
2. 能够控制动画的 播放/倒放/暂停
3. Timeline 时间轴功能，每个动画都独立拥有一个时间轴，只有到了对应的时间，才会执行动画
4. Scroll-driven  滚动驱动，也能够允许用户的鼠标/触摸板等输入设备滚动，来驱动多条时间轴上的动画的  播放/倒放/暂停

那么我们接下来就逐条实现

## 动画

我们渲染技术我们可以选 css 动画或canvas ，这里我们为了方便理解还是以 css 作为基础能力

为了实现 上述分析的 1 和 2

我们需要了解一个名词，Tween-function（补间函数）
注：也有翻译成Easing-function 缓动函数的

### Tween-function（补间函数）

先聊最核心的，怎么让div动起来，也就是补间动画的实现，我们先来看个例子：

![img](/assets/img/scroll_animation_display1.png)

这个问题其实很简单，套个公式就能算：

```js
// _c 是最终位移值 200px, b 是初始值 100px, 
// t 是当前时刻，第四秒的话就是4， d 是动画的总长，5秒的话就是5
function linear(t, b, _c, d) {
  let c = _c - b;
  return c * t / d + b;
}

// 得出第四秒的时候 div 的位移应该是 180px
```

那么基于这个栗子，我们就可以马上写出一个简单动画的代码(可以直接丢到Console里面跑跑看)：

```js
function linear(t, b, _c, d) {
  let c = _c - b;
  return c * t / d + b;
}

// let box = document.getElementById('#box');

let perTime = 1000 / 60 // 1000 毫秒内渲染 60帧， 那么每间隔 16.6毫秒渲染一帧
let currentTime = 0 // 初始时刻为 0秒
let duration = 5000 // 总时长是 5秒

let defaultTarget = currentValue = 100 // 初始值为100px, 当前值也是100px
let target = 200; // 目标值为200px

(function _render () {
  currentTime += perTime; // 每渲染一次，时长加一点
  currentValue = linear(currentTime, defaultTarget, target, duration);
  console.log(currentValue, target, currentTime)
  // 如果每次计算的结果丢给一个 叫 box 的div ，那div是不是就动起来了？
  // box.style.left = `${currentValue}px`;

  // 只要没有达到200px 就一直跑渲染函数
  if (currentValue < target) {
    _render();
  }
})();
```

我们把上面提到的 linear 这种函数，称为补间函数 Tween function 或者 Easing functions ，通过这些函数,它们的函数图像纵轴是X取值[-1, 1] 但是多数都是[0, 1], 横轴是单位时刻t [0, 1],

X 是补间量，比如上面那个栗子也就是div从 100px 到 200px 的位移动画
那么当 X 为 0.8，时就是 100px + 0.8 * (200px - 100px) = 180px， 这就是补间量的含义
时间是单位时间，这里区间是[0, 1]很好理解 0 就是开始 1 结束

有了补间函数，我们就可以做到：

1. 根据某一个时刻算出当前的补间量，或者根据补间量算出当前处于哪一时刻。
2. 根据提供的时刻点，能够计算出某一时刻的值，比如说输入第四秒，能够得到div运动到了180px, 这样我们就能够随便的控制div播放/倒放/从某一个时间点开始播放
3. 通过控制速率，来控制整体的动画效果，比如说 我们看 easeInOutQuad, 这个补间函数它的斜率就是先缓后陡再缓， 对应过来动画的效果就是，开头慢慢开始，中间播的快，结尾慢慢结束

![img](/assets/img/scroll_animation_ease.png)

业界有一个专门介绍补间函数的网站 https://easings.net/ 有兴趣的同学可以看看

上面的栗子我们提到的只是控制位移，实际上我们可以通过这个补间函数控制很多东西, 比如下面的伪代码：

```js
// 控制 div的缩放旋转
easeInOutSine(currentTime, defaultScale, targetScale, duration);
easeInOutSine(currentTime, defaultRotate , targetRotate, duration);

// 控制 div的颜色变化, 显示隐藏
let R = linear(currentTime, defaultRedChannel, targetRedChannel, duration);
let G = linear(currentTime, defaultGreenChannel, targetGreenChannel, duration);
let B = linear(currentTime, defaultBlueChannel, targetBlueChannel, duration);
let A = linear(currentTime, defaultOpacity, targetOpacity, duration);

// 控制 3d 景深
let A = easeInOutQuad(currentTime, defaultPerspective, targetPerspective, duration);
```

看到这里，大家肯定理解了：只要是数值上的变化，最后实际上都可以抽象成一个补间函数来实现。

上面提到的补间是最基本的匀速，但是在现实的需求中，我们还会需要满足各种天花乱坠的需求如： 先慢后快，先快后慢，弹性运动，钟摆运动，甚至自定义贝塞尔运动曲线，这些不免会需要很多数学计算的知识。

这些知识很难，没有一点数学和物理功底根本看不懂，但是没关系，开源社区已经帮我们做了这个事情，这里推荐一个开源库：[tween-functions](https://github.com/chenglou/tween-functions)

这个实际上是非常非常的基础依赖库了，它非常轻、源码也很简单就是很纯的数学+物理的封装，并没有任何的业务逻辑，这个库也是一些刚刚接触动画方面的同学来上手学习一个比较好的切入点，所以你可以基于 tween-functions 来封装任何你想做的事(不局限于动画，任何需要描述数据上变化的事情)。

## Timeline（时间轴）

时间轴的概念，很多地方都有，最简单的就是B站播放器的时间轴，这是最贴近我们生活的一个例子, 企业也有时间轴，比如 微软的 Office timeline 工具，就给我们展现了一个跨国企业年度计划的时间轴，时间轴便于我们去总体的协调各个时间线上的事务，当然这里的需要处理的事务就单指动画

![time line demo](/assets/img/scroll_aniamtion_timeline_demo.png)

js 动画领域肯定也有时间轴，只是我们平时不会把这个轴画出来，我们今天要做的就是实现一个简单的时间轴


为了方便理解，我们把上面的例子拿过来, 这里我们改一下需求：

```
当 0 - 2秒 的时候, 让 div 位移，从100px 到 200px, 动画时长是两秒
当 1 - 2秒 的时候 , 让 div 透明度变化，从 opacity 从 1 变到 0.5, 动画时长是1秒
```

这里我们实际上就是设置了两条独立的时间轴，他们在 0-2秒 和 1-2秒 间会处理各自的动画事情，但是总的来看是动画一体的


我们用一个 animationData 对象来记录时间轴的动画信息，改造一下代码（下面代码可以直接复制丢到 Console 里面跑）：

```js
function linear(t, b, _c, d) {
  var c = _c - b;
  return c * t / d + b;
}

let perTime = 1000 / 60 // 1000 毫秒内渲染 60帧，那么每间隔 16.6毫秒渲染一帧
let animationData = [
  { key: 'left', defaultValue: 100, currentValue: 100, target: 200, duration: 2000, startTime: 0 },
  { key: 'opacity', defaultValue: 1, currentValue: 1, target: 0.5, duration: 1000, startTime: 1000 },
];

// startTime 开始的时刻，从第x秒开始，单位是毫秒
let currentTime = 0; // 当前时刻
let endTime = 0;

animationData.forEach(item => {
  const { duration, startTime } = item;
  endTime = Math.max(duration + startTime, endTime); // 计算出在什么时刻需要结束
});

(function _render () {
  currentTime += perTime;
  // 每渲染一次，进度条加一点，
  // 如果是时间轴倒放那么 currentTime = Math.min(currentTime - perTime, 0) 就行
  
  animationData.forEach(item => {
    const { startTime, duration, defaultValue, target, currentValue } = item;

    // 当时间线到达开始时间后，执行该时间线动画
    // 当到达时间结束的时候，停止动画
    if (currentTime >= startTime && currentTime <= startTime + duration) {
     let calcValue = linear(currentTime - startTime, defaultValue, target, duration);
     item.currentValue = calcValue;
    }
  });
  console.log('div 位移：', animationData[0].currentValue);
  console.log('div 透明度变化：', animationData[1].currentValue);
  console.log('当前时刻为：', currentTime);
  console.log('\n');
  
  // 这里把计算的结果赋值给 div
  // box.style.left = animationData[0].currentValue
  // box.style.opacity = animationData[1].currentValue
  
  // 只要时间没有结束，就继续执行, 如果是倒放，就让currentTime > 0 即可
  if (currentTime <= endTime) {
    _render();
  }
})();
```

这是一个正向的时间轴，它只能从开始到结束，不能从结束回放到开始，那么我们怎么控制时间轴随意的时间旅行呢？

关键还是控制当前时刻 currentTime 和 渲染条件
```js
currentTime += perTime; // 正向播放是加一帧，
currentTime -= Math.min(currentTime - perTime, 0) //  那么逆向减一帧不就行了？
```

```js
if (currentTime <= endTime) { // 正向播放是当前时刻小于结束时刻
  _render();
}

if (currentTime > 0) { // 逆向则让齐大于开始时刻（0）
  _render();
}
```

这样一个简陋的时间轴控制div动画的 播放/倒放 功能就实现了（实战中还会加亿点细节）。


### 笔者小贴士

接下来我会写一些伪代码，但是最后会给一个最终的demo代码出来
接下来的内容可能会有点抽象难动，希望大家能读懂～

## ScrollDriven（滚动驱动）

所谓滚动驱动，实际上就是通过监听用户的 鼠标滚轮/触摸板 的滚动来控制时间轴的 播放/倒放

对应到时间轴中就是控制 currentTime 的增减

所以首先，我们需要在页面上定一个滚动区，当用户滚动的时候，获取这个滚动区的scrollTop, 然后映射到时间轴上的时间区间，那么就实现了简单的通过滚动驱动来控制时间轴，时间轴控制css动画的播放/暂停/倒放

这里我们用全局的body作为滚动区间

我这里先丢一下映射函数，以及scrollTop兼容函数（自己看源码理解）：

```js
// s 是 区间[a1, a2] 的值
// 返回 s map 映射到 [b1, b2] 后的值
function map (s, a1, a2, b1, b2) {
  return ((s - a1) / (a2 - a1)) * (b2 - b1) + b1
}
```

```js
const isWindow = obj => {
  const toString = Object.prototype.toString.call(obj);
  return toString === '[object global]' || toString === '[object Window]' || toString === '[object DOMWindow]';
};

const scrollTop = (ele, target) => {
  const isWin = isWindow(ele);
  const y =
    window.pageYOffset !== undefined ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;

  if (typeof target === 'number' && !isNaN(target)) {
    if (isWin) {
      document.documentElement.scrollTop = target;
      document.body.scrollTop = target;
    } else {
      ele.scrollTop = target;
    }
  }

  return isWin ? y : ele.scrollTop;
};
```

然后简简单单map一下：
```js
currentTime = Math.max(map(scrollTop(window), 0, document.body.scrollHeight - window.innerHeight, 0, endTime), 0); // 提醒，这段代码在 _render 函数里面
```

这样我们就做到了，将滚动的scrollTop映射到了时间轴上

然后还需要再根据用户滚动的方向，来控制条件渲染，这这么做呢？
首先我们再封装一个工具函数scrollGate，它能够允许我们判断用户的滚动方向：

```js
function scrollGate(callback) {
  let before = 0;

  return function () {
    const current = scrollTop(window);
    const delta = current - before;

    if (delta >= 0) {
      callback && callback('down');
    } else {
      callback && callback('up');
    }

    before = current;
  };
}
```

然后监听滚动事件：
```js
function _scrollHandler (dir) {
  if (dir === 'down') {
    reverse = false;
    _render(); // 正向渲染，执行上文的计算+映射逻辑

  } 

  if (dir === 'up') {
    reverse = true;
    _render(); // 反向渲染，执行上文的计算+映射逻辑
  }
}

useLayoutEffect(() => {
  const scrollHandler = scrollGate(_scrollHandler);
  window.addEventListener('scroll', scrollHandler);
  return () => {
    window.removeEventListener('scroll', scrollHandler);
  }
}, []);
```

搞定，这样我们就做到了简单滚动驱动！

## 后续

前面我们了解了

1. 什么是滚动式驱动动画，一个简单的滚动式驱动动画，由那些功能组成
2. 滚动式驱动动画的各个模块的功能实现
3. 什么是补间动画


现在我们基于前面所学的，写一个正儿八经能跑起来的demo把！


## Demo 实现

别问我为啥不建个仓库，主要还是 太lan忙 ~

这里的toFixed扒拉了 @jljsj33 的代码, 他（们）写的 [ant-motion](https://github.com/ant-design/ant-motion) 很赞！

```js
export function toFixed(num, length) {
  const _rnd = length ? Math.pow(10, length) : 100000;
  const n = num | 0;
  const dec = num - n;
  let fixed = num;
  if (dec) {
    const r = ((dec * _rnd + (num < 0 ? -0.5 : 0.5) | 0) / _rnd);
    const t = r | 0;
    const str = r.toString();
    const decStr = str.split('.')[1] || '';
    fixed = `${num < 0 && !(n + t) ? '-' : ''}${n + t}.${decStr}`;
  }
  return parseFloat(fixed);
}
```

```js
// Home.scss

body {
  height: 5000px;
  overflow-y: scroll;
}

.container {
  text-align: center;
}

.box {
  width: 200px;
  height: 200px;
  background: pink;
  position: fixed;
  top: 300px;
  left: 100px;
  opacity: .5;
}


// home.jsx
import React, { useLayoutEffect, useRef } from 'react';
import { scrollTop, scrollGate, toFixed, map } from '../../utils/index';
import './Home.scss';

export default function Home() {
const componentReference = useRef({
  animationData: [
    { key: 'left', defaultValue: 100, currentValue: 100, target: 800, duration: 2000, startTime: 0 },
    { key: 'opacity', defaultValue: .5, currentValue: .5, target: 1, duration: 1000, startTime: 1000 },
    { key: 'rotateX', defaultValue: 0, currentValue: 1, target: 270, duration: 1000, startTime: 2000 },
    { key: 'rotateY', defaultValue: 0, currentValue: 1, target: 180, duration: 1000, startTime: 2000 }
  ],
  status: 'start',
  currentTime: 0,
  endTime: 0,
  perTime: 1000 / 60,
  reverse: false,
  target: null
});

const cRef = componentReference.current;

function _linear (t, b, _c, d) {
  var c = _c - b;
  return c * t / d + b;
}

function _render () {
  if (cRef.status === 'running') {
    cRef.currentTime = Math.max(map(scrollTop(window), 0, document.body.scrollHeight - window.innerHeight, 0, cRef.endTime), 0);
  }

  if (cRef.status === 'start') {
    cRef.currentTime = 0;
  }

  if (cRef.status === 'ended') {
    cRef.currentTime = cRef.endTime;
  }

  cRef.animationData.forEach(item => {
    const { startTime, duration, defaultValue, target } = item;
    if (cRef.currentTime >= startTime && cRef.currentTime <= startTime + duration) {
      let calcValue = _linear(cRef.currentTime - startTime, defaultValue, target, duration);
      item.currentValue = toFixed(calcValue);
    }
    
    if (cRef.currentTime < startTime) {
      item.currentValue = defaultValue;
    }
  });

  cRef.target.style.left = cRef.animationData[0].currentValue + 'px';
  cRef.target.style.opacity = cRef.animationData[1].currentValue;
  cRef.target.style.transform = `rotateX(${cRef.animationData[2].currentValue}deg) rotateY(${cRef.animationData[3].currentValue}deg)`;
}

function _scrollHandler (dir) {
  if (dir === 'down') {
    cRef.reverse = false;
    if (cRef.currentTime < cRef.endTime) {
      cRef.status = 'running';
    } else {
      cRef.status = 'ended'
    }
  } 

  if (dir === 'up') {
    cRef.reverse = true;
    if (cRef.currentTime > 0) {
      cRef.status = 'running';
    } else {
      cRef.status = 'start';
    }
  }

  window.requestAnimationFrame(_render);
}

useLayoutEffect(() => {
  const myDiv = document.querySelector('#box');
  cRef.target = myDiv;
  cRef.animationData.forEach(item => {
    const { duration, startTime } = item;
    cRef.endTime = Math.max(duration + startTime, cRef.endTime);
  });

  const scrollHandler = scrollGate(_scrollHandler)

  window.addEventListener('scroll', scrollHandler);
  return () => {
    window.removeEventListener('scroll', scrollHandler);
  }
}, []);

return (
  <div className="container">
    <div id="box" className="box" />
  </div>
);
```

完结，撒花撒花～ 写的不好，跪求轻喷

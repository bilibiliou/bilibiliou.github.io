---
layout: post
title: 一起画只百度熊吧
category: 技术
keywords: 技术,svg,动画
---

## 起因

0. 第三节Css大会上（PPT）看到了微信 方潇仪 工程师分享的关于 svg动画的相关知识、
1. 刚刚拿到百度实习offer （*/∇＼*）、
2. 喜欢萌萌的百度熊

## 样式

<iframe height='486' scrolling='no' title='rWBKJp' src='//codepen.io/numerhero/embed/JEmyJo/?height=507&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/numerhero/pen/rWBKJp/'>rWBKJp</a> by Owen (<a href='http://codepen.io/numerhero'>@numerhero</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 思路

### 原理

其实方潇仪 也提到了，就是利用svg 的filter标签，让两个圆高斯模糊后的边缘处虚化后再将两个源合并

```html
 <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0">
    <defs>
        <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="step1"/>
            <feColorMatrix in="step1" mode="matrix" values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0  
                0 0 0 19 -9" result="step2" />
            <feComposite in="SourceGraphic" in2="step2" operator="atop"/>
        </filter>
    </defs>
</svg>
```

其中 我们可以想像 每一步都是一个图层，每一个标签都是一个处理工具

in 属性将图层输入 result 将结果输出，但是不会将原来的图层改变，只会增加一个新的图层

那么实际上就很明显了

我们使用 feGaussianBlur 高斯模糊将原图层 模糊 10个单位
然后使用 feColorMatrix 调节图层整体对比度，让其回归清晰

再将之前未处理过的图层和处理好的图层进行合并（feComposite），让原来图层上的图标、文字等能够清晰显现（因为经过高斯模糊处理所以文字图标都没了，）

然后我们把处理过的图层对其进行引用

```css
.nose {
  ...
  filter: url(./baidu_beer.html#gooey);
}
```

@彦子 同学 和 @大漠 老师对svg研究的十分透彻和深入 大家可以去看 w3cplus svg 标签下的相关内容

## 布局

filter 只能影响被设置的元素，以及其下的子元素

如果设置过多的filter 又会使性能下降，所以我们将需要粘性变形的布局进行嵌套

```html
<div class="nose">
    <div class="nose-be"></div>
    <div class="nose-mi"></div>
    <div class="nose-af"></div>

    <div class="l-eye-wrap">
        <div class="eye eye-be"></div>
        <div class="eye eye-mi"></div>
        <div class="eye eye-af"></div>

        <div class="l-eye-face"></div>
        <div class="l-ear-wrap">
            <div class="ear l-ear">
                <div class="ear-hole l-ear-hole"></div>
                <div class="ear-hole-mask l-ear-hole-mask"></div>
            </div>
        </div>
    </div>

    <div class="r-eye-wrap">
        <div class="eye eye-be"></div>
        <div class="eye eye-mi"></div>
        <div class="eye eye-af"></div>
        <div class="r-eye-face"></div>
        <div class="r-ear-wrap">
            <div class="ear r-ear">
                <div class="ear-hole r-ear-hole"></div>
                <div class="ear-hole-mask r-ear-hole-mask"></div>
            </div>
        </div>
    </div>
</div>
```

这样布局的好处

0. 给根元素添加粘性滤镜之外就能使所有的子元素都有粘性的效果
1. 方便我们对动画进行分割，从动画中我们也可以看出来，动画是先从鼻子先变化，然后出来两个眼睛，然后眼睛再分别出来耳朵，层层分割，让我们便于使用js 进行控制

## 流程控制

不得不说，Promise 真的很好用

我们可以使用Promise 模拟一个 Sleep函数

```js
function Sleep(timeout) {
    return new Promise(function(resolve) {
        setTimeout(function () {
            resolve();
        },timeout);
    });
}
```

这样就可以使用Promise 很好的对动画进行控制

```js
 let process = Promise.resolve();

  process.then(() => {
      oNose.classList.add('show');
      return Sleep(600);
  })
  .then(() => {
      oFace.classList.add('show');
      return Sleep(600);
  })
  .then(() => {
      oFace.classList.add('face-mor');
      oHeader.classList.add('show');
      return Sleep(600);
  })
  .then(() => {
      oNose.classList.add('nose-mor');
      oLeyeWrap.classList.add('l-eye-wrap-mor');
      oReyeWrap.classList.add('r-eye-wrap-mor');
      return Sleep(300);
  })

    ...
```

大家可以看出， 通过 很多个then 将一个连续的动画分割成了很多小的部分,通过控制class并配合 transition 和 keyframes animation ，我们就能画出这只萌萌哒的百度熊

## 源代码

想深入研究其他细节的同学，请参照[源码](https://github.com/NumerHero/animations)

喜欢该效果的朋友可以不要吝惜您的star哦~
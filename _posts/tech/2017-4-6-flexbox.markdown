---
layout: post
title: 深入理解 flex 布局以及计算
category: 技术
keywords: 技术,flex,css3
---

## 起因

对于flex布局，阅读了 大漠老师和其他老师写的文章后，我还是不太理解flexbox是如何弹性的计算子级项目的大小以及一些其他细节。在大漠老师的帮助下，我去查阅flexbox 的 w3c 规范文档

**注：本篇博文不适合未接触过flex 布局的人, 如果想了解flex 布局基础。请参考[理解Flexbox：你需要知道的一切](http://www.w3cplus.com/css3/understanding-flexbox-everything-you-need-to-know.html)**

## 对于flex盒模型的设计期望

flex盒模型是被期望设计成

1. 在任何流动的方向上(包括上下左右)都能进行良好的布局

2. 可以以逆序 或者 以任意顺序排列布局

3. 可以线性的沿着主轴一字排开 或者 沿着侧轴换行排列

4. 可以弹性的在任意的容器中伸缩大小（今天重点研究的主题）

5. 可以使子元素们在容器主轴方向上 或者 在容器侧轴方向上 进行对齐

6. 可以动态的 **沿着主轴方向** 伸缩子级的尺寸，与此同时保证父级侧轴方向上的尺寸

## 主轴和侧轴

很有必要先向大家解释清楚 3个问题 

1. 什么是主轴
2. 什么是侧轴
3. 他们是如何切换的

首先每一根轴都包括 三个东西：维度、方向、尺寸

什么意思呢？

1. 所谓的维度实际上就是意思就是子元素 横着排还是竖着排(x 轴 或 y 轴）
2. 方向 即排列子元素的顺序 顺序还是逆序
3. 尺寸 即width[height] ： **每一个子元素在主轴方向所占的位置的总和** 如果主轴是水平的，那么尺寸就是父元素内所有item的outerWidth总和,如果主轴是垂直的，那么尺寸就是父元素的outerHeight

主轴是依靠 flex-direction 和 所有子元素在主轴方向上的item-size的总和确定的，flex-direction这个属性可以控制子元素的排列方向和排列顺序

侧轴是依靠 flex-wrap 和 所有子元素在主轴方向上的item-size的总和确定的，flex-wrap 可以控制子元素 在侧轴方向上的排列方式以及顺序

而关于不同种类不同情况下的 item-size 我们会在下面讨论，现在您可以简单将它理解为width[height]

![img](/assets/img/flexbox1.png)

*盗规范中的一张图*

为了方便 flex-direction + flex-wrap 合并成了一个属性 `flex-flow`

通过这个简单而复杂的属性，我们就能够控制所有子元素的水平和垂直方向，逆序排列和顺序，换行和不换行。

主侧轴的切换十分简单，当主轴设定的时候，它的垂直面，就默认被设定成了侧轴

如：

```css
flex-flow: row-reverse wrap-reverse;
```

这条css 属性能够告诉我们那些信息？

1. 子元素是横着排列的，主轴是水平的横轴，侧轴是竖直的纵轴
2. 子元素是逆序并沿着主轴排列的，从右到左
3. 子元素是换行的
4. 子元素是逆序并沿着侧轴排列的，从下到上

## FFC (flex formatting context)

flexbox 布局新定义了格式化上下文，类似 BFC（block formatting context）

有多类似呢？ 就是`除了布局和一些细节不同以外的一切规则都和 BFC 是相同的`

(注意. 我所指的flexbox 是指设置了 display: flex; 或 display: inline-flex;的盒子
不是指单单设置了 display: flex; 的盒子)

例如，设置了 display: flex; 或 display: inline-flex 的元素，和BFC一样，不会被浮动的元素遮盖，不会垂直外边距坍塌等等

而对于设置了 display: inline-flex 的盒子来说，我们可以类比 display: inline-box; 进行理解
即 一个被行列化后的 flexbox。它不会独占一行，但是可以设置宽和高。

### 与BFC的细微区别

但需要注意的是以下几点细节，flexbox 布局 和 block 布局是有细微区别的

1. flexbox 不支持 `::first-line` 和 `::first-letter` 这两种伪元素
2. `vertical-align` 对 flexbox 中的子元素 是没有效果的
3. `float` 和 `clear` 属性对 flexbox 中的子元素是没有效果的，也不会使子元素脱离文档流(但是对flexbox 是有效果的！)
4. 多栏布局`（column-*）` 在 flexbox 中也是失效的，就是说我们不能使用多栏布局在flexbox 排列其下的子元素（鱼和熊掌不可得兼嘛）
5. flexbox 下的子元素不会继承父级容器的宽

## flex item（flex 子元素）

css解析器会把 定义了 display: flex; 和 display: inline-flex; 的 flexbox 下的子元素外部装进一个看不见的盒子里，我们通过排列这些盒子来达到排序、布局、
伸缩的目的

规范中把这种盒子 称为 `flex item`

而子元素中包括了 标签节点 以及 文本节点。

标签节点很容易理解，需要注意的是文本节点。

默认情况下，flex 会将 `连续的文本节点` 装进 flex-item 之中，使文本可以和标签节点一起排序和定位

值得注意的是，空格也是文本节点，所以 white-space 会影响flexbox 中的布局

![img](/assets/img/flexbox3.png)

*设置了white-space: pre 的flexbox*

## flex-item-size 如何计算的

item-size（尺寸）为**主轴方向上**item的 content 再加上自身的margin 、 border 和 padding 就是这个 item 的尺寸。

在规范中 介绍了 flex-item content 的计算方式

分为以下这几种情况

### 1. flex-basis 的优先级比 width[height]: 非auto; 高

如果子元素没有内容和默认固定宽高，且设置了flex-basis。

flex-item content以flex-basis来决定，无论width[height] 设置了多少。

(可理解为 flex-basis 比 width[height]: 非auto; 的优先级高)

![img](/assets/img/flexbox17.png)

*flex-basis的优先级比width[height]高，无论width[height]设置多少，flex-item content都以flex-basis来决定*

### 2.元素存在默认宽高

如果子元素有默认固定宽高（例如input 标签）、并且设置了 flex-basis，那么它的 content以 固定宽高为下限，如果flex-basis 超过了固定宽高，那么flex-basis则成为其 content，如果flex-basis比固定宽高小，那么以固定宽高为 content。

![img](/assets/img/flexbox13.png)

*对于固定元素的尺寸设定*

### 3.元素存在 min-width[height] 或者 max-width[height]

如果flex-item 有min-width[min-height] 的限制，那么flex-item content按照 min-width 值为下限，如果 flex-basis 的值大于 min-width[min-height] 那么flex-item content以 flex-basis 计算

如果flex-basis 的值小于 min-width[min-height] 那么flex-item content以min-width[min-height] 计算

![img](/assets/img/flexbox14.png)

如果 min-width[min-height] 的值已经超出了容器的尺寸，那么即使设置了 flex-shrink css解析器也不会进行将这个item的 content shrink，而是坚持保留它的min-width[min-height]

![img](/assets/img/flexbox6.png)

*如果flexbox 设置的min-width 超出了flex container 的范围, 不会对其进行压缩*

反之，如果设置了 max-width[height] 的值，那么设置flex-basis 无法超过这个值，对于flex-grow 也仅仅只会增长到 max-width[height] 这个上限。

在下面的章节，我们会仔细讨论这种情况下，布局的计算。

### 4.width[height]: auto; 优先级等于 flex-basis。

前面提到，如果给item同时设置了width[height] 和 flex-basis的话。flex-item content以flex-basis来决定。
但是实际上默认的 width[height]: auto; 优先级是等于 flex-basis的。

css解析器对比两者的值，两者谁大取谁 作为item的基本尺寸，如果一个item没有内容，flex-item content就会以flex-basis来决定

但是如果item有了内容，且内容撑开的尺寸比flex-basis大，那么flex-item content就会以width[height]: auto; 来决定，且**无法被 shrink**。反之，如果比flex-basis小，flex-item content就会以flex-basis来决定;

![img](/assets/img/flexbox18.png)

*width: auto; 内容长度比 flex-basis 大，则 flex-item content以内容长度来决定，且无法shrink*

![img](/assets/img/flexbox19.png)

*如果 flex-basis 的长度大于文字内容长度，那么flex-item content以 flex-basis 来决定*

![img](/assets/img/flexbox23.png)

*同时设置了flex-basis: 800px; 和 width: 1px; flex-item content以 flex-basis 来决定，可以发生shrink*

![img](/assets/img/flexbox20.png)

*注意2号盒子我设置了 flex-shrink: 1; 1号盒子和3号盒子我设置了 flex-shrink: 0; 
意思就是我将所有的需要shrink的空间都压到了2号盒子上，总共的需要 shrink的空间为 0 * 600 + 1 * 20 + 0 * 100 = -20；而2号盒子只有20的空间，理应被完全shrink变为0，但是值得注意的是2号盒子并没有被完全 shrink，还保留了一个文字的距离。*

除此之外，overflow: hidden; 也会影响

![img](/assets/img/flexbox24.png)

*overflow: hidden; 把文字长度限制在了600px; 小于 flex-basis: 700px; 所以flex-item content以flex-basis来决定，可以 shrink*

## 隐藏属性对 items-size 的影响

我针对了 display: none; visibility: hidden; visibility: collapse; transform: scale; 等属性对 items 进行测试

结果如下：

1. 如果设置了 visibility: hidden; 、 visibility: collapse; 、 transform: scale; 的flex-item content 依然被算进主轴尺寸，css 解析器依然会以他们 flex-grow 、 flex-shrink 将可用空间 或者 负可用空间 分配给他们

2. 如果设置了display: none; css解析器不会对该item的空间进行计算，也不会对其grow空间

## 关于position: absolute 对item影响

position: absolute 也是适用 flexbox 中的子元素的，并且，设置了position: absolute属性的子元素，也会受到 flexbox 排列的影响。

![img](/assets/img/flexbox4.png)

*设置了absolute 的子元素重叠在了一起，但是依然会受到 align-items: center; 的影响而居中*

对于 flexbox 来说，设置了position: absolute; 并不会对其下的子元素产生任何影响。

我们重点看 flexbox 下的子元素设置了absolute 后有什么结果

根据我做的实验，我得到了如下的结论：

`flexbox 下设置了absolute的子元素的位置受3个方面的影响`

1. flexbox 流下面的 `justify-content` 和 `align-items`
2. 单个子元素的 `top`、`left`、`right`、`bottom`
3. 单个子元素的 margin

这里我们不讨论 translate 因为 translate 只是视觉上位置的改变

![img](/assets/img/flexbox5.png)

*设置了absolute 的item 不会影响布局,*

如图

其中1 2 3 4 5 号是设置了absolute的item,而 6 7 8 9号是没有设置absolute的item
flexbox 我设置了 justify-content: center; 和 align-items: center; 每一个item我都给了 margin: 20px;

1. 我们可以看到，由于absolute 的原因， 12345号的item 不会影响 6789号的排布
`结论：脱离了文档流的 item 不会影响 正常的flex 布局。`

2. 如图上 4号 item, 设置了absolute 但是没有设置 top left 这些值，位置居中偏下
`结论：如果对子元素设置了 position: absolute; 属性而没有设置 top left 这些值。子元素受 flexbox 的justify-content: center 、 align-items: center 和 margin 的影响`

3. 如图上1235 号item, 我给他们分别设置 top、left、right、bottom 等值。 5号元素设置了margin-left: 50px; 和 padding-bottom: -999999px;
结论：top、left、right、bottom 等值会覆盖 justify-content: center; 和 align-items: center; 设置的位置，使item 自由定位。margin 自始至终都会影响item的位置，而padding不会（我试过padding 设500px 的情况，padding 会影响item的大小）

4. 如果对上图 12345号item 不设置 top、left、right、bottom 等值。
对父级的 justify-content 和 align-items 设置center以外的其他值的话
    
    * 如果设置了 flex-start 所有元素不分开，定位在 主轴起点
    
    * 如果设置了 flex-start 所有元素不分开，定位在 主轴终点

    * 如果设置justify-content: space-around;效果等同于center,即所有的元素叠在一起居中，且items不会产生间隔
    
    * 如果设置了 justify-content: space-between; 效果等同于 flex-start, 且items不会分开
    
    * 如果设置了 align-items: flex-start; 所有元素不分开，定位在 侧轴起点

    * 如果设置了 align-items: flex-end; 所有元素不分开，定位在 侧轴终点
    
    * 如果设置了 align-items: stretch 、 baseline; 也是没有任何效果, items 不会跟随侧轴拉伸 或是 根据baseline 对齐

5. 如果对单个item 设置 align-self，除了 flex-start 、 flex-end 、 center 有效之外，其他都失效

通过上面一系列的测试我们可以清楚的认识到 justify-content、align-items 和 top、left、right、bottom 都是位置属性，而且 top、left、right、bottom 会覆盖justify-content和align-items的值
（以上前提是一定要设置position: absolute 不然 top、left、right、bottom 无效）

而 margin 的优先级是和 top、left、right、bottom 一样的，也就是说 margin 和 top、left、right、bottom 所设置的值会同时生效

优先级排序为： margin = justify-content 、 align-items > top、left、right、bottom

### flex-basis、flex-grow、flex-shrink 以及相应的计算

flex-basis、flex-grow、flex-shrink是FFC下特有的属性，只有父级元素设置了 display: flex; inline-flex; 才会生效，并且只针对主轴方向生效

如果 主轴是水平的，即 flex-direction: row;
那么 flex-basis、flex-grow、flex-shrink 控制的就是单个item的宽度

如果 主轴是垂直的，即 flex-direction: column;
那么 flex-basis、flex-grow、flex-shrink 控制的就是单个item的高度

而flex-grow 和 flex-shrink 是用于 主轴方向上对 （负）可用空间 进行伸缩的

这要分两种情况，换行或者不换行

### 1.如果 flex-wrap: nowrap; 即不换行。

那么所有items 都会在主轴方向上的一条线上排列，css解析器会计算 items 在主轴方向上所占的空间 相对于 flexbox 在主轴方向的所占的空间进行比较计算

如果 items 所占的空间是小于flexbox的 那么说明flexbox 还没有填满，css解析器就会计算还有多少空间没有填满，根据每一个item所设置的flex-grow 设置的值，将这些空间分配按比例分配给每一个item

![img](/assets/img/flexbox7.png)

*可用空间*

如果 items 所占的空间是大于flexbox的 那么说明flexbox 被填满了，css解析器就会计算超出了多少空间，根据每一个item所设置的flex-shrink 设置的值，将这些空间分配按比例缩小每一个item

![img](/assets/img/flexbox8.png)

*超出的空间*

那么css解析器在这种情况下是怎样计算的呢？上一章我们劳神费力理解的item-size终于派上用场了

flex-grow计算流程是：

可用空间 = 将flexbox-content - 每个item-size的总和

将每一个item所设置的 grow 全部加起来，将可用空间除以grow，得到单位分配空间

根据每一个item 设置的 grow 来算，如果一个item 的grow 为 2，那么 这个 item 在主轴上的尺寸就需要延伸 2*单位分配空间的大小

那么 每一个 item 就需要在原基础上 加上被分配的大小 就完成了grow

![img](/assets/img/flexbox11.png)

*分配前*

![img](/assets/img/flexbox12.png)

*分配后*

简单理解就是，将超出的部分，可能多，也可能少，根据 grow 来分配成 x 份，在根据每个 item 所设置的份数，将相差的部分分割给每一个item

**注意：flex-shrink 的计算流程和flex-grow的计算流程不同**

flex-shrink计算流程是：

先讲所有项目 按照 flex-shrink * item-size 的方式加起来 得到一个加权和

然后计算出 每一份 item 的  shrink比例

 shrink比例 = flex-shrink * item-size / 之前的总和;

然后计算 子元素超出父级的部分（负可用空间），每一个item 减去这个  shrink比例 * 负可用空间即可

![img](/assets/img/flexbox15.png)

*shrink前* 

![img](/assets/img/flexbox16.png)

*shrink后* 

### 2. 如果flex-wrap: wrap[wrap-reverse]; 即换行

那么items 都会先在主轴方向上的多条线上排列，css解析器先会计算 每一条线 在主轴方向上尺寸 相对于 flexbox 容器的width[height]进行比较计算，每条线之间互不干扰

![img](/assets/img/flexbox9.png)

*未分配之前*

![img](/assets/img/flexbox10.png)

*平均分配后*

由于在一行内 如果item-size 累加超过了flexbox 的尺寸就会另起一行进行排列，所以在这种情况下，不会存在 shrink 的情况，而只有 grow 的情况

## max-width[height] 情况下 flex-grow 的计算流程

由于可能存在某一个或多个item 设置了有max-width[height]

所以，css引擎会先进行一次分配，分配后，统计那些有max-width[height]的items, 分配后是否有超出的剩余空间，然后对这些剩余空间再分配给那些没有设置max-width[height]的item

![img](/assets/img/flexbox21.png)

*再分配流程*

## min-width[height] 情况下 flex-shrink 的计算流程

由于可能存在某一个或多个item 设置了有min-width[height]

所以，css引擎会先进行一次 shrink， shrink后，统计那些有min-width[height]的items,  shrink后是否有的剩余的未 shrink空间，然后对这些剩余空间再分配给那些没有设置min-width[height]的item

注意：第一次 shrink的算法和第二次分配未 shrink剩余空间的算法不同！

![img](/assets/img/flexbox22.png)

## 总结

flexbox 布局很棒。免去了我们大量关于适配方面的工作，但是深入理解，并用好它还是需要一点门槛的。
再次感谢 @大漠老师 的鼎力帮助，谢谢。

## 感谢

[w3c Candidate Recommendation](https://www.w3.org/TR/css-flexbox-1/)

[理解Flexbox：你需要知道的一切](http://www.w3cplus.com/css3/understanding-flexbox-everything-you-need-to-know.html)

[探索Flexbox](http://www.w3cplus.com/css3/flexbox-adventures.html)

[w3cplus](http://www.w3cplus.com/)

[深入CSS ::first-letter伪元素及其实例等](http://www.zhangxinxu.com/wordpress/2016/09/css-first-letter-pseudo-element/)
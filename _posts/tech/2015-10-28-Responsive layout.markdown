---
layout: post
title: 响应式布局
category: 技术
keywords: 技术,响应式布局
---

## 响应式布局

随着移动端的大热,一张网页需要如果不支持移动端,或者页面是pc级的宽高,那么用户体验就会大打折扣.
而一张页面所展示的东西绝大多数都是由Css来实现的,所以我们需要在Css中写上一些判定条件,比如一个导航条,在pc端的时候是900px,如果到了手机端可能就变成了500px。有了这些判定条件,我们就可以随着用户终端的变化来响应不同的Css语句

实现响应式布局有两种方法

① 写几一套不同终端的Css,然后再一个总的Css中添加判定语句,如果是移动端就用a.css 是pc端就用b.css 是平板的就用c.css

② 不同终端的不同的样式写在同一张样式表中,这样可能会使得Css很复杂,而且代码累赘,导致加载速度慢。但是控制的很精确

响应式布局还有一个麻烦的缺点,那就是当你需要增添一个新功能的时候,需要从新修改多套不同的代码

无论使用那种方式实现,我们都需要依靠Css3 给我们提供了media query来查询当前用户使用的终端信息

media query能用来查询哪些值呢？

① 设备的宽和高device-width，device-heigth显示屏幕/触觉设备。

② 渲染窗口的宽和高width，heigth显示屏幕/触觉设备。

③ 设备的手持方向,横向还是竖向orientation(portrait or lanscape)和打印机等。

④ 画面比例aspect-ratio点阵打印机等。

⑤ 设备比例device-aspect-ratio-点阵打印机等。

⑥ 对象颜色或颜色列表color，color-index显示屏幕。

⑦ 设备的分辨率resolution。

media 又能识别哪些设备呢？
首先,我们必须要要明白一点不只有电脑可以看网页的,有很多终端设备可能需要读取网页,只是比较小众

在media query中,想要识别设备就需要添加所识别设备的类型名,包括

all :所有设备
braille :盲人用点字法触觉回馈设备
embossed :盲文打印机(打印盲文网页)
handheld :手持便携设备
print :文档打印用纸或打印预览图模式
projection :各种投影仪设备
screen :彩色显示屏幕(电脑、平板、手机屏幕)
speech :语音和音频混合设备
tty :固定字母间距的网格媒体,如电传打字机
tv :电视机设备

所支持的设备很多,但是真正需要用到的,基本就一个screen

### 基本语法

我们可以使用两种方法进行媒体查询

① 在html中使用link进行查询并导入相应的样式表

```html
<link rel="stylesheet" type="text/css" href="xxx.css" media="screen and (min-width:800px)" >
```

② 在css中使用@import进行查询并导入相应的样式表

```css
@media screen and (min-width:800px){
	@import url("xxx.css");
}
```

其中多数还是使用link标签引入为好

### media query的一些语法

首先明确一点,media query(英:查询)作用就一点,就是用来判断当前用户使用的是何种设备
所以我们学习media query可以类比if语句

only 后面加终端类型名(可省略),不支持media query查询但是能读取媒体类型的终端自动忽略这个样式文件,但是如果能读取Media query的终端则会自动忽略only这个关键字

not 取反(等同于!) 选取当不满足后面条件的所有终端

and 逻辑与(等同于&) 多个条件连接

max- 最大不超过(即使等同于<)

min- 最小不低于(即使等同与>)

width 浏览器宽度

height 浏览器高度

device-width 设备宽度

device-height 设备高度

orientation 移动设备浏览器的窗口方向 可选的值有两 :portrait(竖屏) 和 landscape(横屏)

aspect-radio 移动设备浏览器纵横比例 只能填比例值 16:9

decvice-aspect-radio
还有一些不常用的也不赘余了

### 使用需要注意的几点

① 判定条件需要使用()括起

② css中的1px并不等于设备的1px  

1px,在不同的终端中表现的实际长度是不一定,决定1像素实际宽高的是Led点阵个数和设定的分辨率
如果当分辨率相同的情况下,电脑的led点阵个数肯定和移动端不同,所以1px的实际长度就不一样

还有一种情况是当我们缩放浏览器的时候也会引起像素的实际大小变化(这个条件暂时忽略)

所以我们在设计响应式布局的时候,需要使用相对单位或者百分比来布局

③ 使用流动布局

因为响应式布局常会涉及到浏览器窗口大小的改变,所以布局的各个元素应该使用流动布局

所谓流动布局即为每个元素都浮动起来,这样当窗口大小改变的时候,万一用户的终端实在太小,那么浮动的元素会自动换行,这样就避免了水平滚动条的出现

④ 图片等比缩放

让图片等比例随着浏览器缩放,不要规定图片的宽高,还有不要使用背景图代替img标签,因为背景不会随浏览器等比例缩放

⑤ 需要在页面头部加上viewport

viewport是用来控制视窗口宽度的大小的属性,可以用来规范移动端或其他设备的宽度值

使用元标签添加

```css
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

也可以在css中添加,但可能会存在兼容问题,需要添加恶心的浏览器内核前缀

```css
@viewport{
	width: device-width;
    initial-scale: 1.0;
}

可能写成
@-webkit-viewport{
	width: device-width;
    initial-scale: 1.0;}
```

viewport设置属性如下：
width：可设定数值，或者指定为 device-width
height：可设定数值，或者指定為 device-height
initial-scale：第一次进入页面的初始比例
minimum-scale：允许缩小最小比例
maximum-scale：允许放大最大比例
user-scalable：允许使用者缩放，1 or 0 (yes or no)

## Summery

响应式布局是一个网站提高用户体验的很重要的一环,说白了就是对不同终端用不同的css

各大浏览器厂商都提供了响应式布局开发插件,这里本人使用的是火狐下的开发者工具

## 感谢

[TAT.sheran 关于自适应设计与响应式网页设计](http://www.alloyteam.com/2015/04/zi-shi-ying-she-ji-yu-xiang-ying-shi-wang-ye-she-ji-qian-tan/)

[media query 语法总结](http://blog.chinaunix.net/uid-13164110-id-3226993.html)

[详解viewport](http://www.cnblogs.com/2050/p/3877280.html)
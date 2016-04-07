---
layout: post
title: 关于onmouseover 和 onmouseout的冒泡问题
category: 技术
keywords: 技术
---

## 冒泡问题

我们可以先看一个栗子

[demo](/assets/download/onmouseover-onmouseout-bubble-problem.html)

首先我只给父级设置了移出事件

```javascript
oDiv1.onmouseout = function(ev) {
	console.log("鼠标从父级出去了");		

}
```

也只给子级设置了移入事件

```javascript
oDiv2.onmouseover = function(ev) {
	console.log("鼠标进来了子级");
}
```

当我进入父级的时候没有触发任何事件，但当我进入子级的时候会调用
父级的移出函数（mouseout）和子级的移入函数（mouseover）
![shootpic](/assets/img/onmouseover-onmouseout-bubble-problem1.png)


然后从子级移出的时候，又因为冒泡机制执行了父级移出函数
![shootpic](/assets/img/onmouseover-onmouseout-bubble-problem2.png)

这样问题就有两个

① 鼠标移入子级时候，浏览器会认为鼠标已经从父级中出去了，但是实际上是子级是被父级包含的,如果父级绑定了某个移入函数，那么当鼠标移进子级的时候，该函数就会失效

② 当鼠标从子级移出的时候，因为冒泡机制，会也会执行父级的移出函数

那么怎么解决呢？

## onmouseenter 和 onmouseleave

我们可以使用这两个事件来替代over 和 out事件
效果一样，但是这两个函数会认为当移入子级的时候同时也是移入了父级，就不会取消父级的移入事件

其次enter 和 leave不支持冒泡 这样第二个问题也迎刃而解

关于这两个事件的兼容性

原来是IE特有的事件，现在一些标准浏览器也支持了

分别是

chrome 30.0+ 

IE 5.5+

firefox Yes

safiri 6.1+

opera 11.5+

应该大致上都能兼容

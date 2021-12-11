---
layout: post
title: 鼠标滚动结合视差滚动
category: 技术
keywords: 技术,mousewheel,视差滚动,滚轮滚动
---

## 鼠标滚动事件

### onmousewheel 和 DOMmouseScroll

除IE6没有滚轮监听事件以外。

从IE7到各种标准浏览器,都支持onmousewheel事件

```javascript

var oBody = document.getElementsByTagName("body")[0];

oBody.onmousewheel = function()
{
	console.log("鼠标滚动了");
}

```

但是火狐底下却不支持onmousewheel事件,他底下有另外一个DOMMouseScroll的事件代替
而且DOMMouseScroll事件只能使用addEventListener来监听

```javascript

var oBody = document.getElementsByTagName("body")[0];

oBody.addEventListener("DOMMouseScroll" , function(){
	console.log("火狐浏览器下,鼠标滚动了");
});
```

那么这样我们就可以试着这么写来兼容所有的浏览器(除了IE6)

```javascript

var oBody = document.getElementsByTagName("body")[0];

oBody.onmousewheel = function()
{
	console.log("鼠标滚动啦");
}

oBody.addEventListener("DOMMouseScroll" , function(){
	console.log("火狐浏览器下,鼠标滚动了");
});
```

按理说应该是可以了,但是运行一下发现。IE7以下会报错误
原来,IE7以下是不支持addEventListener事件监听的,所有会报错,影响其他的代码运行

那么我们就需要做一些判断,当浏览器支持addEventListener事件的时候,才运行监听

```javascript

var oBody = document.getElementsByTagName("body")[0];

oBody.onmouseWheel = function()
{
	console.log("鼠标滚动啦");
}
if(oBody.addEventListener)
{
	oBody.addEventListener("DOMMouseScroll" , function(){
		console.log("火狐浏览器下,鼠标滚动了");
	});
}

```

这样就能完美兼容所有浏览器了,当然其他标准浏览器也会运行addEventListener事件,但是添加一个不存在的事件不会报错

添加完滚轮事件后,我们就需要知道客户滚动页面的方向(网上滚动还是往下滚动)

这里我们就需要使用事件返回的事件对象来获取了,当然这里也存在兼容问题

IE7+及其他标准浏览器支持event.wheelDelta 这个属性
一次向上滚动返回一次+120 | 一次向下滚动返回一次-120

而火狐支持event.detail这个属性
一次向上滚动返回一次-3 | 一次向下滚动返回一次+3

这里兼容的重点不是返回的数值或者是正负,我们主要是想要知道用户滚动的方向

所以我们可以这样来写

```javascript

// 用一个变量来表示方向,向上滚动赋值true 向下滚动则是false

var ev = ev || window.event;
var Direction;  

if(ev.wheelDelta)
{
	Direction = ev.wheelDelta > 0 ? true : false;	
}else if(ev.detail)
{
	Direction = ev.detail < 0 ? true : false;
}

return Direction;

```


那么我们现在关于滚动事件的浏览器的兼容问题都已经解决,但是实际运用中又会遇到滚轮的默认行为

说白了就是,如果需要添加子级的滚动事件,父级又有一个滚动条,这时候用户滚动滚轮就有默认优先触发滚动条事件,即使他的鼠标位于子级内

这样有两中方法可以解决,如果父级的滚动条影响不大,可以使用overflow:hidden来取消滚动条

要是需要同时存在,就需要使用阻止默认事件

如果是onmouseWheel 就使用return false进行阻止
如果是事件监听方法addEventListener那么就使用,ev.preventdefault()方向进行阻止

## 视差滚动设计

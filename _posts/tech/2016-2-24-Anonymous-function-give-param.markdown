---
layout: post
title: 当匿名函数作为函数参数的时候,进行传参
category: 技术
keywords: 技术,nodejs
---

## 缘由

做一个ife的模糊查询，快给我写跪了(把需求想复杂了哈哈，所以就累点呗)

## 重点

其中遇到了一个问题，就是当你们函数作为函数参数的时候，想将传递参数进去，但是发现无从下手

后来还是解决了这个小问题


```javascript
function c( func , self ){
	func.call(self);
}

function a () {
	this.data = "777777";
	this.b();
}

a.prototype = {
	constructor: a,
	b: function () {

		c(function (){
			// In Anonymous function  "this" pointer the window
			// but the Anonymous function is a param
			// so I want to know how make the this to pointer the a
			console.log( this.data ); // I want the "this" pointer a 
		},this);
	}
}
new a();
```

这里我的目的是把构造器中的this传入c函数的匿名函数中，使其指向a

解决方案就是要在c函数调用的时候，将this传入，然后再c函数中使用call T_T

原理本来很简单，但是在原型中就想多了，弄了一会才想出来

## 第二种方法，使用bind

很方便的东西，使用bind我们就可以随便的在匿名函数中更改this绑定，以及随意的传入参数

栗子：

```javascript
addEventListener( "click" , function(){
	console.log( arguments ) // param1 .... and default params
	console.log(this); 		 // you set pointer not window
}.bind( "which You need pointer" , "param1" , "param2" .... ) , false);
```


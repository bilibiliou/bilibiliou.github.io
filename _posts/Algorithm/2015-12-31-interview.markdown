---
layout: post
title: 关于一些前端面试题
category: 算法
keywords: 算法,前端面试题
---

## 理解对象的底层函数

题:

{% highlight Javascript %}
var a={};
var b = {"key" : 1};
var c = {"key" : 2};

a[b] = 123;
a[c] = 456;

console.log(a);
{% highlightend %}


答:
{% highlight Javascript %}

var a={};
var b = {"key" : 1};
var c = {"key" : 2};
// a b c 分别是三个对象的引用 

// 当以对象为字面量进行对象的赋值时候
// 会自动将对象调用toString方法变成 [Object object]
a[b] = 123;

// 也就是说当对a[b] 进行赋值的时候
// 自动给a对象内添加了一个字面量 字面量的值是[Object object]
// 这时候 这个字面量的值是123
a[c] = 456;
// c 也是一个对象的引用，也会调用toString方法变成[Object object] 
// 所以这时候不会在创建新的字面量，而是直接覆盖掉原先的123
console.log(JSON.stringify(a));
console.log(String(b));
console.log(a)

{% highlightend %}

## 理解Timer类callback机制

题：
{% highlight Javascript %}
console.log(1);
setTimeout(function(){console.log(2)},0);
console.log(3);
{% highlightend %}

答:

结果是 1 3 2 

`setTimeout` 和 `setInterval` 都存在执行时间(0<t<10 ms)，并且进程非堵塞
所以`setTimeout`会等这么几毫秒的时间然后再执行回调函数，这样就会先执行完console.log(3);之后再执行console.log(2);


## 理解ecmascript预解析机制

ecmascript 会对变量和函数进行预解析,但是有所不同的是，对变量是单纯进行解析，而函数则会将预解析引用变量及其函数体

题:
{% highlight Javascript %}
function b() {
	var a = 2;
}

console.log(a);

var a = 1;

console.log(a);
{% highlightend %}

答: undefined , 1

首先对b进行预解析，并对b的函数体进行解析，b的函数体中有`var a = 2` 于是对a先进行预解析,但不进行赋值，所以第一个console.log打印的是undefined , 然后对a进行了赋值，打印1

## 理解argument原理

argument是函数参数引用的集合,访问argument类数组可以读写参数引用对应内存中的值

题:
{% highlight Javascript %}
function b(x, y, a) {
    arguments[2] = 10;
    console.log(a);
}
b(1, 2, 3); // 10
{% highlightend %}

答:

a一开始赋值了3，通过arguments[2] 访问并修改了a对应内存中的值（变成了10）
也就是说a 和 arguments[2] 都是存储内存的索引
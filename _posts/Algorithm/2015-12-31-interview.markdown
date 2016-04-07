---
layout: post
title: 关于一些前端面试题
category: 算法
keywords: 算法,前端面试题
---

## 理解对象的底层函数

题:


```javascript
var a={};
var b = {"key" : 1};
var c = {"key" : 2};

a[b] = 123;
a[c] = 456;

console.log(a);
```


答:

```javascript

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
console.log(a);

```

## 理解Timer类callback机制

题：

```javascript
console.log(1);
setTimeout(function(){console.log(2)},0);
console.log(3);
```

答:

结果是 1 3 2 

`setTimeout` 和 `setInterval` 都存在执行时间(0<t<10 ms)，并且进程非堵塞
所以`setTimeout`会等这么几毫秒的时间然后再执行回调函数，这样就会先执行完console.log(3);之后再执行console.log(2);


## 理解ecmascript预解析机制

ecmascript 会对变量和函数进行预解析,但是有所不同的是，对变量是单纯进行解析，而函数则会将预解析引用变量及其函数体

题:

```javascript
function b() {
	var a = 2;
}

console.log(a);

var a = 1;

console.log(a);
```

答: undefined , 1

首先对b进行预解析，并对b的函数体进行解析，b的函数体中有`var a = 2` 于是对a先进行预解析,但不进行赋值，所以第一个console.log打印的是undefined , 然后对a进行了赋值，打印1

## 理解argument原理

argument是函数参数引用的集合,访问argument类数组可以读写参数引用对应内存中的值

题:

```javascript
function b(x, y, a) {
    arguments[2] = 10;
    console.log(a);
}
b(1, 2, 3); // 10
```

答:

a一开始赋值了3，通过arguments[2] 访问并修改了a对应内存中的值（变成了10）
也就是说a 和 arguments[2] 都是存储内存的索引

## call 和 apply方法的区别 和 继承

首先说明call方法和 apply的区别，
两者都是用于扩展函数的生存域的方法，第一个函数都是改变函数执行过程中的内部this的指向
（如果设置null则不改变指向，即依旧是原来的this指向）
而唯一区别就是在第二个参数开始，传参的形式不同。

call方法是通过多个参数进行传递的，即参数列表进行传递

```javascript
func.call(func1,var1,var2,var3)
```

apply方法是通过传递一个JSON 或者 一个数组来实现函数传递的，且参数规定只能有两个

```javascript
func.apply(func1,[{"name" : "var1"} , {"age" : "19"} , {"sex" : "男"}]);
```

当我们需要实现继承的时候，可以这样写

```javascript
	function Animal(name){    
	    this.name = name;    
	    this.showName = function(){    
	        alert(this.name);    
	    }    
	}    
	    
	function Cat(name){  
	    Animal.apply(this, [name]);
	    //Animal.call(this, name);  
	}    
	    
	var cat = new Cat("Black Cat");   
	cat.showName();
	console.log(cat);
```

来看看下一个实例

```javascript
function Person(name,age){      
        this.name = name;        
        this.age = age;   
        this.sayhello = function() {
        	console.log(this.name)
        };  
    } 

function Print(){            // 显示类的属性   
    this.funcName="Print";   // 这里一定要有this，即实例的属性
    this.show=function(){  
        var msg=[];  
        for(var key in this){  
            if(typeof(this[key])!="function"){  
                msg.push([key,":",this[key]].join(""));  
            }  
        }  
        console.log(msg.join(" "));  
    };  
}

function Student(name,age,grade,school){    //学生类   
    Person.apply(this,arguments);           //比call优越的地方   
    Print.apply(this,arguments);  
    this.grade=grade;                       //年级   
    this.school=school;                     //学校   
}

var p1 = new Person("Zyz",20);  
p1.sayhello();  

var s1 = new Student("owen",19,95,"黑龙江大学");  
s1.show();  

s1.sayhello();  
console.log(s1.funcName);
```
这个实例很直接的实现了一次继承，我们可以认为`apply`起到的是一个接口的作用，可以将子级和父级相连接

仔细想想，既然call 和 apply 的基本作用是一样的，那为什么还有设置两个呢？
实际上apply还有一些其他的妙用，重点突出在它的第二个参数上
他可以让第二个参数的数组对象，变成一个个参数传入函数中

例如push 方法
如果我们需要将两函数合并，如果使用`contact`方法，但是contact方法会产生新数组，如果
使用`push`方法，但是直接push的话传递进去的会是一个整个数组，访问也必须按照二维数组的形式进行访问


```javascript
//使用contact方法
var a = [1 , 2 , 3 , 4];
var b = [5 , 6 , 7 , 8];

var k = a.contact(b);// [1 , 2 , 3 , 4 , 5 , 6 , 7 , 8] 但是需要新声明一个变量k
```



```javascript
// 简单的时候push方法
var a = [1 , 2 , 3 , 4];
var b = [5 , 6 , 7 , 8];

a.push(b);
console.log(a);// [ 1 , 2 , 3 , 4 , [5 , 6 , 7 , 8] ]
```

这两种方法肯定都是不方便我们遍历数组的，解决这个问题，我们可以使用apply

apply 重点就是`可以把第二个参数的数组转变成一个个参数传递进来`


```javascript
var a = [5,6,7,8];

var b = [1,2,3,4];

b.push.apply(b , a);
console.log(b);
```

但是这里一定要注意一个问题，就是第一个参数一定不能为null 或者 undefined，最好设置为被插入的数组的引用

还有一个就是max和min函数
max和min函数接收参数的方式是

```javascript
var max = Math.max(var1 , var2 , var3 , var 4);
```

但是不支持这样接收参数,也就是不能接收数组

```javascript
var max = Math.max([var1 , var2 , var3 , var 4]);
```


如果我们需要找到一个数组中的最大值和最小值的时候，就很不方便了

解决方法还是可以apply

```javascript
var max = Math.max.apply(max , [var1 , var2 , var3 , var4]);
```

这样就可以直接对max(min)函数引用数组中的内容了

## 闭包模拟块级作用域

为什么要强调这个呢？

我们先来看个栗子


```javascript
var a = "owen";
(function() {
    console.log("a:" + a);  // 这是多少呢？
    var a = "zyz";
})();
```

我们来看看结果吧:

![shootpic](/assets/img/block-scoping.png)

为什么会是`undefined`呢?

原因就是闭包中也声明了一个a

实际上，上文的代码等效于这样写


```javascript
var a = "owen";
(function() {
    var a;  // 此a 非彼a
    console.log("a:" + a); 
    a = "zyz";
})();
```

所以，就会被打印出`undefined`

当我们认识到了这一点，我们就知道，闭包是可以拿来模拟一个块级作用域，这样块级直接的变量就不会出现污染了（但是注意，如果没有在闭包中声明变量a 闭包中还是会根据作用域链访问全局的a变量）


```javascript
var a = 1;

(function() {
    var a = 2;      // 这是一个私有变量了
    console.log(a); // 2
})();

console.log(a) // 1

#####################

var a = 1;

(function() {
    console.log(a); // 1 如果没有声明这个私有变量，访问的还会是全局的变量a
})();

```

## 如何判断对象类型

直接上代码了

```javascript
function ObjectTest (obj) {
    var objType = Object.prototype.toString.call(obj);
    var result = "";
    switch(objType) {
        case "[object Array]": console.log("This is Array");
            break;
        case "[object Function]": console.log("This is Function");
            break;
        case "[object Object]": console.log("This is Object");
            break;
        case "[object String]": console.log("This is String");
            break;
        case "[object Number]": console.log("This is Number");
            break;
        case "[object RegExp]": console.log("This is RegExp");
            break;
        default: console.log(objType);
    }
}
```

## 仿 document.querySelector

直接上代码了
百度春季班题目


```javascript
function $(selector) {
    var aS = selector.split(" ");
    if( aS.length === 1 ) {
        return mainfn(selector);
    }else {
        var k = mainfn(aS[0]);
        for( var i = 1 ; i < aS.length ; i++ ) {
            k = mainfn(aS[i] , k);
        }
        return k
    }

    function mainfn (selector , parent) {
        parent = parent || document;
        var result = null;
        switch(selector.substring(0,1)) {
            case "#":
                selector = selector.substring(1);
                return result = findById( selector , parent );
            case ".":
                selector = selector.substring(1);
                return result = findByClass( selector , parent );
            case "[":
                selector = selector.substring(1,selector.length-1);
                if(selector.indexOf("=") === -1) {
                    return result = findByAttrName( selector , parent );
                }else {
                    return result = findByAttrValue( selector , parent );
                }
            default :
                return result = findByTagName( selector , parent );
        }
    }

    function findByTagName ( tagName , parent ) {
        return parent.getElementsByTagName(tagName)[0];
    }

    function findById ( targetId , parent ) {
        return parent.getElementById( targetId );
    }

    function findByClass ( targetClass , parent ) {
        var o = parent.getElementsByTagName("*");
        for(var i = 0 ; i<o.length; i++) {
            var aclass = o[i].className.split(" ");
            for(var j = 0 ; j < aclass.length ; j++){
                if( aclass[j] ===  targetClass) {
                    return o[i];
                }
            }
        }
    }

    function findByAttrName ( targetAttr , parent ) {
        var o = parent.getElementsByTagName("*");
        for(var i = 0 ;i<o.length;i++) {
            if (o[i].attributes.length === 0){continue;}
            for(var j  = 0 ; j<o[i].attributes.length ; j++) {
                if( o[i].attributes[j].name ===  targetAttr) {
                    return o[i];
                }
            }
        }
    }

    function findByAttrValue ( targetAttr , parent ) {
        var o = parent.getElementsByTagName("*");
        var AttrName = targetAttr.split("=");
        for(var i = 0 ;i<o.length;i++) {
            if (o[i].attributes.length === 0){continue;}
            for(var j  = 0 ; j<o[i].attributes.length ; j++) {
                if( o[i].attributes[j].name === AttrName[0] && o[i].attributes[j].value === AttrName[1] ) {
                    return o[i];
                }
            }
        }
    }
}
```

## 感谢

[JavaScript中call()与apply()有什么区别？](http://my.oschina.net/warmcafe/blog/74973)

[Javascript中变量提升](http://www.cnblogs.com/damonlan/archive/2012/07/01/2553425.html)










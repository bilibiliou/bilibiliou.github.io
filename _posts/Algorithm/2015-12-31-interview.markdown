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

## 取出数字

一道腾讯的笔试题目吧，要求从随机混乱的字符中，取出所有的数字 ， 且`不允许使用正则`

实现：

```javascript
var s = "sdaddf444sfsfdsf8485sdfsdfds￥d#我1526dfdsfdsfds我2%fsdf58";
    
    var flag = -1;
    var boff = true;
    var r = "";
    var t = "";
    var result = [];
    Array.prototype.forEach.call( s , function ( value , idx , array ) {
        if ( value > "0" && value < "9" ) {
            if ( boff ) {
                boff = false;
                flag = idx;
            }

            r += value;
        } else {
            boff = true;
            flag = -1;
        }

        if ( flag === -1 && r !== "" || idx === array.length - 1 ) {
            t = r;
            r = "";
            result.push(t)
        }
    });

    console.log(result)

}   
```

## 数组去重

如果有一个这么麻烦的数组，你会如何将其去重呢？

```javascript
var arr = [1,1,2,2,"Owen","Owen",true,false,undefined,NaN,NaN,{a:1},{a:1},{a:3},[1,2,3],[4,5,6],new RegExp("^asd$"),new RegExp("^asd$"),function sss() {},function sss() {}];
```

### 方法一

```javascript
Array.prototype.unique = function () {
    var mapObj = {};
    var newArr = [];
    for(var i = 0,temp,type; i<this.length; i++) {
        temp = this[i];
        type = Object.prototype.toString.call(temp);
        if (type === "[object Object]") {
            // 对象类型需要特殊处理
            temp = JSON.stringify(temp);
        }

        if (!mapObj[temp]) {
            mapObj[temp] = true;

            if(type === "[object Object]") {
                newArr.push(JSON.parse(temp))
            } else {
                newArr.push(temp);
            }
        }   
    }
    return newArr;
}
```

对进行了特殊处理，由此可以去除重复的对象

### 方法二

我们可以利用Es6 Set对象 进行去重

```javascript
Array.prototype.unique = function () {
    return [...new Set(this)]
}
```

简单到只有一句话...

但是这种方法是无法去除重复的对象

如果不想处理重复的数据，就将重复数据使用Set类型存储，但是还是会有遗漏，因为Set类型，对于两个成员全部相同的对象，会认为是两个不同的对象

## 尾递归

我们先使用普通递归方法来实现 Fibonacci

```javascript
function Fibonacci (n) {
    if ( n <= 1 ) {return 1};

    return Fibonacci( n - 1 ) + Fibonacci( n - 2 );
}

console.log(Fibonacci(10));
// console.log(Fibonacci(100)) // 浏览器挂了

```

可以发现上面的代码并不理想

为什么呢，因为 

```javascript
    return Fibonacci( n - 1 ) + Fibonacci( n - 2 );
```

return 的优先级是比双目运算符（+-*/） 要大的

也就是说，函数会先return  之后才进行两个函数返回值的计算

而要计算就需要在内存中（函数调用栈中）保存上一个函数的变量和值。

这样的结果就会导致在不断的递归中将函数调用栈堆满，导致内存溢出

那么如果我们把 计算的步骤在函数中完成后再 return 

那么函数调用栈就不会无限的被填充

```javascript
function Fibonacci2 (n , ac1 = 1 , ac2 = 1) {
    if( n <= 1 ) {return ac1};

    return Fibonacci2 (n-1 , ac2 , ac1 + ac2); 
    // 会先计算参数里面的双目运算符，再return 形成尾递归
}


console.log(Fibonacci2(100)) // 354224848179262000000
console.log(Fibonacci2(1000)) // 4.346655768693743e+208
console.log(Fibonacci2(10000)) // Infinity
```

复杂度达到了O(1)

完整的算法如下


```javascript
let str = "";
let t = 0;
function fibonacci(n, ac = 1 , ac2 = 1) {
    t += ac2;
    if(n<=1) {
        str += `${ac2} = ${t}`
        return ac2;
    }
    str += `${ac2} + `;
    return  f(n - 1, ac2, ac2 = ac + ac2);
}

console.log(f(10));
console.log(str);

```


## 如何使对象接入Symbol.iterator

我们知道 能使用 Symbol.iterator 接口 提供的便利的对象类型 只有这么三种

① 数组 <br>

② 类数组 （Domlist 、 字符串...） <br>

③ Map 和 Set 等新的数据结构类型 及其 weak 衍生类型

普通的对象 是默认不自带 Symbol.iterator 的，因为 Es6 标准并无法确定对象成员遍历先后顺序

所以我们需要自己动手给对象建立Symbol.iterator 接口

```javascript
Object.prototype.setIterator = function() {
    this.__proto__[Symbol.iterator] = function *() {
        for(let i in this) {
            yield this[i]
        }
    }
}
```

我们可以在对象的__proto__ 中添加一个遍历接口

```javascript
let obj = {
    a : 1,
    b : 2,
    c : x => x + 10,
    d : {},
    f : [],
    g : /^(\s|\u00A0)+ | (\s|\u00A00)$/
}

obj.setIterator();

// 扩展运算符
console.log([...obj]);

// for...of遍历
for(let i of obj) {
    console.log(i);
}

let [x,y,z] = obj; 
// 没有给obj 添加遍历接口前是无法进行解构赋值的
```

## es 赋值的几种方法

赋值的几种方法：


```javascript
① let a = 1, b = 2, arr = [];
```

```javascript
② let a = 1;
   let b = 2;
   let arr = [];
```

```javascript
③ let [a,b,arr] = [1,2,[]];
```

```javascript
④ let {key1:a,key2:b,key3:arr} = {key1:1,key2:2,key3:[]};
```

```javascript
⑤ let
 [a,b,c,d] = "Owen";

a// O
b// w
c// e
d// n
```

## 使用yield 产生一个状态机

```javascript
function createState (...args) {
    return (function * () {
        while(true) {
            for(let i of args) {
                yield i();
            } 
        }
    })();
}   

let amd = createState(function () {
    ...代码块1
},function () {
    ...代码块2
},function () {
    ...代码块3
});

amd.next();
amd.next();
amd.next();

// 分别执行代码块123

amd.next();
// 再次循环执行代码块1

```
## 事件捕获和冒泡总结

1.addEventListener 能绑定多个事件， onclick不行 <br>

2.addEventListener 支持事件流的两种机制，onclick 只支持冒泡机制，不支持捕获( false 是冒泡 true 捕获) <br>

3. 先执行的捕获，再执行的冒泡 <br>

4. 捕获是从父级传递到子级，冒泡是从子级传递到父级

## 如何优雅的获取标准时间

当前时刻 <br>

```javascript
let nowTime = new Date()
    .toTimeString()
    .match(/(\d{2})\:(\d{2})\:(\d{2})/)[0]
```

## 实现add(1)(2)(3)

法一：
```javascript
function add (v1,v2) {
    v2 = v2 || 0;

    arguments.callee.toString = function () {
        return "Anwser == "+ (v1 + v2);
    }

    return arguments.callee.bind(this,v1+v2);
}

console.log(add(1)(2)(3))
```
法二：
```js
function currying (fn, ...param) {
  return function (...newparam) {
    return fn.apply(this, newparam.concat(param))
  }
}

function add (...param) {
  var sum = param.length > 1 ? param.reduce((b ,n) => b+n): param;

  var fn = currying(add,sum);
  fn.toString = function () {
    return "Anwser === "+ (sum);
  }

  return fn;
}

console.log(add(1,2,3)(2)(3,5));
```

## 正则表达式中 match 和 exec 的区别

首先，从功能上，他们都是相同的,都是通过正则表达式，获得被匹配的部分字符串,而差别就体现在细微之处了

### 差别一

我们以一个例子来说明第一个差别

```javascript
let str = "abc123abc";
let reg = /\d{3}/;

console.log(str.match(reg));
console.log(reg.exec(str));
```

上面我们不难一下子就能看出来
> match 是字符串类型下的方法
> exec 是正则类型下的方法

### 关于返回的数组

而对于上面的例子，返回的结果都是一样的，都是一个数组

```javascript
["123", index: 3, input: "abc123abc"]
```

这个数组，有四个部分组成
> 第一部分，匹配的字符串（结果）
> 第二部分，匹配的分组 
> 第三部分，第一个匹配的子项的首字母的位置 （0开始） 
> 第四部分，被匹配的字符串（源字符串）

因为上面这个例子中我们并没有使用到分组，所以，第二部分的内容是没有出现的

### 差别二

当我们需要匹配的字符串，不止有一处呢？很显然，我们需要添加一个“g” 全局匹配

```javascript
let str = "abc123abc";
let reg = /[a-z]{3}/g;

console.log(str.match(reg));
console.log(reg.exec(str));
```

这时候我就会发现所返回的结果不同了

```javascript
["abc", "abc"]
["abc", index: 0, input: "abc123abc"]
```

上面看来，在我们我们添加了全局匹配，却没有多个分组的情况下

> match 仅仅会返回被匹配的多个字符串
> exec 则之后返回第一被匹配的字符串


### 差别三

还是一个栗子

```javascript
let str = "     Owen 喜欢 Zyz   Owen 喜欢 Zyz";
let reg = /\s(owen).+?(zyz)/ig;


console.log(str.match(reg));
console.log(reg.exec(str));
```

在这个例子中，我们添加了两个分组

然后我们来看看返回结果

```javascript
[" Owen 喜欢 Zyz", " Owen 喜欢 Zyz"]
[" Owen 喜欢 Zyz", "Owen", "Zyz", index: 4, input: "     Owen 喜欢 Zyz   Owen 喜欢 Zyz"]
```

> exec 会匹配多个子项，但是结果依然是一个
> 而match 表现和上面一样，一样是仅返回多个结果的数组


### 总结

> exec 值能匹配一个，并且有（）子项的时候，会继续匹配子项
> 
> match 分两种情况
> ① 当需要匹配多个字符串的时候（存在g全局匹配） 仅仅返回结果，不返回其他三个部分
> ② 当仅匹配单个字符串的时候，行为和exec完全一样

个人认为生产过程中，使用match比较方便

## 如何将数字转变为银行金额

```javascript
let a = 12200002.12334

function transfer(value) {
    var pointOut = value.toString().split(".")

    return pointOut[0]
            .split("")
            .reverse()
            .join("")
            .replace(/(\d{3})/g, "$1,")
            .replace(/\,$/,"")
            .split("")
            .reverse()
            .join("")

            + "." 
            + pointOut[1]
}

console.log(transfer(a))
```

## 如何将数组 或字符串逆序


### 法一

我们使用递归的方法可以实现，但是效率不高

```javascript
function reverse (seq) {
 if(Object.prototype.toString.call(seq) === "[object Number]") {
     seq += "";
 }

 return (seq.length > 1) ? 
         reverse(seq.slice(1)).concat(seq.slice(0,1))
       : seq;
}
```

### 法二

我们可以使用尾递归的方式实现，这种方式可以保证效率

```javascript
function reverse (seq) {
    var  len    = seq.length,  // 4
         temp   = Math.floor(len / 2),
         flag   = 0

    return (function rev (seq) {
        seq[len-flag-1] = seq.splice(flag,1,seq[len-flag-1])[0]
        ++flag

        return  (flag !== temp) ? rev(seq) : seq
    })(seq)
}
```

但是这种方法依赖于数组下特有的splice方法，所以对于 数字类型或者字符串类型，
使用该方法还需要先转为数组类型

### 法三

```javascript
function Reverse(list) {
    return (function rev([x, ...xs], arr) {
        return typeof x === "undefined" ? arr : rev(xs, [x].concat(arr));
    })(list, []);
}
```

该方法的思想是，递归分割数组的第一位，然后和上一次递归获得的结果拼接

## 手写JSON编译

[JSON_PARSE_PROFILL](https://github.com/bilibiliou/JSON_PARSE_PROFILL)

同学虐我几条街

```js
var text = '{"abc": {"d": "d"}, "b": ["c","x"], "e": "-123.123"}';
var errorText = '{"error": error}'
var at = 0,
    ch = next();
function value() {
    switch (ch) {
        case '{':
            return object();
            break;
        case '[':
            return array();
            break;
        case '"':
            return string();
            break;
        case '-':
            return number();
            break;
        default:
            return ch >= '0' && ch <= '9' ? number() : error();
    }
}

function error () {
    return '出了什么bug';
}

function next() {
    ch = text.charAt(at);
    at += 1;
    while (ch && ch <= ' ') {
        // 跳过空格
        next();
    }
    return ch;
}

function string() {
    var string = '';
    // 跳过双引号
    next('"');
    while (ch) {
        if (ch === '"') {
            // 跳过双引号
            next();
            return string;
        } else {
            string += ch;
        }
        next();
    }
}

function object() {
    var key = '';
    var object = {};
    // 跳过{
    next('{');
    while (ch) {
        key = string();
        // 跳过冒号
        next(':');
        object[key] = value();
        if (ch === '}') {
            // 跳过}
            next('}');
            return object;
        }
        next();
    }
}

function array() {
    var array = [];
    // 跳过[
    next('[');
    while (ch) {
        array.push(value());
        if (ch === ']') {
            // 跳过]
            next(']');
            return array;
        }
        next();
    }
}

function number() {
    var number, string = '';
    if (ch === '-') {
        string = '-';
        // 跳过-
        next('-');
    }
    while (ch >= '0' && ch <= '9') {
        string += ch;
        next();
    }
    if (ch === '.') {
        string += '.';
        // 跳过., 获取小数后的部分
        while (next() && ch >= '0' && ch <= '9') {
            string += ch;
        }
    }
    number = +string;
    return number;
}

var json = value();
console.log(json);
```

## 如图

![water](/assets/img/water.png)

解法：

```js
let arr = ;
// [2,5,1,4,6,2,7,1,-1,2] 13
// [2,5,1,4,6] 5
// [10,1,2,1,3,2,4,3,1,2,3,5,4,2,4] 30
// [2,5,1,2,3,4,2,5,1,2,3,4] 19
// [7,5,1,2] 1
// [9,9,9,9,9,9,9] 0
// [2,1,5,7] 1
// [9,5,7,-1,8,10,9,100] 18
function main (arr) {
    if (arr.length < 3) {return 0;}
    let s;
    let e;
    let stack = []
    let result=0;
    function calc () {
        s=arr[0];
        for (let i = 1;i<arr.length;i++) {
            let temp = arr[i];

            if (temp < s) {
                e = temp;
                if(i+1 !== arr.length) {
                    stack.push(temp);
                }
            } else {
                let size = stack.length;
                let area = 0;
                while(stack.length) {
                    area += stack.pop();
                }
                result += s * size - area;
                s = temp;
            }
            if (i+1 === arr.length && stack.length) {
                let size = 0;
                let area = 0;

                for(let j = stack.length - 1; j>=0; j--) {
                    let k = stack[j];
                    if (k<=e) {
                        area += k;
                        size++;
                        stack.pop();
                    } else {
                        break;
                    }
                }
                result += e * size - area;
            }
        }
        if (stack.length) {
            stack.unshift(s);
            console.log(result, stack)
            arr = stack;
            stack = [];
            calc();
        }    
    }
    calc();
    return result;
}

console.log(main(arr));
```
## 暴力查找最大回文字串

```js
+function main(str='boawaebnc') {
  var max = '',
      len = str.length

  for (var block = 1; block <= len - 1; block++) {
      for (var s = 0, e = s+block; e < len; s++,e++) {
        var kkk = str.slice(s, e+1);
        if (kkk === kkk.split("").reverse().join("")) {
          max = kkk;
        }
      }
  }
  console.log('<<<',max);
}()
```

## 字符串全排列

```js
let str = '1234';
function merge(sofar, rest) {
    let len = rest.length;
    if (rest.length === xlen) {
      console.log(sofar); // system.out.print(sofar);
    } else {
      for (let i = 0; i < len; i++) {
        let s = sofar + rest[i];
        let e = rest.substring(0, i) + rest.substring(i+1);
        merge(s, e);
      }
    }
}

xlen = 0;
while (xlen<4) {
    merge('', str);
    xlen++;
}
```

## js 如何判断一组数字是否连续

给定一个一维数组，要求将连续部分整合为一个数组，最终得到得到一个二维数组。
输入:var arr=[3, 4, 13 ,14, 15, 17, 20, 22];
输出:[[3,4],[13,14,15],[17],[20],[22]];

```js
var main = function (arr) {
  var result = []
  var index = 0  
  while (index < arr.length) {
    var temp = [arr[index]]
    while (true) {
      var value = arr[index]
      var valueNext = arr[index + 1]
      if (value + 1 === valueNext) {
        index++
        temp.push(valueNext)
      } else {
        break
      }
    }
    index++
    result.push(temp)
  }

  return result
}

main([3,4,13,14,15,17,20,22])
```

### 变形题

给定一个一维数组，要求将连续部分整合为一个数组，最终得到得到一个二维数组。
输入： [1,2,3,4,6,8,9,10]
输出： ["1-4", 6, "8-10"]

```js
var main = function (arr) {
  var result = []
  var index = 0  
  while (index < arr.length) {
    var temp = [arr[index]]
    while (true) {
      var value = arr[index]
      var valueNext = arr[index + 1]
      if (value + 1 === valueNext) {
        index++
        temp.push(valueNext)
      } else {
        break
      }
    }
    index++
    if (temp.length > 1) {
        var f = temp[0]
        var e = temp[temp.length - 1]
        result.push(f + '-' + e)
    } else {
      result.push(temp[0])
    }
  }

  return result
}
main([1,2,3,4,6,8,9,10])

// ["1-4", 6, "8-10"]
```

## 数组排列组合

```js
function groupSplit (arr, size) {
  var r = []; //result

  function _(t, a, n) { //tempArr, arr, num
    if (n === 0) {
      r[r.length] = t;
      return;
    }
    for (var i = 0, l = a.length - n; i <= l; i++) {
      var b = t.slice();
      b.push(a[i]);
      _(b, a.slice(i + 1), n - 1);
    }
  }
  _([], arr, size);
  return r;
}
```

## 26进制和10进制转换

### 问题描述

在Excel中，列的名称是这样一个递增序列：A、B、C、…、Z、AA、AB、AC、…、AZ、BA、BB、BC、…、BZ、CA、…、ZZ、AAA、AAB…。
我们需要将上述列名序列和以下自然数序列相互转换：1、2、3、…。

### 解决方案

```js
function main (number) {
  var arr = ['A','B','C', 'D', 'E', 'F', 'G', 'H', 'I', 'G', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  var result = []
  var unit = 1
  var pop = 0

  while (number > 0) {
    pop = number % 26
    if (pop === 0) {
      pop = 26
    }
    result.unshift( arr[pop - 1] )
    number = (number - pop) / 26
  }

  return result;
}

main(52) // AZ
```

### Object.create 到底干了啥

说白了就很简单，但是很绕

对象A

新建一个对象，把A浅拷贝一份，丢到新建的那个对象的prototype中

返回这个对象

```js
// proprttiesObject 可选参数, 和 Object.defineProperties 的入参一致
var _create = function (A, proprttiesObject) {
  var _F = new Function() // 构造一个对象
  _F.prototype = A
  if (proprttiesObject) {
    Object.defineProperties(_F, proprttiesObject)
  }
  return _F
}
```

### 关于 es6 的继承

extend 内部到底实现了那些东西呢？ 主要是下面三个函数

```js
function _classCallCheck(instance, Constructor) {
 if (!(instance instanceof Constructor)) { 
    throw new TypeError("Cannot call a class as a function"); 
  } 
}

// 保证 子类的this 指向父级
function _possibleConstructorReturn(self, call) { 
    if (!self) { 
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); //保证子类构造函数中 显式调用 super()
    } 
    return call && (typeof call === "object" || typeof call === "function") ? call : self; 
}

function _inherits(subType, superType) {
  // 创建对象，创建父类原型的一个副本
  // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  // 指定对象，将新创建的对象赋值给子类的原型
  // a && b  如果 a 为false那么返回a, 如果 a 为true 返回b
  subType.prototype = Object.create(superType && superType.prototype, {
    constructor: {
      value: subType,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

  if (superType) {
    Object.setPrototypeOf 
      ? Object.setPrototypeOf(subType, superType) 
      : subType.__proto__ = superType;
  }
}

// 假如我有 一个构造函数Men 和 一个父级 Parent
// 那么继承的方式是：

var Men = function (_Person) {
  _inherits(Men, _Person);
  // 这里首先实现继承
  // 简单来说就是将_Person的prototype, 指向Men的protoType
  function Men(name, age) {
    // 这里是一个校验机制，判断上面 _inherits 是否成功的将 Men 从属于Person（instanceof）
    _classCallCheck(this, Men);

    // 重点，由于上文已经继承了Person，那么就会 通过getPrototypeOf拿到Person， 然后调用Person.call的方法，从而实现了将Person 构造函数下变量和方法赋值给了Men
    // Men 从此已经完成了Person的prototype的继承和构造方法下变量和方法的继承
    var _this = _possibleConstructorReturn(this, (Men.__proto__ || Object.getPrototypeOf(Men)).call(this));

    _this.gender = 'male';
    return _this;
  }

  return Men
}(Person)

new Men('Owen', 'male')
```

实际上和原来的寄生组合式继承一样：

```js
function inheritPrototype(child, parent) {
  const prototype = Object.create(parent.prototype); // 创建对象，创建父类原型的副本 这里和组合式继承相比就凸显了寄生的本质
  // 组合继承是直接 new Parent, 但是寄生组合继承是 parent.prototype 只拿Parent的原型
  prototype.constructor = child; // 增强对象，弥补因重写原型而失去的默认的 constructor 属性
  child.prototype = prototype; // // 指定对象，将新创建的对象赋值给子类的原型
}

function Parent(name) {
  this.name = name;
  this.colors = ['red'];
}

Parent.prototype.getParentName = () => {
  return this.name;
}

// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// 创建一个父类副本，并将父类原型指向子类
inheritPrototype(Child, Parent);

// 增强子类的原型数据
Child.prototype.getAge = () => {
  return this.age;
}

var instance1 = new Child('owen', 23);
```

## 在js中的逻辑运算符

js中 return a && b和return a || b

|| 和 &&都遵循“短路”原理

return a && b 如果a是true的话，返回b， 如果a是false的话，返回a

return a || b 如果a是true的话，返回a，如果a是false的话，返回b 。

## 手写Promisify

```js
function promisify(fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return new Promise(function (resolve) {
      args.push(function (result) {
          resolve(result);
      });
      fn.apply(null, args);
    })
  }
}

var pro = promisify((name, callback) => {
  setTimeout(() => {
    console.log(name + ' Hello world')
  }, 200)
  callback('next')
})

pro('Owen')
  .then((data) => {
    console.log(data)
  })
```

## 浏览器页面资源加载过程和优化

https://juejin.im/post/5a4ed917f265da3e317df515

## 实现并发控制

```js
/**
 * @params list {Array} - 要迭代的数组
 * @params limit {Number} - 并发数量控制数
 * @params asyncHandle {Function} - 对`list`的每一个项的处理函数，参数为当前处理项，必须 return 一个Promise来确定是否继续进行迭代
 * @return {Promise} - 返回一个 Promise 值来确认所有数据是否迭代完成
 */
let mapLimit = (list, limit, asyncHandle) => {
  let recursion = (arr) => {
      return asyncHandle(arr.shift())
          .then(()=>{
              if (arr.length!==0) return recursion(arr)   // 数组还未迭代完，递归继续进行迭代
              else return 'finish';
          })
  };
  
  let listCopy = [].concat(list);
  let asyncList = []; // 正在进行的所有并发异步操作
  // 这里是关键，这里通过 一层while 声明了 limit 条管道
  // 管道内的异步任务执行完成后，会继续调用then 方法，继续从队列中拿 url 去请求
  // 当全部请求执行完成后，执行Promise.all 的回调，结束
  // 这样保证了请求的异步控制
  while(limit--) {
      asyncList.push( recursion(listCopy) ); 
  }
  return Promise.all(asyncList);  // 所有并发异步操作都完成后，本次并发控制迭代完成
}

// test--->
var dataLists = [1,2,3,4,5,6,7,8,9,11,100,123];
var count = 0;
mapLimit(dataLists, 3, (curItem)=>{
    return new Promise(resolve => {
        count++
        setTimeout(()=>{
            console.log(curItem, '当前并发量:', count--)
            resolve();
        }, Math.random() * 5000)  
    });
}).then(response => {
    console.log('finish', response)
})
```

用管道的概念，更好理解

```js
function request (urls, maxNumber) {
  var asyncList = []
  var urlsList = urls.slice()

  var pipe = function () {
    return new Promise(function (resolve) {
      console.log('>>>', urlsList.shift())
      resolve()
    })
      .then(() => {
        // 当一个任务执行完成后，继续从 队列中拿任务出来继续执行
        if (urlsList.length) {
          pipe()
        } else {
          console.log('has done')
        }
      })
  }

  // 创建 maxNumber 条管道
  while (maxNumber--) {
    asyncList.push( pipe() )
  }
  return Promise.all(asyncList)
}

request(['1','2','12','32','11','42','21','22','11','42','51','23','12','62'], 3)
  .then(() => {
    console.log('I am callback')
  })
```

[15 行代码实现并发控制](https://segmentfault.com/a/1190000013128649)

## 用 reduce 模拟 map

```js
Array.prototype.mmp = function (fn) {
  var key = 0
  var self = this
  this.reduce((p, n) => {
    fn && fn.call(self, n, key)
    return n
  }, this[1])
}

var arr = [1,2,3,4,5]

arr.mmp((val, key) => {
  console.log(val, key)
})
```


## 进程和线程的区别

进程是资源分配最小单位，线程是程序执行的最小单位。
进程有自己独立的地址空间,线程没有独立的地址空间,线程共享进程的地址空间
线程不能够独立执行，必须依存应用程序，进程有独立的程序入口和执行顺序
线程是处理机调度的基本单位

## CORS 跨域请求

CORS (Cross Origin Resource Sharing) 跨域资源共享，是一种请求规范，用于解决跨域同域请求的一系列问题

### CORS 跨域简单请求

CORS 简单请求只允许限定的请求方法和请求头跨域访问获取信息，响应头报文会返回数据和跨域控制（Access-Control-Allow-*） 的回参信息以及一些受控的响应头信息

当请求方法为
HEAD
GET
POST
等方法
且HTTP请求头不超出以下几种请求头字段的时候

Accept
Accept-Language
Content-Language
Last-Event-ID
Content-Type: application/x-www-form-urlencoded,multipart/form-data,text/plain

如果超出了这些字段范围的请求，就需要走复杂请求

只需要在请求头中带上
Origin的请求头，那么就能够直接跨域，
服务器会根据Origin的请求头来判断，访问源是否存在于 Access-Control-Allow-Origin 中
如果存在那么就会直接返回数据，如果不存在，就会被 XMLHttpRequest 的 onerror 函数被捕获

简单请求的响应头报文如下
Access-Control-Allow-Origin（必含）- 不可省略，否则请求按失败处理。该项控制数据的可见范围，如果希望数据对任何人都可见，可以填写"*"。

Access-Control-Allow-Credentials（可选） – 该项标志着请求当中是否包含cookies信息，只有一个可选值：true（必为小写）。如果不包含cookies，请略去该项，而不是填写false。这一项与XmlHttpRequest2对象当中的withCredentials属性应保持一致，即withCredentials为true时该项也为true；withCredentials为false时，省略该项不写。反之则导致请求失败。

Access-Control-Expose-Headers（可选） – 该项确定XmlHttpRequest2对象当中getResponseHeader()方法所能获得的额外信息。通常情况下，getResponseHeader()方法只能获得如下的响应头信息：
Cache-Control
Content-Language
Content-Type
Expires
Last-Modified
Pragma

需要注意的是，如果要发送Cookie，Access-Control-Allow-Origin就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的document.cookie也无法读取服务器域名下的Cookie。

### CORS 跨域复杂请求

复杂请求的情况下即需要先发送一个预请求，向服务端获得所允许的域、允许的请求方法、能否允许携带cookie

当请求方法为
PUT
DELETE
TARCE
CONNECT
PATCH
OPTIONS
等
或者是需要获取更多响应头、更复杂的响应内容的GET、POST、HEAD请求
那么就需要先发送个预请求OPTIONS请求，域请求会告诉服务端，我浏览器接下来需要使用那种方法请求以及服务端未来需要回复那些响应头，以及响应的数据类型
这些响应头规定了接下来的跨域请求，只能允许那些域，那些方法请求
服务端获取到这一些列的跨域控制响应头后，才决定是否允许后续的跨域请求

## 感谢

[JavaScript中call()与apply()有什么区别？](http://my.oschina.net/warmcafe/blog/74973)

[Javascript中变量提升](http://www.cnblogs.com/damonlan/archive/2012/07/01/2553425.html)

[JavaScript 五十问——从源码分析 ES6 Class 的实现机制](https://segmentfault.com/a/1190000017842257)

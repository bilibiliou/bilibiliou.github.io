---
layout: post
title: 你真的了解数组吗？
category: 技术
keywords: 技术,Es5,,Array,indexOf,some,every,filter,map,forEach,
---

## 浅谈数组

之前在写Jekyll 脚本的时候，就不得不吐槽，Jekyll 不能自己声明数组。
是啊，数组实在是太重要，

Js里我们可以使用数组模拟栈和队列，使用数组暂存，
使用数组模拟数据，

当然，简单的数组存储，使用for遍历，大家肯定都已经掌握了。

使用for或while的遍历方法无非这几种（ 还有一种Es6 新出的for...of 我们下文再介绍 ）

```javascript
var array = [1,2,3,4,5]

for(var i = array.length - 1 ; i > 0 ; i--) {
    // do something
}

for(var i = 0 ; i < array.length ; i++) {
    // do something
}

for(var i in array) {
    // do something
}

for(var i = 0 , e; e = array[i++] ; ) {
    // do something
}

// while方法省略，任何for都能转化成while写法

```

但是你对数组旗下的多种方法了解吗？

如果你的答案是否定的，让我们一起来了解一下吧

首先我们可以console.log看一下数组下面有多少种方法


```javascript
console.log(Array.prototype);
```

很多吧，当然有些我们已经了解了很多了

```javascript
push

pop

shift

unshift

slice

splice

concat

sort

reverse

indexOf (和String下的方法相似)

lastIndexOf

toString 和 toLocaleString

Array.isArray
```

还记得怎么用么？

好了如果你们都记得我们再看看这些(忘了去查Js 高级程序设计吧)


```javascript
forEach

map

fliter

some

every

reduce

reduceRight
```

有点懵了对吧

好我们再看看这些



```javascript
Array.from

Array.of

copyWithin 

includes

fill

find

findIndex

keys

entires

Symbol
```

如果看到这里你都懂，就可以直接跳了

如果半知不懂的状态或者啥都不懂的状态，come ，让我们在享受一下学习新知识的乐趣吧

## forEach、 map、 fliter、 some、 every

估计很多人都清楚forEach（不清楚也没关系，我下文会详细提到） 是循环，但是可能会和其他四个方法傻傻的分不清，因为他们实在长得是太像了

像在什么地方呢? 

① 首先语法上


```javascript
arr.function(callback[, thisArg]) // 一个任意的函数 和 环境转项 
```

② 其次是 参数传递上 都含有value , idx , array 三个参数（当然形参可以随意大家习惯咯）


```javascript
arr.function(function ( value , idx , array ) {
    
}[, thisArg])
```

caveat: jQ 的 `$.each` 的传参顺序是 idx , value , array 切记切记

③ 其次，就是这五个方法都会遍历一遍数组，每一次遍历都可以进行一次操作

那么他们有哪些不同呢？他们又各自有什么用处呢？且听小生慢慢道来~~

### forEach

我们先来看forEach
forEach 方法会传递三个参数 value , idx ,array



```javascript
[1,2,3].forEach(function( value , idx , array ) {
    console.log( value , idx , array  ) 
});

// 1 0 [1,2,3]
// 2 1 [1,2,3]
// 3 2 [1,2,3]
```

这样我们就可以通过传递过来的值做些事儿了


```javascript
// demo1
var c = 0;
[1,2,3].forEach(function( value , idx , array ) {
    c += value;
});

console.log(c); // 6

// demo2 递归遍历
var familyinfo = [{
    "name" : "甲",
    "age"  : 30,
    "child" : [{
        "name" : "甲娃1",
        "age"  : 1,
        "child" : null
    },{
        "name" : "甲娃2",
        "age"  : 2,
        "child" : null
    }]
},{
    "name" : "乙",
    "age"  : 25,
    "child" : [{
        "name" : "乙娃1",
        "age"  : 3,
        "child" : null
    }]
},{
    "name" : "丙",
    "age"  : 60,
    "child" : [{
        "name" : "丙娃1",
        "age"  : 25,
        "child" : [{
            "name" : "丙孙1",
            "age"  : 2,
            "child" : null
        }]   
    }]
}]


familyinfo.forEach( travel );

function travel (value , idx , array) {
    console.log( value.name );
    if ( value.child !== null ) {
        value.child.forEach( travel );
    }
}

// 甲
// 甲娃1
// 甲娃2
// 乙
// 乙娃1
// 丙
// 丙娃1
// 丙孙1

// demo3

var  name = ["Zyz" , "Owen" , "Luffy"];

var tools = {
    isOwen : function ( name ) {
        return /^Owen$/.test(name);
    }
}

name.forEach(function ( value , idx , array ) {
    if ( this.isOwen( value ) ) {  // 此this指向tools
        console.log( "the "+ (idx+1) +" person's name is Owen" );
    }
},tools); // 第二个参数改变了 forEach内部的this指向

```

认真看完上面三个例子，应该能掌握的差不多了吧？

在说说看 forEach的一个特点吧
forEach不允许返回值



```javascript
var list = [1,2,3];

var list2 = [];

list2.push( list.forEach(function ( value , idx , array ) {
    return value * value;  // 注意，这里是无法返回值的
}) );

console.log(list2) // undefined
```

原因大家应该能理解， 匿名函数的返回值 并没有被forEach函数返回出来

好了根据这个特点，我们再来介绍我们下一个函数map

### map

Map 函数这里理解起来，并不是地图的意思，而是`映射`

具体的意思就是`将每一个数组中的值遍历，进行计算，如果需要返回计算好的结果，那么map函数就会新生成一个数组，将结果一一映射到这个新生成的数组中，然后返回`

来看看这个栗子


```javascript
var list = [1 , 2 , 3 , 4];

var arr = list.map(function( value , idx , array ) {
   return value * value;  
});

console.log({}.toString.call(list)) // [Object Array]
console.log(arr) // [1,4,9,16]
```

除此之外，map函数和forEach函数的其他功能是`完全一样`的

从这里我们就能看出 map 和 forEach的异同， 两者都可以循环遍历， 但是一个可以有`return`而另一个没有

所以相比较下，还是map 的功能更全

### filter

filter 大家应该都清楚是过滤，没错，这个函数也确实是起到一个过滤的作用

和map一样，filter函数同样有forEach的全部功能，同样能遍历计算

不同的地方还是在返回值

map函数的返回值是一个数组
而filter函数的返回值也是一个数组，这个数组会过滤掉所有为非或空的值（caveat: 空对象和空数组并不会被过滤，但是空字符串则会被过滤）



```javascript
var list = [0 , undefined , "" , null , NaN , false , true , {} , [] ,"Owen" , 1 ];

var arr = list.filter(function( value , idx , array ) {
   return value;  
});

console.log(arr) // [true, Object, Array[0], "Owen", 1];
```

由此可见filter是在map的基础上再增添了一个过滤的功能

### every 和 some 

这两个函数在就和上面三个函数在功能上有较大区别了，但是长的都还差不多一样
语法也是相同的，都是添加一个callback 和一个可选的环境参数

先来看看怎么用的



```javascript

var list = ["" , NaN , null , 1 , [] ,{}];
console.log( list.every( function ( value ) {
    return value;
}) ); // false

// some
console.log( list.some( function ( value ) {
    return value;
}) ); // true

```

这两个函数会捕获每一个遍历后return的返回值，然后进行判断

对于every 函数来说 ， 如果返回的值中`有一个`是空或者非类型的，那么这整个函数，返回`一个false` , 反之返回 `一个` true

对于some 函数来说 ， 如果返回的值中`有一个`是非空类型的，那么整个函数就会返回一个true ， 反之返回一个 false

caveat : 如果没有写 `return` 这个关键字，那么默认返回的就是false

可能读到这里很多人已经一脸懵逼了，那么下面我再详细讲讲



```javascript
if(
    name.some(function ( value , idx , array ) {
        return /^Owen$/.test(value);
    })
) {
    alert("这name表里面有个叫Owen的大逗比");    
}
```

看some函数会将匿名函数所return的所有值转为boolean类型的值，并收集起来，只要其中有一个是true 那么就返回 true ，如果都木有，那么就返回false



```javascript
var list = [1 , 2 , 3 , 4 , 0];

if(
    !list.every(function ( value , idx , array ) {
        return value;
    })
) {
    alert("表里有个0");    
}
```

聪明的同学应该立马就能猜到 every 则是要求全部都是正确的true 就返回true咯

如果其中一个是false 就会返回false

基本功能大家应该都懂了，那么我们再看看 every 特有的一个特性 

还是上文遍历的例子 


```javascript
var familyinfo = [{
    "name" : "甲",
    "age"  : 30,
    "child" : [{
        "name" : "甲娃1",
        "age"  : 1,
        "child" : null
    },{
        "name" : "甲娃2",
        "age"  : 2,
        "child" : null
    }]
},{
    "name" : "乙",
    "age"  : 25,
    "child" : [{
        "name" : "乙娃1",
        "age"  : 3,
        "child" : null
    }]
},{
    "name" : "丙",
    "age"  : 60,
    "child" : [{
        "name" : "丙娃1",
        "age"  : 25,
        "child" : [{
            "name" : "丙孙1",
            "age"  : 2,
            "child" : null
        }]   
    }]
}]


familyinfo.every( travel );

function travel (value , idx , array) {
    console.log( value.name );
    if ( value.child !== null ) {
        value.child.every( travel );
    }
}

// 甲
// 甲娃1
```

很明显可以看到，当我把遍历方法换成 every 的时候 就无法全部遍历了

原因是 `every方法具有短路的效用，只要发现有false就会返回，并停止遍历`

至于为什么是false ， 上文已经提到了，因为没有写 return ，默认就是false

如果加上了 `return true`


```javascript

function travel (value , idx , array) {
    console.log( value.name );
    if ( value.child !== null ) {
        value.child.every( travel );
    }

    return true; // 返回true 
}

// 甲
// 甲娃1
// 甲娃2
// 乙
// 乙娃1
// 丙
// 丙娃1
// 丙孙1

```
又可以正常遍历了 

### indexOf & lastIndexOf

大家应该在字符串中经常使用indexOf 都用熟了吧

现在数组中也支持indexOf啦



```javascript
var list = [1,2,3];

console.log( list.indexOf(2) ) // 1


var list = [1,1,1,2];

console.log( list.indexOf(1) ) // 0 匹配多个值，返回0
```




```javascript
var list = [NaN , undefined , null , "" , [] , {}];
console.log( list.indexOf(NaN))        // -1  
console.log( list.indexOf(undefined) ) // 1
console.log( list.indexOf(null))       // 2
console.log( list.indexOf([]))         // -1
console.log( list.indexOf({}))         // -1
console.log( list.indexOf(""))         // 3
```

第二个参数 和字符串一样，设置其实查找位置（我就不演示了）

### reduce

关于这个玩意嘛，个人感觉还是挺好用的

先来个小demo



```javascript
var list = [1,2,3,4];
var r = list.reduce( function ( prev , next , idx , array ) {
    console.log(idx);
    return prev + next;
})
console.log(r);

// 1
// 2
// 3

// 10
```

由上面的实验可知，reduce 也是循环，不过和上面的循环都有些不同，它是循环 数组长度 - 1 次 且循环的开始的起点是数组的第二位开始

而循环的过程中发生了些啥呢，让我们接着往下看

循环开始后，是这样进行的

第一次循环 获取 list[0] -> prev  list[1] -> next
第二次循环 获取 上次循环的返回值 -> prev list[2] -> next
第三次循环 获取 上次循环的返回值 -> prev list[3] -> next
循环结束，将return的值 赋值给r（r === 10）

由此可以看到，reduce 下的匿名函数的第一个参数 prev 是和其return 的值是密切相关的

所以，如果要使用reduce 函数，最好是要带上返回值

那让我们再看看如果一个数组中只有一个值的时候，会发生怎样的情况



```javascript
var list = [777];
var r = list.reduce( function ( prev , next , idx , array ) {
    console.log("Owen love Zyz");
    console.log("再写些杂七杂八的东西 加深印象");
    prev = 5201314;
    next = 123456;
    return prev + next;
})
console.log(r);

// 777
```

很明显，当数组中只有一个值的时候, `函数的任何代码都不会执行`，直接返回 初值 777 ，无论你做了什么改动

很清楚了，reduce 是用来实现递归的

那让我们再看看，如果数组中取其他类型的值会咋样



```javascript
var name = ["Owen" , "Zyz" , "Luffy"];

console.log(name.reduce(function ( prev , next , idx , array ) {
    return prev + next;
})); // OwenZyzLuffy

var list = [[1,2,3] , {name:"owen"} , [4,5,6]];
var r = list.reduce(function ( prev , next , idx , array ) {
    return prev + next;
})

console.log(r) // 1,2,3[object Object]4,5,6
console.log( {}.toString.call(r) ) //[object String]

var arr = [NaN , null , undefined , 1 , "owen"];

var re = arr.reduce( function ( prev , next , idx , array ) {
    return prev + next;
})

console.log(re) // NaNowen
console.log( {}.toString.call(re) ) // [object String]
```

使用reduce 还能让我们轻松实现二维数组扁平化



```javascript
var array = [
    [1,2,3],
    [4,5,6],
    [7,8,9]
];

var newArr = array.reduce( function ( prev , next , idx , array) {
    return prev.concat(next);
})
console.log(newArr) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

而 reduce 的第二个参数，设置的是一个初始值，(一个栗子解决问题)



```javascript
var list = [1,2,3,4];
var r = list.reduce( function ( prev , next , idx , array ) {
    return prev + next;
},100)
console.log(r);

// 110
```

也就是最后合并结果的时候，加入初始值

而另一个函数 reduceRight 类比上文 听名字就懂啦，就是从右往左递归呗

## Es6 Array 新增方法

### Array.from

我们可以使用这个静态的数组方法，把字符串或对象变为数组



```javascript
console.log(len = Array.from("Owen"))
// ["O" , "w" , "e" , "n"]

console.log(Array.from({Owen : 1 , Zyz : 2}));
// 一般的对象类型不可变
// []

console.log(Array.from({ 0 : "Owen" , 1 : "Zyz" , 2 : "Luffy" , length : 3}))
// 带有 length 属性 并且 索引是顺序数字的对象可变为数组
//  ["Owen", "Zyz", "Luffy"]

console.log(Array.from({ 1  : "Owen" , 2 : "Zyz" , 3 : "Luffy" , length : 3}))
// 如果索引并不是 从 0 开始顺序 的话
// [undefined, "Owen", "Zyz"]
// 0 位 被undefined ， 又因为length 是3  所以最后一个被舍弃

console.log(Array.from([1,2,3]));
// 数组类型不变
// [1,2,3]
```

除此之外 ，一些类数组也可以变为数组

例如 `arguments`

原来的arguments 类型是类数组形式，虽然长的像数组，但是不具备数组对象的方法
现在,我们只要通过Array.from 把arguments转型为数组，就可以像数组一样使用旗下的很多方法了



```javascript
function test ( a , b , c ) {
    Array.from(arguments).forEach(function ( value , idx , array ) {
        console.log(value);
    });
}

test("Owen" , "Zyz" , "Luffy");
```

Array.from 的第二个参数 实际上就是内嵌的一个 map函数（用法见上文）



```javascript
console.log(Array.from([1, 2, 3], function (value , idx , array) {
    return value * value;
}))
```

caveat: 如果声明了 第二参数 那么一定要在 map 函数 显式的添加 renturn 不然会返回Undefined

Array.from 的第三个参数，和map方法的第二个参数一样，可以改变map函数的执行环境

### Array.of

首先我们来看 之前通过 Array 对象生成数组时候，有个小问题


```javascript
Array() // []
Array(2)// [undefined,undefined]
Array(2,7,6) // [2,7,6]
```

如果只传递一个参数的话，只是会构建一个长度为2的数组，只有参数达到两个以上，才会构建一个带初值的数组

为了弥补，当传参只有一个的情况，Es6加了一个新的方法Array.of



```javascript

console.log(Array.of(7)) // [7]

```

感觉有点鸡肋， 因为我们平时应该都是使用字面量的方式创建的吧~

### copyWithin

一看函数名，就知道和复制有关系

是的这个函数可以将，数组内部的值进行复制，并粘贴到其他位置上

一共有三个参数

target ( 开始替换的位置 )

start ( 开始复制的位置  )

end ( 复制结束的位置 ) 【可选】

和很多字符串方法一样，也是`留始去终`原则

例如 [ "Owen","Zyz","luffy","micale","Jsaon","leon" ] 这样一个数组

首先设置替换开始的位置，比如我要从Zyz也就是索引1的位置开始替换 那么第一参数target就设置为1

然后设置开始复制的位置 ，例如我要从"micale" 开始复制 那么start设置的应该是"micale"的索引位置，也就是3 【留始】

设置结束的位置是到leon 但是不包括leon 所以 end应该设置5 【去终】

```javascript
console.log( [ "Owen","Zyz","luffy","micale","Jsaon","leon" ].copyWithin(1,3,5) )
//  ["Owen", "micale", "Jsaon", "micale", "Jsaon", "leon"]
```

当然，如果end不填，就是start后面全部

### find 和 findIndex

find 和 findIndex 是Es6 新添加的两个遍历方法

语法和上面 forEach 、 map 、 filter 、 every 、 some 一样

find函数，用法是不断递归，返回符合条件的值

findIndex函数，用法是不断递归，返回符合条件的索引

```javascript

// 语法
arr.find(callback[, thisArg])

var arr = [ 0 , 2 , -3, 44 , -5 ]

console.log(arr.find(function ( value , idx, array ) {
    return value > 3;
})) // 44

console.log(arr.findIndex(function ( value , idx, array ) {
    return value > 3;
})) // 3

console.log(arr.find(function ( value , idx, array ) {
     
})) // underfined

console.log(arr.findIndex(function ( value , idx, array ) {
    
})) // underfined

```

如果find所找的值都不符合条件，那么会返回underfined


```javascript
var arr = [ 0 , 2 , -3, 44 , -5 ]
console.log(arr.find(function ( value , idx, array ) {
    return value < -5;
})) // underfined

如果findIndex所找的值都不符合条件，那么会返回-1


```javascript
var arr = [ 0 , 2 , -3, 44 , -5 ]
console.log(arr.findIndex(function ( value , idx, array ) {
    return value < -5;
})) // -1
```

### fill

使用fill方法可以，给一个数组填充内容

使用分两种情况

① 当只有一个参数的时候，将数组中的值全部替换

```javascript
console.log([1,2,3,4,5,6].fill(7)); // [7, 7, 7, 7, 7, 7]
```

② 如果两个或三个参数 ，第二个和第三个参数 用来设置替换的位置, 【留始去终原则】


```javascript
console.log([1,2,3,4,5,6].fill(7,1,2)); //  [1, 7, 3, 4, 5, 6]
```

我们可以使用fill来初始化新数组

```javascript
var a = new Array(100).fill(7);
console.log(a);

// 100个7
```

当然fill方法的替换功能个人觉得有点鸡肋，因为明明已经有splice 函数了

### includes

我们可以使用includes来判断一个值是否在某个数组里面

```javascript

console.log([1,2,3,4,5,6].includes(3)) // true
console.log([1,2,3,4,5,6].includes(100)) // false

```

### keys

学过Ecmascript6 的同学应该清楚，es6 中为我们提供了一种新的数据结构，迭代器 Iterator 

```javascript

var c = [1,2,3,4,5];

var v = c[Symbol.iterator]()
console.log(v.next()) // {value: 1 , done: false}

```

而Iterator ， 只能为我们构建对应值得迭代器，但是不能为我们提供数组各个索引的迭代器，
所以，es6 又为我们提供了 keys方法

```javascript
var c = [1,2,3,4,5];
var v = c.keys();


console.log( {}.toString.call(v) );   // [object Array Iterator]
console.log( v.__proto__ )            // 我们可以在chrome下查看迭代器中包含的所有方法

console.log(v.next()) // {value: 0 , done: false}  value 对应的是 值1 的索引

```

索引迭代器，会包含数组中没有值，或是空、非值的索引

```javascript

var c = [null , undefined , "" ,  , NaN];

var v = c.keys();

for( var i  of v ) {
    console.log(c[i]);
}

// null
// undefined
// (空字符串)
// undefined
// NaN

```

上面的栗子中使用了 for...of ，我们就来看看for...of的用法

### Es6中新的遍历方法 for...of

for...of专门用于遍历Iterator的一种新遍历方法

数组中默认具备Iterator 接口，所以，数组可以被for...of遍历

```javascript
var a = [1,2,3,4,5];

for( var i of a ) { 
    console.log(i)  // i 直接就是数组中的值，不是索引！！
} 
```

注意不能给i在for 中赋予初值

```javascript
for( var i = 0 of a ) {    // 会报错
    console.log(i)  
}


var i = 100;   // 在for i外可以赋值,但无意义
for( var i of a ) { 
    console.log(i);
} 
```

### entries

上文见到了，我们使用keys 可以构造一个索引的迭代器 ，使用 Symbol.iterator 可以构造一个值的迭代器

那么如果要 构造一个 同时含有 索引和值 的迭代器应该如何做呢？

Es6给我们提供了 entries 方法

```javascript

var a = ["Owen" , "Zyz" , "Luffy"];
var b = a.entries();

for( var i of b ) {
    console.log(i);
}

// [0, "Owen"]
// [1, "Zyz"]
// [2, "Luffy"]

```

### values

上文我们使用了 Symbol.iterator 来构建一个迭代器，这样写显得有些麻烦，有没有些简单的方法呢？

Es6为我们 提供了 [values 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/values)

不过，这个方法还对于多数浏览器来说还未支持...我就不演示了

关于迭代器，具体见[ECMAScript 6 入门 Iterator和for...of循环](http://es6.ruanyifeng.com/#docs/iterator)


## 感谢

[ES5中新增的Array方法详细说明](http://www.zhangxinxu.com/wordpress/2013/04/es5%E6%96%B0%E5%A2%9E%E6%95%B0%E7%BB%84%E6%96%B9%E6%B3%95/#reduce)

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[es6 入门之十一：数组的扩展](http://blog.sina.com.cn/s/blog_77f241790102vrm3.html)
---
layout: post
title: 简单理解洋葱模型
category: 技术
keywords: 技术,js
---

## 起因

组里的T5的分享了redux 源码解读， 其中有一块用到了洋葱模型

## 什么是洋葱模型

最直观的体现就是DOM事件的捕获和冒泡机制

一个事件到达指定的元素之前先会经过上级的所有元素，触达后又会往上冒泡

而洋葱模型，就是这样一种模式

![onion_modal](/assets/img/onion_modal.png)

**redux middleware 的洋葱模型演示**

当最中心的事件触达之前，会触发包裹在外面的 多个中间件，
这些中间件执行完成后触发核心事件， 核心事件触发完成后，
如果在某些中间件中你还想做一些后续操作还可以继续执行中间件的后续操作

## 源码

这不是redux 的源码，只是我基于个这个思想，自己写的一个简单的demo

```js
function fea1 (next) {
    return function (data) {
        console.log('i execute fea1');
        data.data++;
        next(data);
        console.log('i end fea1');
    }
}

function fea2 (next) {
    return function (data) {
        console.log('i execute fea2');
        data.data *= 2;
        next(data);
        console.log('i end fea2');
    }
}

function fea3 (next) {
    return function (data) {
        // data handle
        console.log('i execute fea3');
        data.data /= 3
        next(data);
        console.log('i end fea3');
    }
}

function dispatch (obj) {
    // emit dataes
    console.log('i execute some action, meanwhile i emit the data after mid wares calc \n', obj);
}

function main (dispatch, midWares) {
    return midWares(dispatch);
}

function applyMiddleware (...feas) {
    return function (curDispatch) {
        return compose(...feas)(curDispatch)
    }
}

// 生成洋葱模型
function compose (...func) {
    return function (interDispatch) {
        return func.reduceRight(function (f, becompose) {
            return becompose(f);
        }, interDispatch);
    }
}

let somedata = 1;
main(dispatch, applyMiddleware(fea1, fea2, fea3))({data: somedata});
```

输出

```js
i execute fea1
i execute fea2
i execute fea3
i execute some action, meanwhile i emit the data after mid wares calc 
 Object {data: 1.3333333333333333}
i end fea3
i end fea2
i end fea1
```

其中 dispatch 就是那个最核心的事件，每一个中间件以next 作为分界， 
next 之上的操作为触发核心事件前的操作， next之下的操作为触发核心事件后的操作

## 洋葱模型的作用

例如提交表单， 多个中间件可能会对用户的输入（somedata） 进行各种验证或者是处理。
最后一步可能就是提交或者渲染数据操作

## 异步

在某个中间件中可能存在异步的操作，类比（redux-thunk）
为什么需要异步操作？

因为我们可能在中间件中先将数据发送到后端，根据后端的返回来决定dispatch（是渲染页面还是报错）

## thunk

我们添加一个特殊的中间件 thunk 来实现异步处理。

```js
function thunkfunc(next) {
    new Promise(resolve => {
        console.log('>>> waitting judge');
        setTimeout(() => {
            resolve(Math.random() - .5);
        }, 1000);
    })
    .then(rwn => {
        next({data: somedata, judge: rwn < 0 ? 'crime': 'kind'});
    });
}
```

很明白的看出， thunk 会对传进来的数据进行处理， 
如果是一个函数，那么就不会向下一步深入洋葱，而是先处理函数，将next 以传参的形式传递给函数，
由函数来决定下一步应该怎么运行

例如我们传递一个thunkfunc

```js
function thunkfunc(next) {
    new Promise(resolve => {
        setTimeout(() => {
            resolve(Math.random() - .5); // 随机判断
        }, 1000);
    })
    .then(rwn => {
        next({data: somedata, judge: rwn < 0 ? 'crime': 'kind'});
    });
}
```

然后把上文的somedata 替换为thunkfunc，并添加特殊的thunk中间件

```js
main(dispatch, applyMiddleware(thunk, fea1, fea2, fea3))(thunkfunc);
```

执行结果

```js
>>> waitting judge // 执行异步操作
i execute fea1
i execute fea2
i execute fea3
i execute some action, meanwhile i emit the data after mid wares calc 
 Object {data: 1.3333333333333333, judge: "kind"} // 返回异步操作后的结果 'kind'
i end fea3
i end fea2
i end fea1
```

## 源码

这是最终源码：

```js
function fea1 (next) {
    return function (data) {
        console.log('i execute fea1');
        data.data++;
        next(data);
        console.log('i end fea1');
    }
}

function fea2 (next) {
    return function (data) {
        console.log('i execute fea2');
        data.data *= 2;
        next(data);
        console.log('i end fea2');
    }
}

function fea3 (next) {
    return function (data) {
        // data handle
        console.log('i execute fea3');
        data.data /= 3
        next(data);
        console.log('i end fea3');
    }
}

function dispatch (obj) {
    // emit dataes
    console.log('i execute some action, meanwhile i emit the data after mid wares calc \n', obj);
}

function main (dispatch, midWares) {
    return midWares(dispatch);
}

function applyMiddleware (...feas) {
    return function (curDispatch) {
        return compose(...feas)(curDispatch)
    }
}

// 生成洋葱模型
function compose (...func) {
    return function (interDispatch) {
        return func.reduceRight(function (f, becompose) {
            return becompose(f);
        }, interDispatch);
    }
}

let somedata = 1;

function thunkfunc(next) {
    new Promise(resolve => {
        console.log('>>> waitting judge');
        setTimeout(() => {
            resolve(Math.random() - .5);
        }, 1000);
    })
    .then(rwn => {
        next({data: somedata, judge: rwn < 0 ? 'crime': 'kind'});
    });
}


main(dispatch, applyMiddleware(thunk, fea1, fea2, fea3))(thunkfunc);

function thunk (next) {
    return function (data) {
        if (typeof data === 'function') {
            data(next);
        } else {
            next(data);
        }
    }
}
```
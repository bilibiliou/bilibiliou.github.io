---
layout: post
title: React V16 给我们带来了那些东西？
category: 技术
keywords: 技术,js
---

## download

我们可以在这里下载到最新的 beta 版react [下载链接](https://github.com/facebook/react/releases/tag/16.0.0-beta.5)

## React 内核改变 --fiber

什么是react-fiber ?

```js
increase its suitability for areas like animation, layout, and gestures.
Its headline feature is incremental rendering: 
the ability to split rendering work into chunks and spread it out over multiple frames.
 ```

react-fiber 是为了增强动画、布局、移动端手势领域的适用性，最重要的特性是对页面渲染的优化: 允许将渲染方面的工作拆分为多段进行

其中fiber 英文意思是纤维，众所周知，Js 是单线程的，当Js 在执行一段代码功能的过程中会对其他的代码进行堵塞

在如今越来越复杂的前端环境下，往往可能需要加载且渲染大量的DOM节点，那么在渲染的过程中，即使我们使用了React virtualDom 进行维护，但是，也是会阻塞其他功能的进行。例如，当其他节点渲染的过程中，用户执行了某些交互操作，例如点击，输入，手势等， 由于在渲染的过程中会阻塞线程，导致 这些交互行为延迟，也就是在用户眼中的卡顿。

Ok， 在这样的使用背景下，Facebook 团队在两年前就开始为我们研究，并且提供了 react-fiber 的新功能，react-fiber 可以为我们提供如下几个功能：
  
  1. 设置渲染任务的优先
  2. 采用新的Diff算法
  3. 采用虚拟栈设计允许当优先级更高的渲染任务和较低优先的任务之间来回切换


facebook 团队计划于 react v16 发布 react-fiber

目前已经发布了 beta 版本 

详细介绍可以看 [介绍视频](https://www.youtube.com/watch?v=aV1271hd9ew)

### Demo

首先，我们可以先看一个栗子 [使用 react-fiber 渲染谢 尔宾斯基三角形 demo](https://claudiopro.github.io/react-fiber-vs-stack-demo/)

很明显可以看出，在大数量节点渲染的情况下，使用原来正常的react方式所渲染的页面要顺畅很多

### 使用

让我们来尝试一下 React-fiber 的使用

对比正常的react，fiber做了一次升级


```js
// 首先引用改变了
import ReactDOMFiber from 'react-dom-fiber';
ReactDOMFiber.render()
```

```js
// 由于是beta版，所以渲染的时候，react团队采用了这种方式
// 以回调的形式进行
// 从deferredUpdates我们可以看出，这是渲染低优先级的函数

ReactDOMFiber.unstable_deferredUpdates(() =>
  this.setState(state => {
    // 我们可以通过回参取得旧state
    // 更新组件之前的逻辑处理
    // return新的state

    return {
      // new state  
    }
  })
);
```

在刚刚的例子中

高优先级的渲染任务为父节点的transform动画
低优先级的渲染任务为每一个节点的数据渲染

## V16的其他功能

同时 v16 还提供了其他新功能

#### 允许render 函数 处理多纬渲染

```js
var ManagePost = React.createClass({

  render: function() {
    var posts = this.props.posts

    var something;
    var somethingelse;

    var row = posts.map(function(post){
      return(
        <div>
          <div className="col-md-8">
          </div>
          <div className="cold-md-4">
          </div>
        </div>
      )
    });

    return (
        {row}
    );
  }

});
```
可以看出，我们希望能够以一个数组的形式渲染多个节点

#### 渲染异常的降级错误处理

```js
var MyGoodView = React.createClass({
render: function () {
return <p>Cool</p>;
}
});

var MyBadView = React.createClass({
render: function () {
throw new Error('crap');
}
});

try {
// 希望抛出错误
React.render(<MyBadView/>, document.body);
} catch (e) {
// 进行错误降级处理
React.render(<MyGoodView/>, document.body);
}
```
在之前，如上代码是无法执行到降级处理的，而在 V16中会允许降级处理，并且为我们提供完整可读的组件堆栈异常信息，这样我们就可以对渲染异常的错误进行捕获监控

#### 重写服务器渲染API方法，提供多个以流的渲染方法
  
```js
ReactDOMServer.renderToStream()
ReactDOMServer.renderToStaticStream()
```

直出同学的福音

####  有关 state 函数
* 对于 state对象返回为 Null 的情况下不会触发重新渲染
* setState 的回调函数 会在所有组件渲染完成之前触发（即componentDidMount / componentWillUnmount） 两个钩子之前

## 需要注意的问题

V16 已经依赖 Es6 Map 和 Set 类型，如果需要支持老旧浏览器场景（ie < 11） 需要在场景内引入垫片库（polyfill）

```js
// 引入 es6 垫片库
import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

V16 还依赖 requestAnimationFrame 这一API， 如果老旧浏览器不支持，可以使用setTimeout 替代

```js
global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};
```
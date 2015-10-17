---
layout: post
title: Websocket学习历程
category: 技术
keywords: 技术,Websocket
---

## 什么是Websocket

Websocket是一个HTML5下的一个新的协议,美名曰:浏览器与服务器全双工通信协议。
什么是全双工通信呢？我们来看张图分析

![websocket](/assets/img/Websocket.png)

其实我们之前也是拥有一些技术来实现全双工通信的,比如说AJAX,但是实际上AJAX依靠的协议还是Http协议
而且由上图我们都知道Http协议的 request = respone 而AJAX依靠的也是通过不断的进行短时间的Http轮询
来实现客户端和服务端即时通信的。本质并没有改变。

但是,websocket协议 只要在客户端和服务器间建立起一次联系(握手) 就能不断的任意的请求和响应
从而实现request 可以!= respone

总结一下websocket的好处
1.因为需要建立一次联系,所以占用的资源会大幅减少
2.可以在客户端不请求的情况下也进行数据的推送( server push )

## Websocket 和 nodeJs

Websocket应用层的一门协议 nodeJs 是一个脚本运行环境
Websocket 所以运行在nodeJs之中的

## Websocket原理

Websocket

## socket.io

socket.io一个是基于Nodejs架构体系的，支持websocket的协议用于时时通信的一个软件包。socket.io 给跨浏览器构建实时应用提供了完整的封装，socket.io完全由javascript实现。


## 感谢

[妙味课堂](http://www.miaov.com)

[socket.io粉丝日志](http://blog.fens.me/nodejs-socketio-chat/)

[WebSocket是什么原理](http://www.zhihu.com/question/20215561)
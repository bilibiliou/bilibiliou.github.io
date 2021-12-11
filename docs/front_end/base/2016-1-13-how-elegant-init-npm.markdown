---
layout: post
title: npm 初始化 
category: 技术
keywords: 技术,nrm,npm
---

## 如何优雅的进行npm初始化

刚接触 npm 的同学，教程上一定会出现一个 npm init

npm init 可以产生一个 package.json 文件

如何配置 package.json 中的一些初始信息呢（作者姓名，邮箱，作者信息链接，目标服务器 等等）

我们可以使用 npm config set xxx blablabla 但是 这样做并不高效

我们可以直接修改npm config 的配置文件来将需要进行初始化的信息进行编辑

```
npm config edit
```

![pic](/assets/img/how-to-use-npm-init.png)

如图，我手动配置了一些基本的参数信息。

![pic](/assets/img/how-to-use-npm-init2.png)

## 使用 nrm 

由于国内的GFW, 我们和npmjs 服务器的连接可能会不稳定，需要我们使用国内的镜像服务器。
但是当我们 npm publish 我们自己的代码 共享到全世界的时候， 又需要连接到 npmjs 国外的服务器

这样就需要 我们对 npm registry 进行设置，并且能够随时切换 registry 
于是有人就研究出了 nrm 这一工具

使用很简单

```
Commands:

  ls                           列出已添加的服务源列表
  current                      展现当前使用的服务源
  use <registry>               切换服务源
  add <registry> <url> [home]  添加服务源
  del <registry>               删除服务源
  home <registry> [browser]    通过默认浏览器打开服务源官网
  test [registry]              测试服务源连接速率
  help                         帮助

Options:

  -h, --help     output usage information
  -V, --version  output the version number
```
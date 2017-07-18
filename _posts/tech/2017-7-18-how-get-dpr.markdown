---
layout: post
title: 如何获取屏幕的缩放比例
category: 技术
keywords: 技术,js
---

## 如何获取屏幕的缩放比例

window.outerWidth 获取浏览器窗口外部的宽度。 它表示整个浏览器窗口的宽度，包括边栏 

也就是固定的宽度，无论只要浏览器窗口是固定的，页面怎么变化 outerWidth 都不会改变，改变的唯一渠道是 缩小浏览器的窗口宽度或者向下还原

window.innerWidth 获取浏览器可视区域（具体可视页面）的宽度，也就是页面的宽度，这个属性会随着页面的宽度改变而改变，无论是我们使用ctrl+滚轮缩放页面，还是我们打开F12 填充页面，都会改变这个属性值

正常情况下 window.outerWidth === window.innerWidth

但是在用户缩放的情况下

1. 放大的情况： window.innerWidth > window.outerWidth

2. 缩小的情况：window.innerWidth < window.outerWidth

所以，我们可以根据 window.outerWidth / window.innerWidth 来得出页面中具体的缩放比例

有些网站上会贴出

```
你的浏览器目前处于放大状态，会导致页面显示不正常，你可以键盘按“ctrl+数字0”组合键恢复初始状态。
```

类似的提示，就是通过判断缩放比例是否为 1 来判断用户是否进行了缩放

## window.devicePixelratio(dpr)

现代浏览器很周到，帮我们做了类似如上的事情，所以我们只需要访问这个属性，就知道用户是否进行了缩放。

此外，在移动端页面开发的时候，这个属性还用于判断用户使用设备的缩放比，来确定 根节点的字体大小，配合rem进行开发

所谓，视网膜屏幕（iPhone6 dpr为2）就是把页面元素用更多的像素点来表示 也就是先放大页面再用密集像素点压缩的过程。所以，如果你alert一下devicePixelratio的话，输出的也会是2

## IE 兼容

如果是， IE浏览器，也有两个属性来做出兼容

screen.deviceXDPI / screen.logicalXDPI

对照于 outerWidth 和 innerWidth 进行理解

不过在标准浏览器下，console 这两个值会输出undefined
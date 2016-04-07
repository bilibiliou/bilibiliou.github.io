---
layout: post
title: 关于复制链接和clipboardJs
category: 技术
keywords: 技术,clipboardJs
---

## 复制链接问题

最近做东西的时候，遇到了需要复制链接的需求，上百度一搜，发现很多给的都是基于window.clipboardData API来实现的复制，这些方法有时候并不灵验，而且firefox下还会有兼容性的问题。

## clipboardJs

于是google之，发现了[clipboardJs](https://zenorocha.github.io/clipboard.js/) 这样一个轻量级的js库，它是基于 HTML5 的 data 属性(attributes) 来实现复制、粘贴 和 剪切功能的 所以也就是说只有支持html5的浏览器才可以支持这个库

具体支持的 是 chrome42+ 、 firefox 41+ 、 iE 9+ 、 opera 29+ 和 safari X

因为是基于html5的，所以也就不需要再依靠逐渐被淘汰的flash了

正好需求并不需要支持低版本浏览器，于是学习之

## 使用

直接引用`<script src="dist/clipboard.min.js"></script>`

然后实例一个clipboard对象


```javascript
new Clipboard('.btn');
```

这个对象会获取到对应的class id 或者 name 的点击复制按钮，这个按钮就可以绑定剪贴板的全部功能了

### 复制



```html
<!-- Target -->
<input id="Target" value="我是需要复制的内容">

<!-- Trigger -->
<button class="btn" data-clipboard-target="#Target">
    Copy to clipboard
</button>

```


比如我们如果要复制一个输入框里面的value ， 那么就需要在被绑定的按钮上 添加一个`data-clipboard-target` 属性
就能够实现赋值目标的内容

### 剪切

同理,我们也可以实现剪切文本框里面的内容


```html
<!-- Target -->
<textarea id="Target">我是需要被剪切的内容</textarea>

<!-- Trigger -->
<button class="btn" data-clipboard-action="cut" data-clipboard-target="#Target">
    Cut to clipboard
</button>
```


### 固定内容复制


```html
<!-- Trigger -->
<button class="btn" data-clipboard-text="需要被复制的内容">
    点击我复制内容
</button>
```

如果我们需要复制的内容固定的话，可以这么写

### 回调事件

当进行操作完后可以弹出提示框，提示成功操作，或者进行一些回调操作

```javascript

var clipboard = new Clipboard('.btn');

clipboard.on('success', function(e) {
    
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);

    e.clearSelection();
});

clipboard.on('error', function(e) {
    
    console.error('Action:', e.action);
    console.error('Trigger:', e.trigger);

});

```

其中，回调对象可以给我们返回

① 执行的操作     e.action
② 进行操作的文本 e.text
③ 触发的对象     e.trigger

### Js中设置对象

如果你并不想修改你的html(在里面添加新的data属性)，也可以在js中设置你需要操作的目标


```javascript

new Clipboard('.btn', {
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
});

```
如果这样的话，就需要给target赋值一个node，范例中是获取了操作按钮的下个结点，当然你也可以任意修改，任意的、你需要进行操作的目标结点

### Js中设置操作文本对象

当然你也可以只通过修改js来确定需要进行操作的文本，只要返回String类型的字符串就ok了

```javascript
new Clipboard('.btn', {
    text: "这是需要进行操作的内容"
    }
});
```

### 删除对象

如果这个已经不需要使用了剪贴板了，就可以调用`destroy`方法来清除这个对象实例，并将其下绑定的事件和对象全部清除


```javascript
var clipboard = new Clipboard('.btn');
clipboard.destroy();
});

```

关于Html5自身的控制剪贴板的方法还在草案拟定当中

[https://w3c.github.io/clipboard-apis/](https://w3c.github.io/clipboard-apis/)

当然如果html5出了更加合适的内置API，我们也就无需调用clipboardJs库了

## 感谢

Zeno (一名来自洛杉矶的工程师)  以及他的博客 [http://zenorocha.com/](http://zenorocha.com/)




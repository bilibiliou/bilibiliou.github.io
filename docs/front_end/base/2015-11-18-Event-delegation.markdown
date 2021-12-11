---
layout: post
title: 关于事件委托
category: 技术
keywords: 技术,事件委托,delegation
---

## 事件委托

如果我们做了如下很普通的ul-li布局


```html

<ul class="btns-list">
	<li class="function1"></li>
	<li class="function2"></li>
	<li class="function3"></li>
	<li class="function4"></li>
</ul>

```


现在我们需要给每一个li添加点击事件,而且这些li还会根据实际用户身份增加或减少
(比如,如果登录的是一个vip用户,他拥有的权利会比一般用户多,对应的li也会增加)

肯定有聪明的同学立马想到这一种方法

```javascript

...

//根据用户身份获得了需要添加的li数目

var LiNum = 5;

var oUl = document.getElementsByClassName(".btns-list")[0];

for(var i = 0 ; i<LiNum ; i++)
{
	var aLi = document.createElement("li");
	aLi.onlick = function()
	{
		....
	}
	oUl.appendChild(aLi);
}

```

这样的写法有三个弊端

① 给每一个li添加了监听事件
② 如果经过一番操作之后需要添加新的li,创建的li又需要添加新的监听事件
③ 不能根据实际需求给每一个li添加不同的功能

那么现在我们需要解决的问题就很明显了

① 需要能够更具实际需求,给每一个li按钮添加各自的不同的事件
② 减少操作DOM的次数,减少时间复杂度

所以现在就轮到今天的主角登场了,事件委托(event delegation)


```javascript

...

//根据用户身份获得了需要添加的li数目

var LiNum = 5;

var oUl = document.getElementsByClassName(".btns-list")[0];

oUl.addEventListener("click",function(ev){
	
	var ev = ev || window.event;

	if(ev.target && ev.target.nodeName == "LI") {
		// 找到被点击的li目标
		
		// 将全部不同功能的实现写在每一个case里
		switch(ev.target.className)
		{
			case "function1" : 

				....
				break;

			case "function2" :

				....
				break;

			.....
		}

	}
	else{
		return;
	}
	
});

然后如果需要添加新的需求,只需添加新的li就可以了

(注:具体思想如此,关于类名的获取,可使用jQuery或者使用html5 的 classList)

for(var i = 0 ; i<LiNum ; i++)
{
	var aLi = document.createElement("li");
	oUl.appendChild(aLi);
}



// 添加新的需求
if(....)
{
	var aLi = document.createElement("li");
	aLi.className = "function5"
	LiNum++;
	oUl.appendChild(aLi);
}

```

事件委托的原理还是事件冒泡,当你点击了某个li时候,该li没有事件
于是会冒泡到父级触发父级的事件

所以如果取消了冒泡,事件委托也会`无法使用`

## jQuery 实现事件委托

jQuery 中主要是使用 delegate()和undelegate()来实现的


```javascript

$(".btns-list").delegate( "li" , "click" , function(ev){
	
	switch(ev.target.className)
	{
		...
	}

});

```

如果我们需要阻止事件委托呢？


```javascript

$(".btns-list").undelegate();

```

## summery

事件委托对提升性能有很大的帮助,试想一下一个pv达到千万级的网站,本来服务器返回数据已经比较慢了,如果还需要进行频繁的DOM操作,那么用户体验肯定会有折扣,所以如果要给多个按钮添加事件,建议使用事件委托

## 感谢

[web骇客--关于事件委托的技术原理](http://www.webhek.com/event-delegate/)
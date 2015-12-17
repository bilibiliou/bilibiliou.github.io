---
layout: post
title: 关于排序原生js实现
category: 算法
keywords: 算法
---

## 内外排序

排序大的分类可以分为两种：内排序和外排序。当数据量不算太大的时候，计算可以在内存中完成的排序称为内排序。当数据量特别大，计算的数据，需要分多次进入内存中进行计算的排序称之为外排序

## 直接插入排序

{% highlight Javascript %}
var arr = [49,38,65,97,76,13,27,78,34,12,64,1];

	console.log("未排序前:"+arr);

	for( var i = 1 ; i<arr.length ;i++ )
	{
		var temp = arr[i];
		for( var j = i-1 ; j>=0 ; j-- )
		{
			if( arr[j] > temp )
			{
				arr[j+1] = arr[j];
			}else {
				break;
			}
		}
		arr[j+1] = temp;
	}

	console.log("直插排序后" + arr);
{% endhighlight %}

第一重循环：
用temp取数列中的第二个数，i对应temp的索引，i不断每次累加，累加次数为每次排序操作次数，即
arr长度减1次，


第二重循环：
循环不断进行判断，判断temp之前的数是否比temp大，如果比temp大那就让大的数不断的向上冒，直到没有更大的数比temp大的时候，就让temp封尾（arr[j+1] = temp）

## 


## 感谢

[各种排序算法的分析及java实现](http://www.cnblogs.com/liuling/p/2013-7-24-01.html)
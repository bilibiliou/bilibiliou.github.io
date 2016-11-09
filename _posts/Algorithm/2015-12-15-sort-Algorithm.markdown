---
layout: post
title: 关于排序原生js实现
category: 算法
keywords: 算法
---

## 内外排序的区别

排序可以分为两种：内排序和外排序。当数据量不算太大的时候，计算可以在内存中完成的排序称为内排序。当数据量特别大，计算的数据，需要分多次进入内存中进行计算的排序称之为外排序

## 插入排序

### 直接插入排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function InsertSort (data, order=1) {
	for (let i = 0; i<data.length; i++) {
		let temp = data[i],
				j = i-1;
		
		while(j>=0 && order ? temp < data[j] : temp > data[j]) {
			data[j+1] = data[j];
			j--;
		}

		data[j+1] = temp;	
	}

	return data;
}

console.log(InsertSort(data,0))
```

### 折半插入排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}


function reduceInsertSort(data) {
	let temp, s,e,m;
	for(let i = 1; i<data.length;i++) {
		temp = data[i];
		s = 0; e = i - 1;
		while (s <= e) {
			m = parseInt((s+e) / 2);
			if(temp < data[m]) {
				e = m - 1
			} else {
				s = m + 1
			}
		}

		for(j = i-1;j>=e+1;j--) {
			data[j+1] = data[j];
		}
		data[e+1] = temp
	}
	return data;
}

console.log(reduceInsertSort(data,1))
```

### 希尔排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function ShellSort (data, order=1) {
	let gap = parseInt(data.length / 2);

	while (gap>0) {
		// 间隔间进行插入排序
		for (let i = gap; i<data.length; i++) {
			let temp = data[i],
					j    = i - gap;
			while(j>=0 && order ? temp < data[j] : temp > data[j]) {
				data[j+gap] = data[j];
				j -= gap;
			}

			data[j+gap] = temp; 
		}

		gap = parseInt(gap/2);
	}

	return data;
}

console.log(ShellSort(data))
```

## 交换排序

### 冒泡排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function BubbleSort (data, order=1) {
	for (let i = 0; i<data.length; i++) {
		for (let j = i+1; j<data.length; j++) {
			if (order ? data[i]<data[j] : data[i]>data[j]) {
				data[j] -= data[i];
				data[i] += data[j];
				data[j] = data[i] - data[j];
			}
		}
	}
	return data;
}

console.log(BubbleSort(data,1) + "");
```

### 快速排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function quickSort (data, order=1) {
	return f(data);

	function f (arr) {
		if (arr.length <= 1) { return arr; }
		let d = 0,
				temp = arr.splice(d, 1)[0],
				l = [],
				r = [];

		for (let i = 0; i < arr.length; i++) {
	　　if (order ? arr[i] < temp : arr[i] > temp) {
				l.push(arr[i]);
	　　} else {
				r.push(arr[i]);
	　　}
	　}

	　return f(l).concat([temp], f(r));
	}	
};

console.log(quickSort(data,0));
``` 

## 选择排序

### 直接选择排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function choiceSort (data, order=1) {
	for(let i = 0; i<data.length; i++) {
		let temp = i;
		for(let j = i; j<data.length; j++) {
			if(order ? data[temp] > data[j] : data[temp] < data[j]) {
				temp = j
			}
		}

		if(temp != i) {
			data[temp] -= data[i];
			data[i] += data[temp];
			data[temp] = data[i] - data[temp]
		}
	} 
	return data;
}

console.log(choiceSort(data));
```

### 堆排序

```js
// 堆排序
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

/*
	order: Number 顺序为1，逆序为0,
	data: 排序数组
*/

function HeapSort(data, order=0) {
	let  len = data.length,
			result = [];

	// 建立初始堆
	for (let i = parseInt(len/2) - 1; i>=0; i--) {
		sift(i,len-1);
	}

	for (let i = len,temp = 0; i>=1 ;i--) {
		result.push(data[0]);
		data[0] = data[len-1]
		data.length--;
		len = data.length;

		sift(0,len-1);
	}

	return result
	// 堆化函数 s : 起始位置 e : 结束位置
	function sift (s, e) {
		let i = s, j = (2 * s) + 1, temp = data[s];  

		while (j<=e) {
			if (data[j+1]) {
				if (!order) {
					(j<e && data[j] < data[j+1]) && (j++)   // 比较左右子节点那个大，大的索引替换j
				} else {
					(j<e && data[j] > data[j+1]) && (j++)   // 比较左右子节点那个大，大的索引替换j
				}
			}  
			
			if (!order ? temp < data[j] : temp > data[j]) {
				data[i] = data[j];
				i = j;
				j = (2 * j) + 1;
			} else {
				break;
			}
		}
		data[i] = temp;
	}
}

console.log(HeapSort(data,1) + "");
```

## 归并排序

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function MergeSort(data, order=1) {	
	for(let len = 1; len < data.length; len *= 2) {  // 每次归并数组的长度 len
		let arr = [];
		for(let j = 0; j <data.length;j+= 2 * (len)) {
			arr.push(...merge(data.slice(j,j + len),data.slice(j+len,j + 2*len))) 
			// 每 len 个单位取一个数组，相邻两个间进行归并
		}
		data = arr;
	} 
	return data;
	
	// 能够将两个顺序（逆序）数组，归并
	function merge(arr1,arr2) {
		let arr = [],
				i = 0, j = 0;
		while (i< arr1.length && j< arr2.length) {
			if (order ? arr1[i] < arr2[j] : arr1[i] > arr2[j]) {
				arr.push(arr1[i])
				i++
			} else {
				arr.push(arr2[j])
				j++
			}			
		}

		if (i>= arr1.length) {
			for(let k = j; k<arr2.length; k++) {
				arr.push(arr2[k])
			}
		} else {
			for(let k = i; k<arr1.length; k++) {
				arr.push(arr1[k])
			}
		}
		return arr;
	}
}

console.log(MergeSort(data,0));
```

## 基数排序

基数排序比较特殊，是这几种排序中唯一不需要两者比较的一种算法。

```js
var data = [];

for (let i = 0; i<10;i++) {
	data.push(Math.floor((Math.random()*-200) +100))
}

function RadixSort (data, order=1) {
	let d = 0,
			positive = [],  // 正数区间
			negative = [],  // 负数区间
			result = []

	// 确定最大基数 并将数组中的元素转化为字符串
	for (let i = 0, value=""; i<data.length ; i++) {
		value = Math.abs(data[i]).toString();
		
		d = Math.max(d,value.length);
		
		if (data[i] >= 0) {
			positive.push(value);
		} else {
			negative.push(value)
		}
	}
	
	// 顺序的话 order : 1 positive 从小到大， negative 从大到小
	// 逆序反之 order : 0
	for (let i = 1; i<=d; i++) {
		let pTemp = new Array(10), nTemp = new Array(10);

		// 分别对正数区间和负数区间的对应基数的值进行分类
		for (let j = 0; j<positive.length; j++) {
			let value = positive[j], 
					flag = parseInt(value[value.length - i]),
					key = 0;
			
			(!flag) && (flag = 0);
			key = order ? flag : 10 - flag;
			// 判断是否有队列
			(!pTemp[key]) && (pTemp[key] = [])
			pTemp[key].push(value);
		}

		for (let j = 0; j<negative.length; j++) {
			let value = negative[j], 
					flag = parseInt(value[value.length - i]),
					key = 0;

			(!flag) && (flag = 0);
			key = !order ? flag : 10 - flag;
			(!nTemp[key]) && (nTemp[key] = [])
			nTemp[key].push(value);
		}

		positive = [];
		negative = [];

		// 按照分类的标准出队
		for (let i = 0; i<pTemp.length;i++) {
			if(pTemp[i]) {
				for(let j = 0;j<pTemp[i].length;j++) {
					positive.push(pTemp[i][j])
				}
			}
		}
		for (let i = 0; i<nTemp.length;i++) {
			if(nTemp[i]) {
				for(let j = 0;j<nTemp[i].length;j++) {
					negative.push(nTemp[i][j])
				}
			}
		}
	}

	// 将排好的结果 转化为数字，负数补上 负号
	for(let i = 0;i<negative.length;i++) {
		negative[i] = 0 - parseInt(negative[i])
	}

	for(let i = 0;i<positive.length;i++) {
		positive[i] = parseInt(positive[i])
	}

	// 依据不同的要求 输出结果
	if (order) {
		return negative.concat(positive);
	} else {
		return positive.concat(negative);
	}
} 

console.log(RadixSort(data,1))
```

结果虽然经过检测，但由于笔者才学疏浅，难免有些遗漏，如有问题，可以留言给我
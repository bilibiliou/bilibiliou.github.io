---
layout: post
title: 安利贴：如何使用protobuf
category: 技术
keywords: 技术,js
---

## 什么是protoBuf ?

protoBuf (PB) 我理解来说，就是一种`数据结构`，由google 团队开发

protoBuf 需要程序员实现制定 schema，然后根据 schema 生成二进制的数据。传输完成后，如果需要重新将这些数据，接收端还需要使用使用 schema 将获得到的二进制数据解码。

相对于JSON来说，编码解码的步骤比较繁琐，但是，protobuf 比 JSON 快

[test](https://github.com/dcodeIO/protobuf.js/blob/master/README.md#performance)

这是 dcodeIO 团队对 protobuf 和 native JSON 做了一些测试

从报告中可以看出，无论是编码解码还是结合的过程（
protobuf 从对象编码为二进制，从二进制数据解码为对象
JSON 通过JSON.stringify从对象编码为字符串，JSON 通过JSON.parse从字符串解为对象）

protobuf.js 相比于JSON来说都是较快的。但是，介于JSON的简单性和通用性，在多数场景下我们还是使用JSON

总的来说，PB有以下几个特点

1. 扩展性好，和语言平台无关，只要写好通用的schema文件，支持多种语言的编解码
2. 传输效率相对于JSON高
3. 需要预先填写schema文件（即.proto）
4. 不方便程序员调试（编码过程为二进制文件，不可读）
5. 比JSON有着严格的数据类型控制

## protobuf 语法

见 [[译]Protobuf 语法指南](http://colobu.com/2015/01/07/Protobuf-language-guide/#定义一个消息类型)

[ProtoBuf v3 指南](http://www.jianshu.com/p/e9d6af587cf6)

[google 文档](https://developers.google.com/protocol-buffers/docs/proto)

需要注意的是，.proto每一行语句结尾都需要写分号！

请先看完以上的文章，在看下面的demo

## javascript 环境下的使用

protoBuf 这种数据结构虽然在前端来说并不太实用，但是对于服务端之间的通讯来说还是十分实用的,下面我们举一个udp层通讯的例子来说明 在node环境下 PB的具体使用方式

我们创建三个文件 `server.js client.js schema.proto`

server.js 为发送端，它将数据发送给 client客户端

```js
/**
 * mock dataes
 */


let data = {
	name: 'Owen',
	age: 21,
	skills: {
		hobby: ['listen music', 'ride']
	},

	myFakeName: 'nickName',
	nickName: 'bilibiliou',

	myFirend: [{
		name: '风清扬',
		age: 45
	}, {
		name: 'pony me',
		age: 50
	}, {
		name: 'robin lea',
		age: 60
	}],
	foo: {
		'abc': 123,
		'acc': 456
	}
}

/**  ****  ****  ****  ****  ****  ****  **/

const dgram = require('dgram');
const protobuf = require('protobufjs');
const SEND_PORT = 8081;

// 建立udp连接
let socket = dgram.createSocket({
	type: 'udp4'
});

// 加载protobuf
let serverSchema = protobuf.loadSync('../protobuf/schema.proto');

// 从protobuf 中抽取实例
let um = serverSchema.lookupType('user_message.user');

// verify 为检测，根据schema检测数据是否有错误
let errMsg = um.verify(data);

if (errMsg) {
	throw Error(errMsg);
}

// 将数据编码为二进制
let buf = um.encode(um.create(data)).finish();

socket.on('error', err => {
	if (err) {
		throw Error(err);
	}

	socket.close();
});


// 发送二进制数据
socket.send(buf, SEND_PORT, err => {
	if (err) {
		throw Error(err);
	} else {
		socket.close();
		console.log('done');	
	}
})
```

client客户端 为接收端， 它根据和server端同样的 schema 。将接收到的数据解码出来，逻辑相对简单

```js
const dgram = require('dgram');
const protobuf = require('protobufjs');
const PORT = 8081;

let socket = dgram.createSocket({
	type: 'udp4'
});

// 和服务端逻辑相同
let clientSchema = protobuf.loadSync('../protobuf/schema.proto');
let um = clientSchema.lookupType('user_message.user');

socket.on('message', (buf, rinfo) => {
	console.log('>>>>>>>>', buf);

	let msg = um.decode(buf);

	// 必须加上 配置信息 否则无法解析出数据
	console.log('>>>>>>>>',um.toObject(msg, {
        longs: String,
        enums: String,
        bytes: String,
        defaults: true,
        arrays: true,
        objects: true,
        oneof: true
	}));
	socket.close();
});

socket.bind(8081);
```

这是我们事先定义好的.proto 文件

```proto
// package 为命名空间
package user_message;

syntax = "proto3";

message user {
	string name = 1;
	int32 age = 2;
	enum data_list {
		WEB = 1;
		IMAGE = 2;
		LOCAL = 3;
	}
	bool grender = 3;
	data_list list = 4 [default = WEB];
	Skill skills = 5;
	message Skill {
		// 数组类型
		string favorite = 1 [default = eat];
		repeated string hobby = 2 [default = abc];
	}

	oneof myFakeName {
		string nickName = 7;
		string petName = 8;
	}

	message firend {
		string name = 1;
		int32 age = 2;
	}

	repeated firend myFirend = 9;
	map<string, int32> foo = 10;	
}
```

下面我们重点介绍，proto 转 js对象 类型的一一对应

我们看定义的 data 

```js
let data = {
	name: 'Owen',
	age: 21,
	skills: {
		hobby: ['listen music', 'ride']
	},

	myFakeName: 'nickName',
	nickName: 'bilibiliou',

	myFirend: [{
		name: '风清扬',
		age: 45
	}, {
		name: 'pony me',
		age: 50
	}, {
		name: 'robin lea',
		age: 60
	}],
	foo: {
		'abc': 123,
		'acc': 456
	}
}
```

这是转化出来的结果

```js
{
	myFirend: [ { name: '风清扬', age: 45 },
     { name: 'pony me', age: 50 },
     { name: 'robin lea', age: 60 } ],
  	foo: { abc: 123, acc: 456 },
  	name: 'Owen',
  	age: 21,
  	grender: false,
  	list: 'WEB',
  	skills: { hobby: [ 'listen music', 'ride' ], favorite: 'eat' },
  	nickName: 'bilibiliou'
}
```

不难发现，其中

### enum

枚举类型，可以列举各种可能出现的形式，在填充的数据中只需要声明对应的索引即可

### default

如果设置 default 则最后出来的js对象会取proto定义好的默认值

### repeated

repeated 类型会被转化为数组

### message 和 map

而 message 和 map 则会被解析为了对象，
而 map 用法则较message来说更为特殊，它`无需你事先声明key`,

你只需要声明好对象内可能会出现的映射关系的类型即可

当然，如果你还可以配合map使用，即 message 内嵌套map,这样就可以构建很多复杂类型的数据结构了。

此外，而有些时候，我们的数据结构可能是这样的

```proto
map<string, repeated string>
```

但是 map 类型并不支持这样构造数据， 所以我们需要曲线救国一下，用以下的方式替代

```proto
message MapFieldEntry {
  key_type key = 1;
  repeated value_type value = 2;
}

repeated MapFieldEntry map_field = N;
```

### oneof

同时，上面还有一种有趣的数据结构是 oneof 

oneof类型，是为了`节省编译出来的二进制文件的体积`而设置的。

作用是，如果一个message中，某一项有多种不同类型的值就使用oneof 取其一。

```js
myFakeName: 'nickName'  // 首先要声明所需存储的key名
nickName: 'bilibiliou'  // key 所对应的value
```

如果是JSON存储这样，就避免了相关的数据冗余，为数据瘦身

```json
{
	nickName: 'bilibiliou',
	petName: ''
}
```
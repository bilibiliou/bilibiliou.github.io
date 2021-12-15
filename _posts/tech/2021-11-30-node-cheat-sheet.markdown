---
layout: post
title: NodeJs cheat sheet
category: 技术
keywords: 技术, js, javascript, nodeJs
---

## 获取当前执行运行环境的ipv4的地址

```js
import OS from 'os';

const getIPAddress = () => {
  const interfaces = Object.values(OS.networkInterfaces()).flat();
  for (let i = 0; i < interfaces.length; i++) {
    const { family, address, internal } = interfaces[i];
    if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
      return address;
    }
  }
  return '0.0.0.0';
};
```

## 简单的文件遍历算法

```javascript
const fs = require("fs");

const arr = [];
function travel(dirname, callback) {
    fs.readdirSync(dirname).forEach(function (file) {
    	const pathname = dirname + file + "/";
        if (fs.statSync(pathname).isDirectory()) {
            // 如果是文件夹，就继续遍历文件夹
            travel(pathname, callback);
        } else {
        	// 如果是文件的话，将文件名称传入回调函数，执行操作
            callback(pathname);
        }
    });
}

travel("需要遍历查询的文件夹名" , function(pathname){
	arr.push({"[文件路径]" : pathname});
});

console.log( arr );
```

该算法可以遍历一个文件夹，及其子文件内的全部文件并且，每遍历一个文件遍执行一次回调函数，通过这个遍历算法我们就可以比较方便的遍历并给被遍历的文件添加执行事件

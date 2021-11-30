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

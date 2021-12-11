---
layout: post
title: 前端接口层设计
category: 技术
keywords: 技术,js,接口层,websocket
---

## 通用接口层设计

前后端之间联调肯定需要受错误码规范的约束

前端将根据不同的错误码，进行响应回调

比较通用简单处理逻辑设计如下

```
接口层
  |__错误处理
  |  |__错误处理逻辑兜底（只要是错误，如果没有特殊处理，那么就执行兜底逻辑）
  |  |__错误码白名单可扩展
  |    |__ 可根据白名单自定义扩展逻辑（针对特殊的错误码，可配置特殊的处理逻辑）
  |    |__ 逻辑执行自定义阈值（默认为-1 只要后端报了多少该错误码的错误，就执行多少次回调）
  |  |
  |  |__全局的错误监听，使用 window.onerror 捕获 js 逻辑报错，用 window.addEventListener 捕获资源引用报错， 使用 unhandledrejection 事件捕获 异步Promise 的报错并分别进行上报
  |
  |__接口协议处理
  |  |__后端正常的JSON请求，返回并解析JSON,并对通用的数据结构进行解构
  |  |__处理特殊的流式响应（Excel、压缩包、录音）的下载，并进行解析，解析好后返回转化好的 ObjectURL 地址
  |  |__接口测速计算、上报
  |
  |__封装 request 方法供业务使用
  |  |__项目业务内部不允许使用 xxPost或xxGet 这样的表意方法，统一使用接口层封装好的 request({type: 'get'}) 方法
  |  |__针对不同公司的入参规范,对业务调用的request方法的入参规范化
  |  |__对请求进行节流，如果一段时间内（阈值待定）多次相同的请求同时发生，对请求进行并如一次（慎用）
  |
  |__初始化 websocket 实例（如需要），并同时配置ajax轮询兜底
```

![interface](/assets/img/interface.png)

```js
// 接口层针对不同type的回参进行响应

let { code } = response.body
// type 入参遵循 content-type 规范，常用如下
// text/plain
// application/zip
// application/vnd.ms-excel
// application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
// application/vnd.openxmlformats-officedocument.spreadsheetml.template
// application/vnd.ms-excel.sheet.macroEnabled.12
// application/vnd.ms-excel.template.macroEnabled.12
// application/vnd.ms-excel.addin.macroEnabled.12
// application/vnd.ms-excel.sheet.binary.macroEnabled.12
function downloadCommonHandler (type) {
  let filename = ''
  let downloadURL = ''
  if (!code) {
    let oBlob = response.body
    let oHeader = response.headers
    if (Object.prototype.toString.call(oBlob) === '[object Object]') {
      oBlob = JSON.stringify(oBlob)
    }
    let handleBlob = new Blob([oBlob], {type})
    let URL = window.URL || window.webkitURL
    downloadURL = URL.createObjectURL(handleBlob)

    if (oHeader.has('Content-Disposition')) {
      filename = /filename="?(.*)"?/i
        .exec(oHeader.get('Content-Disposition'))[1]
        /** 一般后端会进行encode 加密， 这里默认做解密处理 */
      filename = decodeURIComponent(filename)
    }
  }
  response.body = {code, filename, downloadURL}
}
```

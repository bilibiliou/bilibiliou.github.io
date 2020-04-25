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

## websocket

websocket 是全双工通信协议，可以理解为HTTP的升级版本，以下是websocket 比较经典的报文

```
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==
Sec-WebSocket-Protocol: chat, superchat
Sec-WebSocket-Version: 13
Origin: http://example.com
```

比起正常的HTTP请求头，websocket 多了这么些请求头

```
Upgrade: websocket
Connection: Upgrade

Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==

# Sec-WebSocket-Key 和 Sec-WebSocket-Accept 用于验证连接的有效性
# 只有当请求头参数Sec-WebSocket-Key字段的值经过固定算法加密后的数据和响应头里的Sec-WebSocket-Accept的值保持一致，该连接才会被认可建立。

Sec-WebSocket-Protocol: chat, superchat
# 客户端所支持的websocket协议 有哪些

Sec-WebSocket-Version: 13
# 告知服端 支持
```

而响应头如下

```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sMlYUkAGmm5OPpG2HaGWk=

Sec-WebSocket-Protocol: chat
# 最终连接将采用那种协议
```

当通过HTTP请求进行连接后，websocket 正式连接

### websoceket项目实践中踩的坑

前后端可以自由地互相推送消息，使用时需要注意以下几点：

1. websocket 连接处理不稳定 （特别是针对实时性要求比较高的，如通话、视频、监控等系统），在并发量大、连接数多的情况下，后台服务可能会出现丢包，丢状态（连接依然建立，但已失去对socket的管控）

2. websocket 需要对连接进行持续的维系，确保连接的实时建立

    2.1 这里做法采用方式是：每隔一段时间对后端发送一个心跳包，若后端响应了心跳则连接证明连接正常，若多次请求心跳后端都无响应，说明当前已经后端已经丢状态，但连接未终止，那么此时前端需主动断开连接，并尝试重连

3. 断线重连机制：前端需要针对websocket的不稳定性进行兜底，当连接失效后（如何判断见上文），需要尝试重新建立连接，多次重建连接后，若依然无法连接，针对一些重要的业务接口则需要进行ajax轮询兜底

    3.1 兜底只保证针对部分重要的接口进行轮询

4. 后端只通过websocket提供状态不提供数据，websocket不耦合增删改查的逻辑: 后端只告诉前端，某个接口需要更新了，但是不提供这个接口的数据，新数据由前端通过ajax请求主动的拉取
  

```js
// socket 处理机制

let websocketClient = {}
let rounds = 0 // 心跳包发送回合数
const heartCheck = {
  timeId: null,
  timeout: 30 * 1000,
  start () {
    let self = this
    /** 此处处理是在连接建立成功以后，
     * 不断心跳检测位置连接的有效性，
     * 如果已经失效了，就断开死链接，重新尝试重连
     * 此处的策略是
     * socket 连接开始后，会每隔 30s 发送一次心跳检测包
     * 正常情况下后端会及时响应
     * 极端情况下，不响应，则前端继续发送心跳检测包
     * 待发送回合超过5次后，前端主动断开连接，并执行重连 */
    this.timeId = setTimeout(function () {
      websocketClient.send(JSON.stringify({
        command: 'heartBeat'
      }))

      rounds++

      if (rounds >= 5) {
        console.log('websocket closed by Front side')
        websocketClient.close()
      }
    }, self.timeout)
  },
  reset () {
    rounds = 0
    clearTimeout(this.timeId)
    this.start()
  }
}

const delayReconectTimeout = 5 * 1000
const chatWebSocketAddress = `ws://${window.location.host}/socket`

let reConnecting = true
function RECONNECT_HANDLER () {
  if (reConnecting) {
    reConnecting = false
    console.log(`websocket will reconnect`)
    initWebSocket(true)
    /** 如果一段时间后依然没有建立好连接，则将锁回置 */
    /** 并再次尝试重连 */
    setTimeout(function () {
      if (!reConnecting) {
        reConnecting = true
        RECONNECT_HANDLER()
      }
    }, 10 * 1000)
  }
}

// 初始化websocket
function initWebSocket (isReconnect = false) {
  /** 如果是重连，则将原来的服务关闭，服务关闭以为着所绑定的事件也被关闭了 */
  /** 此时就需要将所有绑定的事件重新绑定一次（watch） */

  /** 如果是正在通话的任务，开启websocket,获取后续聊天内容 */
  websocketClient = new WebSocket(chatWebSocketAddress)
  /** 后端主动push 数据 */
  websocketClient.addEventListener('open', function () {
    console.log('websocket Connect now!')
    /** 后端要求，每次当连接成功后，前端就要发一个心跳包，以免后端检测不到 */
    websocketClient.send(JSON.stringify({
      command: 'heartBeat'
    }))
    reConnecting = true

    if (!isReconnect) {
      console.log('websocket first connect')
    }

    /** 心跳检测，只要后端有回包就重置冷却时间 和 回合数 */
    heartCheck.start()
    websocketClient.addEventListener('message', function () {
      heartCheck.reset()
    })
  })

  websocketClient.addEventListener('close', function () {
    console.log('websocket has been closed')
    /** 延时重连机制，当遇到问题时需要重连的时候，延时进行重连 */
    setTimeout(function () {
      RECONNECT_HANDLER()
    }, delayReconectTimeout)
  })

  websocketClient.addEventListener('error', function () {
    console.log('websocket error')
    RECONNECT_HANDLER()
  })
}

initWebSocket()

// Vue 的写法，使用 Vue.use(socket) 进行安装
export default {
  install (Vue) {
    Object.defineProperties(Vue.prototype, {
      $socket: {
        get() {
          return websocketClient
        }
      }
    })
  }
}
```

### ajax 轮询

```js
pollingRush () {
  /** 记录当前时间 */
  this.socketTimeout = Date.now()
  const timeoutDelay = this.globalStatus.loopTime
  /** 此处，如果超过 timeoutDelay 秒（ timeoutDelay 由后端配置）后端没有socket 推送，那么前端就要去主动轮询 */
  this.socketTimeId = setTimeout(() => {
    console.log('websocket did not push refresh sign, polling request by FE')
    this.requestSomething(true)
  }, timeoutDelay)
}

function requestSomething (updateBySocket) {
  if (updateBySocket) {
    /** 如果后端主动推送数据，那么取消轮询 */
    clearTimeout(this.socketTimeId)
  }
  // 正常的请求逻辑
  ...
}
```
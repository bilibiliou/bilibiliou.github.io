## 什么是Websocket

Websocket是一个HTML5下的一个新的协议,美名曰:浏览器与服务器全双工通信协议。
什么是全双工通信呢？如图

![websocket](/assets/images/websocket.png)

其实我们之前也是拥有一些技术来实现全双工通信的,比如说AJAX,但是实际上AJAX依靠的协议还是Http协议
而且由上图我们都知道Http协议的 request = respone 而AJAX依靠的也是通过不断的进行短时间的Http轮询
来实现客户端和服务端即时通信的。本质并没有改变。

但是,websocket协议 只要在客户端和服务器间建立起一次联系(握手) 就能不断的任意的请求和响应
从而实现request 可以!= respone

总结一下websocket的好处
1.因为需要建立一次联系,所以占用的资源会大幅减少
2.可以在客户端不请求的情况下也进行数据的推送( server push )

以下是websocket 比较经典的报文

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

## websoceket项目实践中踩的坑

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

## ajax 轮询兜底

当websocket 失效的时候，我们采用ajax轮询进行兜底

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

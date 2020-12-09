---
layout: post
title: HTTP 笔记
category: 技术
keywords: 技术
---

## HTTP 的作用

HTTP 不单单是一个应用层单纯的数据传输协议，其中还包括对安全、缓存策略、搜索引擎爬虫的控制

## HTTP 的方法有那些

GET 获取资源
POST 传输资源
PUT 更新资源
DELETE 删除资源
HEAD 获取报文首部
OPTIONS 预请求
TRACE 追踪

## HTTP 请求包括那几个部分？

HTTP 请求由 HTTP 请求行报文 HTTP 请求头报文 和 HTTP请求体报文 三部分组成

HTTP 请求行,表明了请求方法和请求地址

```
GET /shakespeare/v2/notes/450cc7320e30/book HTTP/1.1
```

## HTTP 1 的对头阻塞


如果没有管线化，那么就是
```
请求1 -> 响应1 -> 请求2 -> 响应2 -> 请求3 -> 响应3
```

HTTP1.1 中引入了 "管线化" 的概念，也就是允许一次发送多个HTTP请求

```
请求1 -> 请求2 -> 请求3 -> 响应1 -> 响应2 -> 响应3
```

而单次管线化的并发是由请求数量限制的，Chorme 限制为6次
而且 HTTP 响应的接收也必须按顺序进行接收，如果一个请求队列中，首个请求因为网络原因迟迟没有返回，那么其他的请求也因此进行阻塞

## HTTP 2.0 解决对头阻塞

HTTP 2.0 采用了多路复用的办法，将多个HTTP 请求复用一个TCP连接，一个TCP连接中拆分了多个流Stream, 多个流中又可以传输若干个消息Message,每个消息由最小的二进制帧Frame组成, 多个HTTP 请求就这样被拆分成了若干个Frame进行传输，这样就算有一个请求被阻塞了，也不会影响到其他请求的正常接收

同时，HTTP2.0 是基于 TCP 协议的，而TCP协议是可控的传输协议，会尝试进行重传

谷歌研究了一种实验性的协议，QUIC(Quick UDP Internet Connections),则是基于UDP+Http2的一个实验性的快速传输协议，UDP是面向数据报文的，所以遇到丢包的情况也不会进行重传，从而进一步减少网络延迟、解决队头阻塞问题。

## content-length

Content-Length, HTTP消息长度, 用十进制数字表示的八位字节的数目. 一般情况下, 很多工作都被框架完成, 我们很少去关注这部分内容, 但少数情况下发生了Content-Length与实际消息长度不一致, 程序可能会发生比较奇怪的异常：

1. 无响应直到请求超时
2. 请求被截断，并且下一个请求解析出现错乱

Content-Length是HTTP消息长度, 用十进制数字表示的八位字节的数目, 是Headers中常见的一个字段. Content-Length应该是精确的, 否则就会导致异常

如果这个长度不正确, 会发生如下情况:

### Content-Length > 实际长度

如果Content-Length比实际的长度大, 服务端/客户端读取到消息结尾后, 会等待下一个字节, 自然会无响应直到超时.

### Content-Length < 实际长度

如果这个长度小于实际长度, 首次请求的消息会被截取, 比如参数为param=helloworld, Content-Length为10, 那么这次请求的消息会被截取为: param=hell

如果连着两次进行请求，且开启了Connection: keep-alive 那么第一次消息被截断, 第二次请求信息会紊乱

如果连着两次进行请求，且开启了Connection: close 那么现象就是，每一次请求都被截断，但是不会产生解析紊乱

### content-length 不确定的情况

Content-Length首部指示出报文中实体主体的字节大小. 但如在请求处理完成前无法获取消息长度, 我们就无法明确指定Content-Length, 此时应该使用Transfer-Encoding: chunked

什么是Transfer-Encoding: chunked
数据以一系列分块的形式进行发送. Content-Length 首部在这种情况下不被发送. 在每一个分块的开头需要添加当前分块的长度, 以十六进制的形式表示，后面紧跟着 \r\n , 之后是分块本身, 后面也是\r\n. 终止块是一个常规的分块, 不同之处在于其长度为0.

### Summery

Content-Length如果存在且生效, 必须是正确的（如果漏传或不传都会出问题）, 否则会发生异常.(大于实际值会超时, 小于实际值会截断并可能导致后续的数据解析混乱)
如果报文中包含Transfer-Encoding: chunked首部, 那么Content-Length将被忽略.

## Content-Range

这个字段用于多线程分段下载的时候设置的响应头

e.g

```
Content-Range: bytes 0-2000/4932
```


如上例子，说明了 文件总大小为 4932 ，这一次 http 请求将传输 0到2000 这段数据

当进行多线程分段传输的时候，
content-type 就不会是原文件的mime类型
例如，我要传输一个 图片， 源文件的mime 类型是 image/png

正常情况下的响应头：
content-type: image/png
content-length: 4932

但是，如果我使用了多线程分段下载，设置了content-range 的时
content-type: multipart/byteranges
content-range: bytes 0-2000/4932


content-range 的取值有如下几种方式

Range: bytes=0-499 表示第 0-499 字节范围的内容 
Range: bytes=500-999 表示第 500-999 字节范围的内容 
Range: bytes=-500 表示最后 500 字节的内容 
Range: bytes=500- 表示从第 500 字节开始到文件结束部分的内容 
Range: bytes=0-0,-1 表示第一个和最后一个字节 
Range: bytes=500-600,601-999 同时指定几个范围


## Cache-Control

Cache-Control 这个字段是，请求头和响应头都会携带的，http 请求字段

### 作为请求端

在请求端中，Cache-Control 的值可以有：

| 字段名称 | 说明 |
|---------- |-------- |
| no-cache | 告知服务器不能直接使用强缓存，需要向原来的服务器发起请求重新加载资源，走协商缓存（重新请求后，服务端还是会对比eTag, 如果eTag 相同的话，还是会使用缓存文件 并返回304） |
| no-store | 所有的内容都不会保存到缓存或者Internet 临时文件中（无论什么情况下都不会使用缓存，也不会对比eTag） |
| max-age=delta-seconds | 告知服务端希望接受一个相对时间内资源缓存（常用，浏览器就算修改了本地时间，也不会影响，但是如果是expired 那么就是一个绝对时间，浏览器如果修改了本地时间，那么资源缓存的请求依然会收影响） |
| max-age=delta-seconds | 告知服务端希望接受的能容忍的最大过期时间。 就是超过max-age 后能依然容忍等待多长时间，max-age和max-stale在请求中同时使用的情况下，缓存的时间可以为max-age和max-stale的和 |
| min-fresh=delta-seconds | 告知服务端希望接受的一个小于 delta-seconds 内被更新的资源 |
| no-transform | 告知服务器，希望获得一个实体数据没有被转换过的资源 |
| only-if-cached | 告知服务器希望获取的缓存内容，而不用向原来的服务器发起请求 |
| cache-extension | 自定义扩展值，如果服务器不识别那么就会被忽略 |

### 作为服务端

在服务端中，Cache-Control 的值可以有：

| 字段名称 | 说明 |
|---------- |-------- |
| public | 任何情况下都要缓存该资源 |
| private[=field-name] | 表明，报文中的全部或者部分，仅开放给某些用户 服务器指定的 share-user 做缓存，而其他用户就不能使用这些缓存，如果没有指定特殊的field-name 那么就开放全部的用户 |
| no-cache | 不使用缓存 |
| no-transform | 告知客户端缓存文件时不能对缓存文件做任何改动 |

## X-Frame-option

该响应头用来给浏览器一个指示：是否允许允许 iframe 标签和object 标签

X-Frame-option 的值可以为：

DENY 页面中不允许展示iframe，即使是同域名的iframe嵌套，也不允许
SAMEORIGN 允许展示同域名的iframe
ALLOW-FROM[=url] 通过配置url, 允许指定的url的iframe进行嵌套

## Accept-Encoding

这个是请求头
用于告知给服务端，浏览器能够支持哪一种的压缩文件的算法

Accept-Encoding 可以传的值有：

```
gzip
表示采用 Lempel-Ziv coding (LZ77) 压缩算法，以及32位CRC校验的编码方式

compress
采用 Lempel-Ziv-Welch (LZW) 压缩算法

deflate
采用 zlib 结构和 deflate 压缩算法。

br
表示采用 Brotli 算法的编码方式。

identity
用于指代自身（例如：未经过压缩和修改）。除非特别指明，这个标记始终可以被接受。

*
匹配其他任意未在该请求头字段中列出的编码方式。假如该请求头字段不存在的话，这个值是默认值。它并不代表任意算法都支持，而仅仅表示算法之间无优先次序。
```

我们经常使用的是 gzip 的压缩方式，一般能够使传输

和 Accept-Encoding 配套使用的，是 content-encoding

## content-encoding

content-encoding 是服务端对浏览器端的响应头回参
用来通知浏览器端服务端所支持的压缩算法

## Referrer 和 Referrer Policy

Referrer 是HTTP请求头，表明了当前请求，是由那一个地址页面跳转过来的，用于指明当前流量的来源参考页面。通过这个信息，我们可以知道访客是怎么来到当前页面的。

而 Referrer Policy 是HTTP通用头，他表明了对Referrer 发送的策略

新的Referrer规定了五种策略：

  No Referrer：任何情况下都不发送Referrer信息

  No Referrer When Downgrade：仅当协议降级（如HTTPS页面引入HTTP资源）时不发送Referrer信息。是大部分浏览器默认策略。

  Origin Only：发送只包含host部分的referrer.

  Origin When Cross-origin：仅在发生跨域访问时发送只包含host的Referer，同域下还是完整的。与Origin 

  Only的区别是多判断了是否Cross-origin。协议、域名和端口都一致，浏览器才认为是同域。

  Unsafe URL：全部都发送Referrer信息。最宽松最不安全的策略。

## POST 和 GET的区别

GET在浏览器回退时是无害的，而POST会再次提交请求
GET产生的URL地址可以被收藏，而POST不可以
GET请求会被浏览器主动缓存，而POST不会，除非手动设置

GET请求只能进行url编码，而POST支持多种编码方式(为什么：主要原因就是URL中使用了非ASCII码造成服务器后台程序解析出现乱码的问题。)

GET请求参数会被完整的保留在浏览器历史纪录，而POST种的参数不会被保留
GET请求在URL中传送的参数是长度限制的，而POST没有限制
GET比POST更不安全，因为参数在URL上暴露，所以不能用来传递敏感信息
GET参数通过URL传递，POST数据既可以丢在URL后面也可以放在Request body中
对参数的数据类型，GET只接受ASCII字符，而POST没有限制

总结，浏览器会缓存GET提交，允许进行历史回滚，但是POST不行，POST进行回滚会再次提交请求

## keep-alive

keep-alive 是一个通用头，用于控制底层TCP的长链接

在Http 1.0中，Keep-Alive是没有官方支持的，但是也有一些Server端支持，这个年代比较久远就不用考虑了。

Http1.1以后，Keep-Alive已经默认支持并开启。客户端（包括但不限于浏览器）发送请求时会在Header中增加一个请求头Connection: Keep-Alive，当服务器收到附带有Connection: Keep-Alive的请求时，也会在响应头中添加Keep-Alive。这样一来，客户端和服务器之间的HTTP连接就会被保持，不会断开（断开方式下面介绍），当客户端发送另外一个请求时，就可以复用已建立的连接

如果没有声明 keep-alive 那么, 每次HTTP请求后都会断开底层的TCP链接，下一次请求后才会重新建立TCP连接

此处需要设置请求头：Connection: keep-alive
当服务端收到了Connection: keep-alive后
会返回

Connection: keep-alive
Keep-Alive: timeout = 5（秒）, max = 1000

timeout 是指http长连接能够维持的时长，最小单位是5秒
max 是指在连接关闭之前，在此连接可以发送的请求的最大字节。
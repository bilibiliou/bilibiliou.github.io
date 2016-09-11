---
layout: post
title: DIY 一个自己的 REPL 工具
category: 技术
keywords: 技术,nodeJs,repl
---

## 版本

以下实验均在 

* node version 6.2.0 
* npm version 3.8.6

下实验

## 什么是 REPL

作为一名程序员，你肯定是使用过REPL的，只不过它知道你，你却不知道它。

REPL 即 Read( 解读 ) Eval ( 求值 ） print ( 输出 ) Loop ( 循环 )

一个栗子让你明白什么是REPL：

比如一个计算机的小程序

```markdown

输入： add 1 1     

计算机分析求值

输出 2

然后我们再输入 mul 1 2 

计算机分析求值

输出 2

... (loop)

```

以上三个步骤 分别对应 read 、eval、 print

多次数据的输入即 loop 

## 如何diy 自己的 REPL

想做一个REPL 非常简单

简单的实现方式, 直接使用一个 while(true) 然后不断接受输入的参数来实现

而今天我们讨论的是如何写一个复杂点的REPL

## 目标

基于node 提供的repl 基础模块，DIY 一个 自己 REPL，并且能实现自动初始项目的各种module

## 具体细节

node 下已经给我们提供了 repl module 的基础模块，我们可以依靠这个基础模块来DIY 一个属于自己的repl应用

我们使用start 方法，可以开启一个repl 工具

```js
const repl = require("repl"),
      pid  = process.pid

let replServer = repl.start({
        prompt: `process ${pid} is running >>> `
    })
```

当开启了这个工具后，当前进程就被阻塞了，我们可以输入一些node 指令来试试

```shell
D:\NodeJs\test\repl>node diy_repl.js
process 5392 is running >>> 1 + 1
2
process 5392 is running >>> Math.PI / 2
1.5707963267948966
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
5
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
4
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
3
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
4
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
2
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
2
process 5392 is running >>> Math.floor(Math.random() * 5 + 1);
4
process 5392 is running >>> console.log("i am Owen");
i am Owen
undefined
```

不难可以发现，repl 每一次都一定会有一个输出值，如果执行一个函数，没有设定return 那么返回值就是 undefined

基于repl 模块，有两种自定义命令的方式，
    
* Context
* defineCommand

### context

context 是一个对象，他下面的成员可以保存各种类型的值，当我们在命令行中输入成员名，
就能返回这些值

```js
const repl = require("repl"),
      test = (obj) => Object.prototype.toString.call(obj),
      pid  = process.pid

let replServer = repl.start({
        prompt: `process ${pid} is running >>> `,
        writer: (param) => {
            if (test(param) === "[object String]") {
                return param.toLowerCase();
            }

            return param;
        }
    })

const setContext = (context, param) => {
    switch (test(param)) {
        case "[object Array]": 
            param.forEach((v) => {
                context[v.command] = v.value
            })
        break;

        default: 
            context[param.command] = param.value;      
    }
}

setContext(replServer.context, [{
    command: "m",
    value: "HELLO HELLO HELLO"
}, {
    command: "calc",
    value: () => `1 + 1 = ${1+1}`
}])

```

我们设定了一个 命令 “m” 当我们在命令行中输入m 的时候 会将我们设定值
"HELLO HELLO HELLO" 返回

我们还设定了一个命令 calc 当我们在命令行中输入calc() 的时候能将计算额值返回

```shell
D:\NodeJs\test\repl>node diy_repl.js
process 8336 is running >>> m
hello hello hello
process 8336 is running >>> calc()
1 + 1 = 2
```

这里有一个细节，就是在 start 传递的 设置对象中，我们可以设置 writer 函数

writer 函数相当于一个中间代理，输出的值，先会走到这个函数下，再进行输出

在writer 中我们处理的输出值，将大写的HELLO 转化为了小写的hello

当然，还有很多初始设置的值，这里就不一一列举，同学们可以自行看[文档](https://nodejs.org/dist/latest-v6.x/docs/api/repl.html)

还有就是 calc 返回的只是一个函数，如果我们直接输入 calc 不加上()的话，只会返回函数，而不会返回计算后的值

### defineCommand

我们可以使用defineCommand 来执行一条命令

和context 不同的是

1. 执行命令的方式为 .xxx 需要在前面添加 .符号
2. 执行defineCommand 命令后会自动执行对应的函数，无需加()
3. defineCommand 可以设置帮助提醒，当我们执行.help 的时候会弹出帮助提醒
4. 系统提供了几个默认命令
    * .clear : 清除所有我们自己定义的Context
    * .exit  : 关闭REPL 效果等同 ctrl + d
    * .help  : 弹出帮助提醒
    * .save  : 将执行过的命令 保存到某个文件
    * .load  : 将某个文件中保存的命令执行，类似 批处理文件的功能
    * .break : 中断命令， 效果类似 ctrl + c

和context 相比是相对更加完善的命令机制

其中不得不提 简单提提save 和 load 命令

```js
process 13548 is running >>> m
hello hello hello
process 13548 is running >>> 1 + 1
2
process 13548 is running >>> Math.random()
0.3750397499375657
process 13548 is running >>> .save lang
Session saved to:lang
```

当我们执行完一系列的命令后，可以使用save 保存到lang 文件中

让我们看看lang 文件中存了什么？

```markdown
1 + 1
Math.random
m
1 + 1
Math.random()
```

我们再用load lang试试？

```shell
D:\NodeJs\test\repl>node diy_repl.js
process 12632 is running >>> .load lang
process 12632 is running >>> 1 + 1
2
process 12632 is running >>> Math.random
function random() { [native code] }
process 12632 is running >>> m
hello hello hello
process 12632 is running >>> 1 + 1
2
process 12632 is running >>> Math.random()
0.4068562508475533
```

自动将我们刚刚执行的命令又执行了一遍

想想，我们可以预先制定一个文件保存命令，然后需要用的时候， 直接就 .load xxx  很方便吧？

我们可以来自己试着定义一个 defineCommand

```js
replServer.defineCommand("cls", {
    help: "我是勤劳的清屏方法",
    action: () => {
        let stdout = "";

        if (!/^win/.test(process.platform)) {
            stdout += "\033[2J";
        } else {
            let lines = process.stdout.getWindowSize()[1];

            for (let i=0; i<lines; i++) {
                stdout += "\r\n";
            }
        }

        // Reset cursur
        stdout += "\033[0f";

        process.stdout.write(stdout);
    }
})
```

这个方法可实现 cls 清屏的效果，因为系统默认并没有给我们提供.cls 方法

其中传递了两个参数 help 和 action 

```shell
process 6872 is running >>> .help
break   Sometimes you get stuck, this gets you out
clear   Break, and also clear the local context
cls     我是勤劳的清屏方法
exit    Exit the repl
help    Show repl options
load    Load JS from a file into the REPL session
save    Save all evaluated commands in this REPL session to a file
```

当我们使用默认的.help 方法后不难发现 我们定义的 help 提示出现在了列表中

action 就是定义我们要执行的功能了 当执行.cls 后自动会执行action

## 实现自动安装模块功能

上文都是谈论一些基础的API，而这小节。我们主要讨论，如何在repl 中能做一些有用的事，比如自动npm install

大家估计有一个痛点，每次安装模块的时候，都要 npm install xxx xxx xxx 

一个小项目 如果还有webpack 之类的loader + gulp 之类的plugin 大概下来能有十多个模块需要安装，这样手动的安装 模块较为繁琐浪费时间

所以我们可以自己弄一个自动安装模块的工具，基于REPL

```js
const repl = require("repl"),
      child = require("child_process"),
      path = require("path"),
      test = (obj) => Object.prototype.toString.call(obj),
      pid  = process.pid

let replServer = repl.start({
        prompt: `process ${pid} is running >>> `
    })


replServer.defineCommand("babel", {
    help: "我是勤劳的自动安装babel 的各种模块的方法",
    action: () => {
        const execute = /^win/.test(process.platform) ? 
            "npm.cmd" :
            "npm";

        const which = ["install", "babel-preset-es2015", "babel-preset-react", "--save"]

        let cp = child.spawn(execute, which, {
                env: process.env,
                stdio: 'inherit',
                cwd: __dirname
            }
        )    

        cp.on("error", (err) => {
            console.log(`child_process has some Errors \n >>> ${err}`);
        })   

        cp.on("exit", () => {
            console.log(`child_process has finished ^_^`);
        })

        return "Executing install babel command now !"
    }
})
```

这里我们开辟了一个子进程，在子进程里面 install babel 下的各种模块

中间不乏有许多坑 例如在window 下 执行npm的程序名叫 npm.cmd 而非 npm

spawn 需要定义cwd 、env 和 stdio 才能正常工作 等等 当然排坑过程需要我们自己处理，这也是成长的过程

## 后记

这里只是一个示范，教会大家利用REPL ，再加上笔者水平较low，艺术细胞不足，想不到一些很有范儿的栗子，这里将创想的画笔留给读者，一起利用REPL 玩出更多精彩。


## 感谢

[node_module_repl](https://nodejs.org/dist/latest-v6.x/docs/api/repl.html)
---
layout: post
title: 手撕数据劫持代码
category: 技术
keywords: 技术
---

## 手写简单的数据劫持

![shotpic](/assets/img/data-hijack.png)

逻辑上来说，如果我们对一个普通对象的数据进行数据劫持，大概是这样的一些思路，下面的代码，只是我对Vue源码关于数据劫持双向绑定的简单理解，代码是我个人手写的，难免可能会有错误

实际上，Vue内部源码还有 compile 阶段，compile 阶段做的是对Vue 模板的解析和对 watcher 实例View渲染更新和处理逻辑的声明，此处为了方便理解，会掠过comile阶段

假设我们的对象是一个很简单的结构：

```js
{
  a: 1,
  b: 2,
  c: 3
}
```

1. 开发一个 发布/订阅 器Dep， Dep(depot 仓库) 中收集的是 Watcher 的实例
2. 遍历 object 的所有字段，每个字段都实例化一个Dep, 在字段属性的 set 和 get 回调中：添加处理逻辑
3. 每当对象属性被 set 了，对比新旧数据是否相同，如相同则不做处理，如果不同，就执行 dep.notify 的方法，这个方法会通知所有的 watcher 实例执行 update
4. 每当 对象属性被 get 了（在Vue 组件中被引用到了），就会实例化一个 watcher 并添加watcher 的更新逻辑
5. 如果不需要在对象进行监听了，可以在 Vue data 阶段对某一个对象进行 Object.freeze,那么在 observer 的时候就不会对这个对象进行数据劫持

```js
function Dep () {
  this.subs = []
}

Dep.prototype.addSub = function (sub) {
  // 这里的sub 实际上是一个 Watcher 的实例
  this.subs.push(sub)
}

Dep.prototype.notify = function () {
  // 通知所有的 watcher 实例，执行 update 方法
  this.subs.forEach(sub => sub.update())
}

function Watcher (fn) {
  // 这里的watcher 只是简单透传了 update 后的回调
  // 实际上在正常的MVVM模型中（这里不讨论 virtual DOM）
  // 例如 <div>{{ obj.a }}</div>
  // 会拿到 div 的原生的element 对象
  // 并执行 node.textContent = newVal 类似这样的更新逻辑
  this.fn = fn
}

Watcher.prototype.update = function () {
  this.fn && this.fn()
}

// 数据劫持
class Observer {
  constructor (obj) {
    this.observer(obj)
  }

  observer (target) {
    if (target && typeof target === 'object') {
      for (var key in target) {
        this.defineRective(target, key, target[key])
      }
    }
  }

  defineRective (target, key, value) {
    var dep = new Dep()
    Object.defineProperty(target, key, {
      set (newVal) {
        if (newVal !== value) {
          value = newVal
          // 当设置了新的值之后，通过 notify 进行通知所有使用了
          // 这个变量的地方
          dep.notify()
        }
      },

      get () {
        // 此处当用到了这个值的时候，就需要添加 watcher 实例到 dep 中
        var w = new Watcher(() => {
          console.log(`值${value} 已更新了，需要更新视图View`)
        })
        dep.addSub(w)
        return value
      }
    })
  }
}

var obj = {
  a: 1,
  b: 2,
  c: 3
}
var ObserverInstance = new Observer(obj)

// 此处只是简单地模拟了 compile 阶段添加引用的过程
// 实际中，Vue 是通过 compile 阶段解析Vue模板
// 例如 <div>{{ obj.a }}</div>
// 通过解析阶段 读取（get） 到obj.a, 这时候就添加上了一个 watcher 实例
obj.a
obj.b
obj.c
obj.a

obj.a = 3
```

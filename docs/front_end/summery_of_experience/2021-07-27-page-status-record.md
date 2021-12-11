# 如何根据页面的各项指标来确定资源的加载策略

随着移动互联网的兴起，很多应用都移动化，对于网页的极致优化的要求也越来越高
对于用户所加载的一切资源（图片、视频、音频）我们可以指定一个加载策略，根据用户的网速、设备性能，
决定加载资源的质量，或者不加载某些资源，甚至采用降级（视频降级为图片，音频降级为文字）
从而实现各个程度上的体验优化

### 获取网络指标

Navigator.connection 是新标准中的一个实验性的功能，能够返回一个对象来返回当前用户访问页面的时候网络的状态信息

downlink 表示有效带宽的估计值，单位是 Mbit/s

effectiveType 表示当前的网络类型，可选的返回值为 slow-2g、 2g、 3g、 4g

rtt 表示有效的往返时间估计，单位是 ms。

其他细节可以参考[这个文档](https://wicg.github.io/netinfo/#networkinformation-interface)

我们可以通过 downlink 来对当前用户的网速情况进行一个评估

用 fast(快)、 middle(正常)、 slow(慢)、 和 unknown(未知) 四个评级来粗略衡量当前用户网络质量

我们以 1.5M/s 和 0.4M/s 阈值作为标准，这个两个网速也分别代表了 chrome 浏览器 Throttling(限流器)常用的两个值，Fast 3G 和 Slow 3G

```
如果用户的当前的有效带宽高于 1.5M/s 我们则认为用户当前网速情况比较快

如果用户的当前的有效带宽小于 1.5M/s 但高于 0.4M/s 我们则认为用户当前网速情况比较理想

如果用户的当前的有效带宽小于 0.4M/s 我们则认为用户当前网速情况比较糟糕
```

目前兼容情况：

| 浏览器/移动操作系统 | 浏览器支持版本 | 出场时间 |
| :----: | :----: | :----: |
| chrome | 61+ | 17年9月5日 |
| Edge | 79+ | 20年1月15日 |
| Opera | 48+ | 17年9月20日 |
| Android | 4.4+ | 14年1月2日 |
| iOS | 暂不支持 | —————— |
| Firefox | 暂不支持 | —————— |
| Safari | 暂不支持 | —————— |
| IE | 暂不支持 | —————— |


下面就可以简单封装一个粗估网络状态的函数

```ts
const NETWORK_DOWNLINK = {
  MIN_FAST: 1.5,
  MIN_MIDDLE: 0.4
};
export type NetworkStatus = "fast" | "middle" | "slow" | "unknown";
export const getNetworkStatus = (() => {
    let networkStatus: NetworkStatus;
    return () => {
        if (!networkStatus) {
          const connection = (navigator as any)?.connection
          if (connection) {
            const { downlink } = connection;
            if (downlink > NETWORK_DOWNLINK.MIN_FAST) {
              networkStatus = "fast";
            } else if (downlink > NETWORK_DOWNLINK.MIN_MIDDLE) {
              networkStatus = "middle";
            } else {
              networkStatus = "slow";
            }
          }
        } else if (!isMobile()) {
          // 如果当前浏览器不支持这个 navigator.connection 属性
          // 且是pc端的话，则默认为 fast
          networkStatus = "fast";
        } else {
          networkStatus = "unknown";
        }
      }
      return networkStatus;
    };
})();
```

### 如何获取设备性能

我们将用户的当前设备的性能也可以做一个初略的估计
例如用户的系统版本如果比较低，用户的手机屏幕的设备像素比(dpr)如果比较低的话，可以基本推断当前用户的手机是一个比较低端的机器

我们把性能评级分为 high(高性能)、 middle(正常性能)、 low(性能较差) 三个评级
我们认为：

```
如果用户的手机是安卓手机，且系统版本高于 9 以上，dpr 高于 2.7 以上则为高性能设备

如果用户的手机是安卓手机，且系统版本高于 7 以上，dpr 高于 2 以上则为中等性能设备

否则手机为低端机

如果用户的手机是苹果手机，且系统版本高于 13 以上，dpr 高于 2 以上则为高性能设备

如果用户的手机是苹果手机，且系统版本高于 10 以上，dpr 高于 1.5 以上则为中等性能设备

否则手机为低端机

如果是 pc 电脑则默认是高端设备
```

则有下面的代码

```ts
const PERFORMANCE_SYSTEM_VERSION = {
  ANDROID: {
    MIN_HIGH: 9,
    MIN_MIDDLE: 7,
  },
  IOS: {
    MIN_HIGH: 13,
    MIN_MIDDLE: 10,
  },
};
const PERFORMANCE_PIXEL_RATIO = {
  ANDROID: {
    MIN_HIGH: 2.7,
    MIN_MIDDLE: 2,
  },
  IOS: {
    MIN_HIGH: 2,
    MIN_MIDDLE: 1.5,
  },
};

function getMajorVersionByUA() {
  if (isAndroid()) {
    const reg = /Android [\d+.]{1,5}/i.exec(navigator.userAgent);
    if (reg && reg[0]) {
      return parseInt(reg[0].replace("Android ", "").split(".")[0], 10);
    }
  } else {
    const reg = /OS.*?(\d+)_(\d+)_?(\d+)?/.exec(navigator.userAgent);
    if (reg) {
      return parseInt(reg[1], 10);
    }
  }

  return 0;
}

export type Performance = "high" | "middle" | "low";
export const getPerformanceStatus = (() => {
  let performanceStatus: Performance;
  return () => {
    if (!performanceStatus) {
      if (isMobile()) {
        // 移动端借助系统版本号 & 像素比判断
        const majorVersion = getMajorVersionByUA();
        const mobileType = isAndroid() ? "ANDROID" : "IOS";
        if (
          majorVersion >= PERFORMANCE_SYSTEM_VERSION[mobileType].MIN_HIGH &&
          window.devicePixelRatio >=
            PERFORMANCE_PIXEL_RATIO[mobileType].MIN_HIGH
        ) {
          performanceStatus = "high";
        } else if (
          majorVersion >= PERFORMANCE_SYSTEM_VERSION[mobileType].MIN_MIDDLE &&
          window.devicePixelRatio >=
            PERFORMANCE_PIXEL_RATIO[mobileType].MIN_MIDDLE
        ) {
          performanceStatus = "middle";
        } else {
          performanceStatus = "low";
        }
      } else {
        // PC端默认为高端机
        performanceStatus = "high";
      }
    }
    return performanceStatus;
  };
})();
```

### 结合 网络性能和设备性能给资源评级

上述我们可以得到当前用户的网络性能和设备性能，这样我们就可以根据两者来评估一个加载资源评级
我们用 BETTER(可获取优质资源)、 MIDDLE(正常资源)、 WORSE(采用降级方案) 分别表示用户需要加载高 中 低 质量的资源（图片、视频、音频）

```ts
export const getResourceType = (
  network: NetworkStatus,
  performance: PerformanceStatus
) => {
  switch (performance) {
    case "high": {
      switch (network) {
        case "fast":
        case "middle":
        case "unknown": {
          return "BETTER"; // 端外设备中不兼容 navigator.connection 的情况大概率是苹果
        }
        case "slow": {
          return "MIDDLE";
        }
        default: {
          return "WORSE";
        }
      }
    }
    case "middle": {
      switch (network) {
        case "fast":
        case "middle":
        case "unknown": {
          return "MIDDLE";
        }
        default: {
          return "WORSE";
        }
      }
    }
    default: {
      return "WORSE";
    }
  }
};
```

### 根据资源的评级对加载的资源进行分类

我们根据资源的评级分别上传到不同的cdn, 并确定 cdn 的前缀，加载资源的时候根据前缀来拼接最终的url, 得到合理的资源加载策略。

```ts
export const resource = {
  BETTER: {
    url_perfix: '/better_resource/',
    need_downgrade: false,
    其他的涉及资源加载的参数，视业务场景自定义
  },

  MIDDLE: {
    url_perfix: '/middle_resource/',
    need_downgrade: false,
    其他的涉及资源加载的参数，视业务场景自定义
  },

  WORSE: {
    url_perfix: '/worse_resource/',
    need_downgrade: true,
    其他的涉及资源加载的参数，视业务场景自定义
  }
}
```

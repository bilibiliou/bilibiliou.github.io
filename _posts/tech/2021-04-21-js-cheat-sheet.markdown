---
layout: post
title: Js cheat sheet
category: 技术
keywords: 技术, js, javascript
---

## 基于 ts 简单封装一下获取 dom 节点的方法

```ts
export const $ = (v: string, d?: HTMLElement | Document) => {
  d = d || document;
  return d.querySelector(v) as HTMLElement;
};

export const $$ = <T extends unknown>(
  v: string,
  d?: HTMLElement | Document
) => {
  d = d || document;
  return Array.from(d.querySelectorAll(v)) as T[];
};
```

## base64 转文件

```ts
function base64toFile(base64: string, filename: string) {
  const arr = base64.split(",");
  // compatible with "data:image/jpeg;base64" or "image/jpeg;base64"
  // get correctly mime type
  const mime = arr[0]!.match(/(data:)?(.*?);/)![2];
  const bstr = atob(arr[1]);

  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
```

## 封装对象数组去重

```js
/*
 * arr 待去重数组
 * key 索引
 * 返回一个新函数
 */
function removeMultiple<T>(arr: Array<T>, key: string | number): Array<T> {
  if (!arr) {
    return [];
  }

  return [...new Set(arr.map((item) => item[key]))].map((mainKey) =>
    arr.find((item) => item[key] === mainKey)
  );
}
```

```ts
// 这种方式可读性更高
export function dedupeList<T>(list: T[], id: (i: T) => string) {
  const existed = {};
  for (let index = list.length - 1; index >= 0; index--) {
    existed[id(list[index])] = index;
  }

  return list.filter((i, index) => index === existed[id(i)]);
}
```

## 函数式更新数组

```js
/*
 * source 需要处理的数组，返回一个新的数组副本
 * test 判断函数，返回boolean 判断是否需要对其更新
 * update 更新函数，用于对，对应位置的数组项进行更新
 */
function updateArray<T>(
  source: T[],
  test: (i: T) => boolean,
  update: (t: T) => T
) {
  return source.map((item) => (test(item) ? update(item) : item));
}
```

## 时间格式化

函数式格式化时间，暴力美学

```js
function formatDuration(ms = 0, fmt = "hh:mm:ss") {
  const fmts = {
    hh: (v) => v,
    mm: (v) => (v >= 10 ? v : `0${v}`),
    ss: (v) => (v >= 10 ? v : `0${v}`),
  };

  const values = {
    // 36e5 === 36 * 10^5 === 3600000 and so on
    hh: ms >= 36e5 ? Math.floor((ms / 36e5) % 24) : 0,
    mm: ms >= 6e4 ? Math.floor((ms / 6e4) % 60) : 0,
    ss: Math.ceil((ms / 1e3) % 60),
  };

  const format = (s) => (fmts[s] ? fmts[s](values[s]) : s);

  return fmt.split(":").map(format).filter(Boolean).join(":");
}
```

## 将 a 区间 的 区间值 进行映射 到 b 区间

数值上的区间映射

```js
// 例如将 0 - 255 中的 100 映射 到 0 - 1
function map(s, a1, a2, b1, b2) {
  return ((s - a1) / (a2 - a1)) * (b2 - b1) + b1;
}
map(100, 0, 255, 0, 1); // 0.39
```

## 如何将数字转变为银行金额

```js
Number.prototype.thousandth = function () {
  return `${this}`.replace(/\d{1,3}(?=(\d{3})+$)/g, "$&,");
};
```

## 数字金额转中文金额

e.g:
输入: 12346
输出: 一十二万三千四百五十六

```ts
const chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
const chnUnitChar = ["", "十", "百", "千"];

export function number2Chinese(num) {
  const section2Chinese = function (section) {
    let strIns = "";
    let chnStr = "";
    let unitPos = 0;
    let zero = true;

    while (section > 0) {
      const v = section % 10;
      if (v === 0) {
        if (!zero) {
          zero = true;
          chnStr = chnNumChar[v] + chnStr;
        }
      } else {
        zero = false;
        strIns = chnNumChar[v];
        strIns += chnUnitChar[unitPos];
        chnStr = strIns + chnStr;
      }
      unitPos++;
      section = Math.floor(section / 10);
    }

    return chnStr;
  };

  let unitPos = 0;
  let strIns = "";
  let chnStr = "";
  let needZero = false;

  if (num === 0) {
    return chnNumChar[0];
  }

  while (num > 0) {
    const section = num % 10000;
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = section2Chinese(section);
    strIns += section !== 0 ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = section < 1000 && section > 0;
    num = Math.floor(num / 10000);
    unitPos++;
  }

  return chnStr;
}
```

## 获取当前元素，距离根节点的距离

```ts
const getPosition = (element) => {
  const currentTop =
    window.pageXOffset !== undefined
      ? window.pageXOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollLeft;
  const currentLeft =
    window.pageYOffset !== undefined
      ? window.pageYOffset
      : (document.documentElement || document.body.parentNode || document.body)
          .scrollTop;

  if (element) {
    if (element.getBoundingClientRect) {
      const { top, left } = element?.getBoundingClientRect();
      return { x: left + currentLeft, y: top + currentTop };
    } else {
      // polyfill
      let xPosition = 0;
      let yPosition = 0;

      while (element) {
        xPosition +=
          element.offsetLeft - element.scrollLeft + element.clientLeft;
        yPosition += element.offsetTop - element.scrollTop + element.clientTop;
        element = element.offsetParent;
      }
      return { x: xPosition, y: yPosition };
    }
  }

  return {
    x: 0,
    y: 0,
  };
};
```

## 比较两个版本号的大小

```ts
import compare from "semver-compare"; // 调用 semver-compare 这个库

type Compare = (a: string, b: string) => boolean;

// 大于 >
export const gt: Compare = (a, b) => compare(a, b) === 1;

// 小于 <
export const lt: Compare = (a, b) => compare(a, b) === -1;

// 等于 =
export const eq: Compare = (a, b) => compare(a, b) === 0;

// 大于等于 >=
export const ge: Compare = (a, b) => gt(a, b) || eq(a, b);

// 小于等于 <=
export const le: Compare = (a, b) => lt(a, b) || eq(a, b);
```

或者，自己写一个

```ts
let semverCompare = function cmp(a: string, b: string) {
  let pa = a.split(".");
  let pb = b.split(".");
  for (let i = 0; i < 3; i++) {
    let na = Number(pa[i]);
    let nb = Number(pb[i]);
    if (na > nb) {
      return 1;
    }
    if (nb > na) {
      return -1;
    }
    if (!isNaN(na) && isNaN(nb)) {
      return 1;
    }
    if (isNaN(na) && !isNaN(nb)) {
      return -1;
    }
  }
  return 0;
};

// greater than >
export const gt = function (a: string, b: string) {
  return semverCompare(a, b) === 1;
};
// less than <
export const lt = function (a: string, b: string) {
  return semverCompare(a, b) === -1;
};
// qeual to =
export const eq = function (a: string, b: string) {
  return semverCompare(a, b) === 0;
};
// greater than or equal to >=
export const ge = function (a: string, b: string) {
  return gt(a, b) || eq(a, b);
};
// less than or equal to <=
export const le = function (a: string, b: string) {
  return lt(a, b) || eq(a, b);
};
```

## 处理 url query 部分

```typescript
// schema参数拼接，将 对象解析成 query字符串，并编码
export function stringifyQuery(params: Params) {
  const pairs = Object.keys(params).map((k) => {
    // 如果传入的键值对没有值则为空
    if (typeof params[k] === "undefined") {
      return "";
    }
    return `${k}=${encodeURIComponent(params[k])}`;
  });

  return pairs.filter(Boolean).join("&");
}

// 输入url或者deeplink，插入query
export function appendQuery(schema: string, params: Params) {
  const [main, hash] = schema.split("#");
  const [base, _qs = ""] = main.split("?");

  const query = _qs.split("&").reduce((r, kv) => {
    const [k, v = ""] = kv.split("=");
    return { ...r, [k]: decodeURIComponent(v) };
  }, {});

  const qs = stringifyQuery({ ...query, ...params });

  return `${base}${qs ? `?${qs}` : ""}${hash || hash === "" ? `#${hash}` : ""}`;
}
```

## 检测某种 css 属性在浏览器中是否可用

```ts
export const checkCssSupport = (cssProp: string, cssValue: string) => {
  const prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
  if (CSS && CSS?.supports) {
    return prefixes.some((prefix) => CSS.supports(cssProp, prefix + cssValue));
  }

  const el = document.createElement("a");
  const mStyle = el.style;
  mStyle.cssText = prefixes
    .map((prefix) => `${cssProp}:${prefix}${cssValue};`)
    .join("");

  return mStyle[cssProp]?.indexOf(cssValue) !== -1;
};
```

## 检测当前浏览器是否能够使用 webp 格式

```ts
import fuckIE from "fuck-ie";
// fuckIE 检测 ie 7 8 9
// trident 内核检测 ie 10 11
export const isIE = isAnyVersionOfIE || /trident/i.test(ua);

const checkWebpSupported = (() => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      // 判断当前用户浏览器webp格式是否支持
      let isSupported = false;
      let probe = new Image();
      probe.onload = function () {
        isSupported = probe.height === 2;
        // safari 浏览器的对 webp 的兼容不稳定，并发加载出现过图片加载不出来的问题
        resolve(isSupported && !isSafari);
      };
      probe.src =
        "data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA";
    } catch (e) {
      reject(false);
      throw new Error(e);
    }
  });
})();

export const isWebpSupported =
  !isIE && (async () => await checkWebpSupported)();
```

## 开启 webgl 高性能绘制

```ts
/**
 * 开启webgl高性能绘制，可能会进行GPU切换，导致0.5s~1s的卡顿
 */
export const enableHighPerformanceRendering = (() => {
  let webglContext: any;
  return () => {
    if (!webglContext) {
      const canvas = document.createElement("canvas");
      const option = {
        powerPreference: "high-performance",
      };

      webglContext =
        canvas.getContext("webgl", option) ||
        canvas.getContext("experimental-webgl", option);

      requestAnimationFrame(() => {
        webglContext?.clear(0);
      });
    }
  };
})();
```

## 解析 markdown 超链接语法

经常产品有运营配置要求，输入一个字符串，有可能是链接或者文本
我们可以借鉴 markdown 的超链接规则，但是不能照搬其他语法
也不想引入库

```ts
const strs = [
  "这个问题很简单，去[百度一下](https://www.baidu.com/)把",
  "中国视频网站主要有 [B站](https://www.bilibili.com/) [爱奇艺](https://www.iqiyi.com/) [优酷](https://www.youku.com/) 等几家",
  "我们去踩点蘑菇把",
];

const formatTxts = (configTips: string[]) =>
  configTips.map((tip) => {
    const reg = /(\[[^\]]*\])(\([^\)]*\))/g;
    const matchResult = tip.match(reg);
    if (matchResult) {
      const txts = tip.split(reg);
      const result = [];
      for (let i = 0; i < txts.length; ) {
        const p = txts[i];
        const n = txts[i + 1];
        const reg2 = /^\[[^\]]*\]$/g;
        const reg3 = /^\([^\)]*\)$/g;
        if (reg2.test(p) && reg3.test(n)) {
          result.push({
            tip: p.replace(/(^\[)|(\]$)/g, ""),
            link: n.replace(/(^\()|(\)$)/g, ""),
          });
          i += 2;
        } else {
          if (p) {
            result.push({ tip: p });
          }
          i++;
        }
      }

      return result;
    }

    return [{ tip }];
  });

formatTxts(strs);

/*
[
  [
    {tip: "这个问题很简单，去"}
    {tip: "百度一下", link: "https://www.baidu.com/"}
    {tip: "把"}
  ],
  [
    {tip: "中国视频网站主要有 "}
    {tip: "B站", link: "https://www.bilibili.com/"}
    {tip: " "}
    {tip: "爱奇艺", link: "https://www.iqiyi.com/"}
    {tip: " "}
    {tip: "优酷", link: "https://www.youku.com/"}
    {tip: " 等几家"}
  ],
  [
    {tip: "我们去踩点蘑菇把"}
  ]
]
*/
```

我们将句子解析成了三个数组，然后渲染的时候就可以根据数组来循环进行渲染了

## 封装 localStorage

```ts
export const STORAGE_PREFIX = "存储的命名空间";

const createProxy = (
  storage:
    | WindowLocalStorage["localStorage"]
    | WindowSessionStorage["sessionStorage"]
) => {
  const data: Record<string, any> = {};
  return new Proxy(data, {
    get(target, key: string) {
      if (Reflect.has(target, key)) {
        return Reflect.get(target, key);
      }

      const item = storage.getItem(`${STORAGE_PREFIX}${key}`);
      try {
        const value = JSON.parse(item);
        return value;
      } catch (e) {
        return item;
      }
    },
    set(target, key: string, value) {
      Reflect.set(target, key, value);
      storage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      return true;
    },
    has(target, key: string) {
      if (Reflect.has(target, key)) {
        return true;
      } else {
        return storage.getItem(`${STORAGE_PREFIX}${key}`) !== void 0;
      }
    },
  });
};

export const local = createProxy(localStorage);
export const session = createProxy(sessionStorage);
```

## 简洁地方式填充数组

```js
// 如果使用展开运算符展开一个空数组，可以得到一个被自动填充的数组
[...new Array(5)] // [undefined, undefined, undefined, undefined, undefined]

// 这样就能够非常简洁地构造遍历
[...new Array(5)].map(((_, i) => i + 1)) // [1, 2, 3, 4, 5]

// 我们画骨架屏的时候也可以用这种办法，简洁地循环填充骨架
{[...new Array(5)].map((() => <Skeleton />))}
```

## 格式化 天时分秒

```js
function parse(ms = 0) {
  const cast = v => (v < 0 ? 0 : Math.floor(v));
  const days = cast(ms / 864e5);
  const hours = cast((ms / 36e5) % 24);
  const minutes = cast((ms / 6e4) % 60);
  const seconds = cast((ms / 1e3) % 60);
  return { days, hours, minutes, seconds };
}
```

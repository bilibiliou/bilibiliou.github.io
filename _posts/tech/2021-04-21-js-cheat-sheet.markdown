---
layout: post
title: Js cheat sheet
category: 技术
keywords: 技术, js, javascript
---

## base64 转文件

```ts
function base64toFile(base64: string, filename: string) {
  const arr = base64.split(',');
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

  return [...new Set(arr.map(item => item[key]))].map(mainKey => arr.find(item => item[key] === mainKey));
}
```

## 函数式更新数组

```js
/*
* source 需要处理的数组，返回一个新的数组副本
* test 判断函数，返回boolean 判断是否需要对其更新
* update 更新函数，用于对，对应位置的数组项进行更新
*/
function updateArray<T>(source: T[], test: (i: T) => boolean, update: (t: T) => T) {
  return source.map(item => (test(item) ? update(item) : item));
}
```

## 时间格式化

函数式格式化时间，暴力美学
```js
function formatDuration(ms = 0, fmt = 'hh:mm:ss') {
  const fmts = {
    hh: v => v,
    mm: v => (v >= 10 ? v : `0${v}`),
    ss: v => (v >= 10 ? v : `0${v}`),
  };

  const values = {
    // 36e5 === 36 * 10^5 === 3600000 and so on
    hh: ms >= 36e5 ? Math.floor((ms / 36e5) % 24) : 0,
    mm: ms >= 6e4 ? Math.floor((ms / 6e4) % 60) : 0,
    ss: Math.ceil((ms / 1e3) % 60),
  };

  const format = s => (fmts[s] ? fmts[s](values[s]) : s);

  return fmt.split(':').map(format).filter(Boolean).join(':');
}
```

## 将 a区间 的 区间值 进行映射 到 b区间

数值上的区间映射
```js
// 例如将 0 - 255 中的 100 映射 到 0 - 1
function map(s, a1, a2, b1, b2) {
    return ((s - a1) / (a2 - a1)) * (b2 - b1) + b1
}
map(100, 0, 255, 0, 1) // 0.39
```

## 如何将数字转变为银行金额

```js
Number.prototype.thousandth = function() {
  return `${this}`.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,');
};
```

## 数字金额转中文金额

e.g:
输入: 12346
输出: 一十二万三千四百五十六

```ts
const chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const chnUnitSection = ['', '万', '亿', '万亿', '亿亿'];
const chnUnitChar = ['', '十', '百', '千'];

export function number2Chinese(num) {
  const section2Chinese = function (section) {
    let strIns = '';
    let chnStr = '';
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
  let strIns = '';
  let chnStr = '';
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
const getPosition = element => {
  const currentTop = window.pageXOffset !== undefined ?
      window.pageXOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollLeft;
  const currentLeft = window.pageYOffset !== undefined ?
      window.pageYOffset :
      (document.documentElement || document.body.parentNode || document.body).scrollTop;

  if (element) {
    if (element.getBoundingClientRect) {
      const { top, left } = element?.getBoundingClientRect();
      return { x: left + currentLeft, y: top + currentTop };
    } else {
      // polyfill
      let xPosition = 0;
      let yPosition = 0;

      while (element) {
        xPosition += element.offsetLeft - element.scrollLeft + element.clientLeft;
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
import compare from 'semver-compare'; // 调用 semver-compare 这个库

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


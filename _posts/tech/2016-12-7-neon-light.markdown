---
layout: post
title: 如何制作霓虹灯动画？
category: 技术
keywords: 技术,canvas,动画,霓虹灯
---

## 起因

网上认识的某FE 找我接的私活，想想觉得可以就干了

## 样式

<iframe height='486' scrolling='no' title='rWBKJp' src='//codepen.io/numerhero/embed/KNZRGz/?height=650&theme-id=0&default-tab=result&embed-version=2' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='http://codepen.io/numerhero/pen/rWBKJp/'>rWBKJp</a> by Owen (<a href='http://codepen.io/numerhero'>@numerhero</a>) on <a href='http://codepen.io'>CodePen</a>.
</iframe>

## 思路

绘制好灯泡运动的圆角矩形路径，每个路径点入栈，每次渲染都基于各个路径点坐标绘制小灯泡，周而复始

## 怎么画圆角矩形

非常简单，就是步骤比较繁琐，需要定位一个起始点 然后依次

上、右上圆角、右、右下圆角、下、左下圆角、左、左上圆角

```js
function drawRoundedRect(x,y,w,h,r,bdWidth=3,bdColor,bgcolor){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineWidth = bdWidth;
  ctx.strokeStyle = bdColor;
  ctx.arcTo(x+w,y,x+w,y+h,r);
  ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);
  ctx.arcTo(x,y,x+w,y,r);
  ctx.stroke();
  if(bgcolor) {
    ctx.fillStyle = bgcolor;
    ctx.fill()
  };
  ctx.closePath();
}
```

我们通过这个函数，可以尝试先绘制出两个圆角矩形

![pic](/assets/img/neno1.png)

## 获得灯泡的运动轨迹

和绘制圆角矩形相同，我们需要获得灯泡的运动轨迹

```js
function getTrail () {
  var sx = fx + 15, sy = fy + 5, w = bw - 10, h = bh - 10, result = [],
      section = 2, // 轨迹点间隔区间 
      csection = 0.1, // 圆轨迹区间
      ccp = [0,0]          // 圆角圆心点
      coffset = -(PI/2);   // 圆轨迹起始位置

  // 上边
  for (var i = sx; i<=w; i+=section) {
    result.push([i, sy]);
  }
  sx = i;
  ccp = [sx , sy + cradius];
  // 右上圆角
  for (var i = coffset; i <= coffset + tPI/4; i+=csection) {
    result.push([ccp[0] + cradius*Cos(i), ccp[1] + cradius*Sin(i)]);
  }
  sx = ccp[0] + cradius*Cos(i);
  sy = ccp[1] + cradius*Sin(i);
  // 右边
  for (var i = sy; i<=h; i+=section) {
    result.push([sx, i]);
  }
  sy = i;
  ccp = [sx - cradius, sy]
  // 右下圆角
  for (var i = coffset + tPI/4; i < coffset + tPI/2 ; i+=csection) {
    result.push([ccp[0] + cradius*Cos(i), ccp[1] + cradius*Sin(i)]);
  }
  sx = ccp[0] + cradius*Cos(i);
  sy = ccp[1] + cradius*Sin(i);

  // 下边
  for (var i = sx; i >= 30; i -= section ) {
    result.push([i,sy]);
  }
  sx = i;
  ccp = [sx, sy - cradius];
  
  // 左下圆角
  for (var i = coffset + tPI/2; i < coffset + (3*tPI)/4 ; i += csection) {
    result.push([ccp[0] + cradius*Cos(i), ccp[1] + cradius*Sin(i)]);
  }
  sx = ccp[0] + cradius*Cos(i);
  sy = ccp[1] + cradius*Sin(i);

  // 左边
  for (var i = sy; i >= 15 + cradius; i -= section) {
    result.push([sx,i]);
  }

  sy = i;
  ccp = [sx + cradius, sy];
  // 左上角

  for (var i = coffset + (3*tPI)/4; i < coffset + tPI; i+=csection) {
    result.push([ccp[0] + cradius*Cos(i), ccp[1] + cradius*Sin(i)]);
  }

  result.push([fx + 15,fy + 5]);
  
  return result; 
}
```

直线的轨迹点很好获取，通过循环长度就能获取，为了让动画不会掉帧，这里我们就设置的轨迹点间隔比较小（section = 2）当然你也试试其他值

圆形的轨迹点也不算太难，每一个圆角 循环 1/4 个圆，每个圆上的点相隔的间距为 csection=0.1, 需要注意的是 圆的初始位置为水平3点钟方向，我们应该设置 12点钟方向 为圆角轨迹的起始点，所以我们应该设置 coffset = -(PI/2)

弄好以后我们可以将轨迹打印出来看一看

```js
ctx.beginPath();
ctx.strokeStyle = "red";
for(var i = 0; i<w.length; i++) {
  ctx.lineTo(w[i][0],w[i][1])
  ctx.stroke();
}
```

我们可以清楚的看到，灯泡带 将会运动的红色轨迹

![pic](/assets/img/neno2.png)

当然效果中是不能看到的，所以原码里面也不会有上面的测试代码

## 绘制灯泡

实际上就是canvas 绘制圆

```js
function drawCircle (x,y,bg="rgba(238,232,255,1)" , isshadow) {
  var r = (bw/2 - sw/2)/2;

  ctx.beginPath();
      
  if (isshadow) {
    ctx.save();
    ctx.shadowColor  = "rgba(255, 255, 255, 1)";
    ctx.shadowOffsetX = 0; // 阴影Y轴偏移
    ctx.shadowOffsetY = 1; // 阴影X轴偏移
    ctx.shadowBlur = 5; // 模糊尺寸
  } else {
    ctx.save();
    ctx.shadowColor  = "transparent";
  }
  ctx.fillStyle = bg;
  ctx.arc(x,y,r,0,tPI);
  ctx.fill();
  ctx.closePath();
  ctx.restore();
}
```

这里我加了一点shadow 模拟白光，用一个isshadow 判断灯泡是否开启， 如果灯泡是熄灭的，就不加阴影，并且给透明度为0.2

## 运动

如上都是静态的，如何让他们动起头来呢？

这里我的思路是 设置一个 nowkey 标识， nowkey 从 0 到 w.length （轨迹栈的长度）
无限往复

在设置一个 变量 re 用来控制 每个灯泡间的间距。
从 nowkey 开始 每隔 re 个点 绘制一个灯泡

```js
function drawCricleGroup (v) {
  var t = v,k = 0,m = 0; // m 控制绘制灯的个数

  // 当 k 差不多累计一圈轨迹之后，停止循环
  while (k + re <= w.length - 1) {
    var tmp = w[t];
    m++;
    if(cflag) {
      if(m % 2 === 0) {
        drawCircle(tmp[0], tmp[1], "rgba(255,255,255,"+ 1 +")",1);  
      } else {
        drawCircle(tmp[0], tmp[1], "rgba(255,255,255,"+ 0.2 +")",0);  
      }
    } else {
      if(m % 2 === 0) {
        drawCircle(tmp[0], tmp[1], "rgba(255,255,255,"+ 0.2 +")",0);  
      } else {
        drawCircle(tmp[0], tmp[1], "rgba(255,255,255,"+ 1 +")",1);  
      }
    }
    if ((t + re) > w.length - 1) {
      t = t + re - w.length;
    } else {
      t += re;
    }
    k += re;
  }
}
```

效果如下

![gif](/assets/img/neno3.gif)

## 灯泡闪烁

灯泡带可以运动了，但是如何让灯泡有闪烁的效果呢？
这里我设置了一个 cflag 用来控制小灯泡的开和关

每当 nowkey 走过了一个灯泡间距，就让 cflag 切换

```js
if(nowkey % re === 0) {
  cflag ^= 1;
}
```

当 cflag 来回切换后，灯泡也会奇偶数进行开关闪烁了

## 自适应

如何自适应布局

首先是 获取了 这个文档的宽

```js
oW = window.document.documentElement.getBoundingClientRect().width;
```

通过 gap 和 oW 自适应

```js
gap = 10;               // 两边间距

fx = gap;               // 大屏起始点坐标
fy = 10;

fx2 = gap + 10;         // 小屏起始点坐标
fy2 = 20;

bw = (oW - 2*gap);       // 大屏宽
bh = (oH + gap) * 0.875; // 大屏高

sw = bw - 20;            // 小屏宽
sh = bh - 20;            // 小屏高
```

## 源代码

想深入研究其他细节的同学，请参照[源码](https://github.com/NumerHero/animations)

喜欢该效果的朋友可以不要吝惜您的star哦~
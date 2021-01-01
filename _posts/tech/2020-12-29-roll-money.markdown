---
layout: post
title: 自己搭一套数字翻滚动画框架
category: 技术
keywords: 技术, 动画
---

由于业务需要，自研了一套金额翻滚的动画小框架， 基于 ts + react-hooks, 当然，不强耦合react-hooks, 逻辑都足够解耦，你也可以在vue上用

## 效果

![demo](/assets/img/roll_money.gif)

注：转 gif 图片的时候，出于体积考虑，有损压缩的时候，有一定的掉帧

## 主逻辑代码

```js
// 格式化金额，保留两位小数
// value 入参为 最小单位金额 一份钱
export function formatMoney(value: number) {
  const yuan = (value || 0) / 100;
  return yuan.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
```

```js
// ease 函数库「开源」
const EasingFunctions = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t * t,
  // decelerating to zero velocity
  easeOutQuad: t => t * (2-t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => t<.5 ? 2 * t * t : -1+(4-2 * t) * t,
  // accelerating from zero velocity 
  easeInCubic: t => t * t * t,
  // decelerating to zero velocity 
  easeOutCubic: t => (--t) * t * t+1,
  // acceleration until halfway, then deceleration 
  easeInOutCubic: t => t<.5 ? 4 * t * t * t : (t-1) * (2 * t-2) * (2 * t-2)+1,
  // accelerating from zero velocity 
  easeInQuart: t => t * t * t * t,
  // decelerating to zero velocity 
  easeOutQuart: t => 1-(--t) * t * t * t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => t<.5 ? 8 * t * t * t * t : 1-8 * (--t) * t * t * t,
  // accelerating from zero velocity
  easeInQuint: t => t * t * t * t * t,
  // decelerating to zero velocity
  easeOutQuint: t => 1+(--t) * t * t * t * t,
  // acceleration until halfway, then deceleration 
  easeInOutQuint: t => t<.5 ? 16 * t * t * t * t * t : 1+16 * (--t) * t * t * t * t
}
export default EasingFunctions;
```

```js
interface RMConfig {
  target?: number;  // 进过动画后到达的金额 入参单位为分
  current: number; // 当前金额 入参单位为分
  render(renderText: string): void; // 单帧渲染函数，将每帧需要渲染的金额抛出由外部 setState
  onlyIncrease?: boolean; // 仅仅显示递增的动画，递减不渲染动画
  onlyDecrease?: boolean; // 仅仅显示递减的动画，递增不渲染动画
  ease?: string; // easing 函数名选择
  duration?: number; // 模式1 根据动画时间来动态计算每次需要 递增/递减 的金额
  gap?: number; // 模式2 每次金额递增/递减 「gap」
  frame?: number; // 帧数固定 60帧， 可以根据不同场景调整，一般不动
}

export default class RollMoney {
  config: RMConfig;
  renderText: string;
  _animationLock: NodeJS.Timeout;
  _valueAbs: number;
  _mode: number;
  _start: number; // 起始值

  constructor(props: RMConfig) {
    this.config = props;
  }

  start(newTarget?: number) {
    // 重新设置目标值，当目标值被改动后，会从 current 补间到 target
    if (newTarget) {
      this.config.target = newTarget;
    }

    const { current, target, duration } = this.config;
    this._valueAbs = Math.abs(current - target);

    // 两种模式
    // 模式1，如果设置了 duration，限时内增长或减少，无论两个数字之间相差多大，都是限制在指定的动画时间内完成动画
    // 模式2，如果没设置 duration，则固定增长或减少，保证每次增长值是一定的，如果两数字相差较小动画时间就快，相差较大动画时间就慢
    // 如果设置了 duration 优先使用模式1，否则模式2
    if (duration) {
      this._mode = 1;
    }

    this._start = current;
    return new Promise(resolve => {
      this._render(resolve);
    })
  }

  _renderDone(result) {
    const { render } = this.config;
    cancelAnimationFrame(this._animationLock);
    this.renderText = formatMoney(result);
    render && render(this.renderText);
  }

  // 渲染函数
  _render(done) {
    const {
      current,
      target,
      gap = 10,
      frame = 1000 / 60,
      duration,
      onlyIncrease = false,
      onlyDecrease = false,
      ease = 'linear'
    } = this.config;

    if (
      (typeof current !== 'number' || isNaN(current)) ||
      (typeof target !== 'number' || isNaN(target))
    ) {
      this._renderDone(0);
      done();
      return;
    }

    if (
      current === target ||
      (current < target && onlyDecrease) ||
      (current > target && onlyIncrease)
    ) {
      this._renderDone(target);
      done();
      return;
    }

    // 根据 easing 函数，对单位增量进行控制，达到非线性补间的效果
    const _tween = Easing[ease]( Math.max(Math.abs(current - this._start) / this._valueAbs, 0.01) ) * 100;
    const _gapTime = this._mode === 1 ? Math.max(_tween * (this._valueAbs / (duration / frame)), 1) : gap;

    this._animationLock = requestAnimationFrame(() => {
      // 从小金额领取现金后， 动画过渡到大金额
      if (current < target) {
        const add = current + Math.min( _gapTime, target - current);
        this.config.current = add;
        this._renderDone(add);
        this._render(done);
        return;
      }

      if (current > target) {
        // 大金额提现后，动画过渡到小金额
        const subtract = current - Math.min( _gapTime, current - target );
        this.config.current = subtract;
        this._renderDone(subtract);
        this._render(done);
        return;
      }

      done();
    });
  }
}
```

## 业务调用

```js
const [renderMoney, setRenderMoney] = useState(0);
const componentReference = useRef({
  currentMoney: 100
});

const cRef = componentReference.current;

// 业务调用逻辑
const RM = new RollMoney({
  // 当前金额
  current: cRef.currentMoney,
  duration: 3000, // 3秒内完成动画
  ease: 'easeInOutQuad',
  onlyIncrease: true,
  render: renderText => {
    // 实际的渲染操作
    // 返回单帧渲染的数字
    // 将计算的数字渲染到页面上
    setRenderMoney(renderText);
  }
});

const changeMoney = value => {
  RM.start(value).then(() => {
    // 动画执行完成后的回调
  });
}

// 从 0.00 -> 7600.00
changeMoney(760000);
```

```html
<div class="money">¥ {renderMoney}</div>
```

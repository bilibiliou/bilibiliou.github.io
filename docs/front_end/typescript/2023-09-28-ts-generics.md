# ts泛型总结

## Replace

```ts
type Replace<T, K extends keyof T, V> = {
  [KEY in keyof T]: KEY extends K ? V : T[KEY];
};
```

能够把第三方导出的interface部分key给replace成自己想要的

```ts
interface A {
  a: number;
  b: boolean;
}

type Replace<T, K extends keyof T, V> = {
  [KEY in keyof T]: KEY extends K ? V : T[KEY];
}

type B = Replace<A, 'a', boolean>;
// type B = {
//   a: boolean;
//   b: boolean;
// }
```

## FilterKeys

如何根据值的类型过滤一个接口中符合要求的所有字段？

例如我们有一个Base interface

```ts
interface Child {
  d: number;
  e: string;
}

interface Base {
  a: number;
  b: string;
  c: Child;
  f: number;
  g: string;
}
```

我们期望根据值的类型，来获取到所有符合类型的字段，

```ts
type AllNumberTypeKey = FilterKeys<Base, number>; // type AllNumberTypeKey = "a" | "f"
type AllStringTypeKey = FilterKeys<Base, string>; // type AllStringTypeKey = "b" | "g"
type AllChildTypeKey = FilterKeys<Base, Child> // type AllChildTypeKey = "c"
```

FilterKeys 的实现如下👇

```ts
export type FilterKeys<S, U> = keyof {
  [K in keyof S as S[K] extends U ? K : never]: S[K];
};

// 首先声明了一个对象，然后用in遍历了传入的S 也就是目标的interface
// 新声明了一个泛型K, K 是keyof S的依次遍历
// 判断 S[K] 的类型是否与目标泛型相等 S[K] extends U, 如果符合就保留这个key，如果不符合就以一个never来标记，来过滤掉
// 将过滤好后的Object keyof 后返回
```

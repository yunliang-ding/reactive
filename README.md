# @lite-code/reactive

基于 Proxy 的轻量级响应式状态管理库，专为 React 设计。

## 特性

- **深层响应式** — 嵌套对象自动代理，任意深度的属性修改都会触发更新
- **自动依赖追踪** — 组件仅订阅实际访问的 key，无需手写 selector
- **零模板代码** — 直接赋值即完成状态更新，无需 dispatch/action
- **React 18 原生** — 基于 `useSyncExternalStore` 实现可靠的订阅模型

## 安装

```bash
npm install @lite-code/reactive
```

## 快速开始

```tsx
import create from "@lite-code/reactive";

const store = create({
  count: 0,
  name: "Alice",
});

function Counter() {
  const { count } = store.useSnapshot(); // 仅追踪 count
  return (
    <div>
      <button onClick={() => store.count--}>-</button>
      <span>{count}</span>
      <button onClick={() => store.count++}>+</button>
    </div>
  );
}
```

## API

### `create<T>(initialStore: T): Store<T>`

创建响应式 store，返回值同时包含用户定义的状态属性和内置方法。

### `store.useSnapshot(): Readonly<T>`

React Hook，订阅 store 变化并返回冻结快照。自动追踪组件访问的 key，仅在相关 key 变化时触发重渲染。

### `store.restore(render?: boolean): void`

重置 store 到初始状态。`render` 默认为 `true`，表示重置后触发视图更新。

## 示例

### 深层嵌套对象

```tsx
const store = create({
  user: { name: "Alice", address: { city: "Shanghai" } },
});

function Profile() {
  const { user } = store.useSnapshot();
  return <div>{user.address.city}</div>;
}

// 任意深度的修改都会自动触发更新
store.user.address.city = "Beijing";
```

### 自动依赖追踪

```tsx
const store = create({ count: 0, name: "Alice" });

// 仅在 count 变化时重渲染
function CountPanel() {
  const { count } = store.useSnapshot();
  return <div>{count}</div>;
}

// 仅在 name 变化时重渲染
function NamePanel() {
  const { name } = store.useSnapshot();
  return <div>{name}</div>;
}
```

### 跨组件共享状态

```tsx
const store = create({ count: 0 });

function Display() {
  const { count } = store.useSnapshot();
  return <div>{count}</div>;
}

function Controls() {
  return <button onClick={() => store.count++}>+1</button>;
}
```

### 状态重置

```tsx
store.restore(); // 重置所有状态到初始值并触发更新
```

## License

MIT

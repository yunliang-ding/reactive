# 快速上手

## 安装

::: code-group

```sh [pnpm]
pnpm install @lite-code/reactive
```

```sh [npm]
npm install @lite-code/reactive
```

:::

## 基本使用

### 1. 创建 Store

```ts
// store.ts
import { create } from "@lite-code/reactive";

const store = create({
  count: 0,
  name: "hello",
});

export default store;
```

### 2. 组件中订阅

```tsx
import store from "./store";

function Counter() {
  // 解构哪些字段就只监听哪些字段
  const { count } = store.useSnapshot();

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => store.count++}>+1</button>
    </div>
  );
}
```

### 3. 跨组件共享

无需 Context Provider，任意组件直接导入同一个 store 即可共享状态：

```tsx
import store from "./store";

// 组件 A：修改
function Editor() {
  return <input onChange={(e) => (store.name = e.target.value)} />;
}

// 组件 B：消费（name 变化时自动重渲染）
function Display() {
  const { name } = store.useSnapshot();
  return <div>{name}</div>;
}
```

### 4. 深层嵌套修改

嵌套对象属性直接赋值即可触发更新，无需展开或使用 immer：

```ts
const store = create({
  user: { name: "Alice", address: { city: "上海" } },
});

// 任意层级直接赋值
store.user.name = "Bob";
store.user.address.city = "北京";
```

### 5. 重置状态

```ts
// 将 store 恢复为初始值
store.restore();
```

## 核心概念

| 概念 | 说明 |
| --- | --- |
| 自动依赖追踪 | `useSnapshot()` 通过 Proxy 记录组件访问了哪些 key，仅这些 key 变化时触发重渲染 |
| 深层响应 | 嵌套对象通过递归 Proxy 实现，任意层级赋值自动冒泡触发 dispatch |
| 零 Context | store 是模块级对象，组件直接 import 使用，无需 Provider 包裹 |
| 自动还原 | 所有订阅组件卸载后，store 自动重置为初始状态 |

## 注意事项

- 数组和 Map/Set 的方法（`push`、`splice`、`set`）不触发更新，需替换整个引用
- 不解构直接使用整个快照对象，等价于订阅所有字段
- store 的 key 不可使用内部保留属性名（`state`、`listeners`、`dispatch` 等）

## 了解更多

查看完整 [API 文档](/components/case.html) 获取详细说明与在线示例。

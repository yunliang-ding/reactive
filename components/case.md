<script setup>
import Demo1 from '../demos/basic.tsx'
import Demo1Code from '../demos/basic.tsx?raw'
import Demo2 from '../demos/shared-store.tsx'
import Demo2Code from '../demos/shared-store.tsx?raw'
import Demo3 from '../demos/auto-tracking.tsx'
import Demo3Code from '../demos/auto-tracking.tsx?raw'
import Demo4 from '../demos/nested-object.tsx'
import Demo4Code from '../demos/nested-object.tsx?raw'
import Demo5 from '../demos/restore.tsx'
import Demo5Code from '../demos/restore.tsx?raw'
</script>

## 基础用法

<Demo :component="Demo1" :code="Demo1Code" title="计数器" de/>

## 跨组件共享

<Demo :component="Demo2" :code="Demo2Code" title="多组件共享" />

## 自动依赖追踪

<Demo :component="Demo3" :code="Demo3Code" title="只有依赖字段变化时才重渲染" />

> **注意**：若直接使用整个快照对象（`const snap = store.useSnapshot()`）而不解构，等价于订阅所有字段，任意字段变化都会触发重渲染。

## 嵌套对象深层响应

<Demo :component="Demo4" :code="Demo4Code" title="深层嵌套属性修改" />

```ts
const store = reactive({
  user: {
    name: "Alice",
    address: { city: "上海" },
  },
});

// ✅ 任意层级直接赋值，自动触发更新
store.user.name = "Bob";
store.user.address.city = "北京";
```

> **限制**：深层响应仅对**普通对象**生效，`Array`、`Map`、`Set` 等容器类型的方法（如 `push`、`set`）不会自动触发更新，需替换整个引用：
>
> ```ts
> // ❌ push 不触发更新
> store.list.push(1);
>
> // ✅ 替换引用触发更新
> store.list = [...store.list, 1];
> ```

## 重置初始状态

调用 `store.restore()` 将 store 的所有字段重置为初始值并触发视图更新。当所有订阅该 store 的组件全部卸载时，store 也会**自动还原**到初始状态，下次挂载时始终是干净的初始数据。

<Demo :component="Demo5" :code="Demo5Code" title="手动重置 store" />

```ts
// 手动重置
store.restore();
```

## 最佳实践

### Store 定义建议放在模块顶层

```ts
// store.ts
import reactive from "@lite-code/reactive";

export const userStore = reactive({
  name: "",
  age: 0,
  role: "viewer" as "viewer" | "editor" | "admin",
});
```

### 按功能拆分多个 store

```ts
// 避免一个巨大的全局 store，按功能域拆分
export const authStore = reactive({ token: "", userId: "" });
export const themeStore = reactive({ mode: "light", accent: "#6366f1" });
export const cartStore = reactive({ items: [] as CartItem[], total: 0 });
```

### 在事件处理函数中批量修改

```ts
// 多次赋值会触发多次 dispatch，如需批量更新，建议直接替换对象
store.user = { ...store.user, name: "Bob", age: 25 };
```

## API

### `reactive(initialState)`

创建并返回一个响应式 store。

| 参数           | 类型 | 说明                 |
| -------------- | ---- | -------------------- |
| `initialState` | `T`  | store 的初始状态对象 |

**返回值** `T & { useSnapshot, restore }`

---

### `store.useSnapshot()`

React Hook，在组件中订阅 store，返回当前快照（浅冻结）。

- 自动追踪本次渲染中访问过的 key，仅当这些 key 对应的值变化时才触发重渲染
- 返回值顶层属性被 `Object.freeze` 保护，严格模式下直接修改会抛出运行时异常
- 必须在 React 函数组件或自定义 Hook 内调用（遵循 React Hooks 规则）

```ts
const { count, name } = store.useSnapshot();
```

---

### `store.restore()`

将 store 重置为 `reactive()` 调用时传入的初始状态，并触发视图更新。

```ts
store.restore();
```

---

## 内部保留属性

以下属性名为 store 内部保留，**不可**作为 state 的 key 使用：

| 属性名        | 说明                          |
| ------------- | ----------------------------- |
| `state`       | 原始 state 对象               |
| `originStore` | 初始状态快照（供 restore 用） |
| `listeners`   | 订阅者集合                    |
| `subscribe`   | 订阅方法                      |
| `getSnapshot` | 快照读取方法                  |
| `dispatch`    | 内部触发更新方法              |
| `useSnapshot` | React Hook                    |
| `restore`     | 重置方法                      |

TypeScript 会在编译期对使用保留名的 state key 进行报错提示。

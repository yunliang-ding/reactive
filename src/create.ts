// @ts-ignore
import { useRef } from "react";
// @ts-ignore
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { InitProps, innerProps, Listener, manualCloneDeep } from "./utils";

/**
 * 递归创建深层响应式 Proxy。
 * 任意嵌套层级的属性赋值都会向上冒泡，最终调用根 store 的 dispatch。
 */
const createDeepProxy = (
  target: Record<string, unknown>,
  dispatch: () => void
): any => {
  return new Proxy(target, {
    get(obj, key) {
      const value = obj[key as string];
      // 遇到对象继续包装，实现无限嵌套响应
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        return createDeepProxy(value as Record<string, unknown>, dispatch);
      }
      return value;
    },
    set(obj, key, value) {
      if (obj[key as string] !== value) {
        obj[key as string] = value;
        dispatch(); // 任意层级的修改都触发根 dispatch
      }
      return true;
    },
  });
};

class createStore<T extends Record<string, unknown>> {
  public state: T;
  public originStore: T;
  public listeners = new Set<Listener>();

  constructor(initialStore: T) {
    // 深拷贝，避免污染用户传入的原始对象
    this.state = manualCloneDeep(initialStore);
    // 单独保存一份原始状态，仅在构造时写入，restore 时只读取不覆盖
    this.originStore = manualCloneDeep(initialStore);
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      // 直接依赖 listeners.size，避免 StrictMode 下双重订阅导致计数偏差
      if (this.listeners.size === 0) {
        this.restore(false);
      }
    };
  };

  /** 重置 state 到初始值，render=true 时同步触发视图更新 */
  restore = (render = true): void => {
    // 只重置 state，originStore 始终保持构造时的快照不变
    this.state = manualCloneDeep(this.originStore);
    if (render) {
      this.dispatch();
    }
  };

  /** 触发所有订阅者重新渲染 */
  dispatch = (): void => {
    // 浅拷贝产生新引用，让 useSyncExternalStore 感知到变化
    this.state = { ...this.state };
    this.listeners.forEach((fn) => fn());
  };

  /**
   * 在组件中订阅 store，返回当前快照（浅冻结）。
   * 自动依赖追踪：解构了哪些 key 就只监听哪些 key，未访问的字段变化不触发重渲染。
   *
   * Object.freeze 冻结顶层属性，严格模式下直接修改 snap.key 会抛出运行时异常。
   * 注意：嵌套对象属性未深度冻结，仍应通过 store.key = value 赋值来触发视图更新。
   *
   * @example
   * const { count } = store.useSnapshot(); // 只有 count 变化时才重渲染
   */
  useSnapshot = (): Readonly<T> => {
    // 每个组件实例独立维护自己访问过的 key 集合、上一次快照、上一次 state 引用
    const trackedKeys = useRef<Set<string>>(new Set());
    const lastSnapshot = useRef<Readonly<T> | null>(null);
    const lastState = useRef<T | null>(null);

    const getSnapshot = (): Readonly<T> => {
      // React 在同一渲染周期会多次调用 getSnapshot 做一致性校验。
      // state 引用未变（即无 dispatch）时，直接返回缓存快照，保证引用稳定，避免无限循环。
      if (this.state === lastState.current && lastSnapshot.current !== null) {
        return lastSnapshot.current;
      }

      // state 引用已变（dispatch 被调用），检查追踪的 key 是否有变化
      if (lastSnapshot.current !== null && trackedKeys.current.size > 0) {
        const stateRecord = this.state as Record<string, unknown>;
        const lastRecord = lastSnapshot.current as Record<string, unknown>;
        let changed = false;
        for (const key of trackedKeys.current) {
          const curr = stateRecord[key];
          const prev = lastRecord[key];
          // 原始值：Object.is 精确比对
          // 对象/数组：快照与 state 共享引用，原地修改无法通过引用比对检测，统一视为已变化
          if (
            !Object.is(curr, prev) ||
            (curr !== null && typeof curr === "object")
          ) {
            changed = true;
            break;
          }
        }
        if (!changed) {
          lastState.current = this.state;
          return lastSnapshot.current;
        }
      }

      // 需要更新快照：创建新的冻结对象并缓存
      const snap = Object.freeze({ ...this.state }) as Readonly<T>;
      lastState.current = this.state;
      lastSnapshot.current = snap;
      return snap;
    };

    const snap = useSyncExternalStore(this.subscribe, getSnapshot);

    // 返回 Proxy，访问哪个 key 就记录哪个 key
    return new Proxy(snap as object, {
      get(target, key) {
        if (typeof key === "string") {
          trackedKeys.current.add(key);
        }
        return (target as Record<string, unknown>)[key as string];
      },
    }) as Readonly<T>;
  };
}

/** 提示用户：store 的 key 不能与内部保留属性同名 */
type BadProp<T> = {
  [K in keyof T]: K extends keyof InitProps ? never : T[K];
};

export default <T extends BadProp<T>>(initialStore: T & ThisType<T>) => {
  const store = new createStore(initialStore);

  const enhanceStore = new Proxy(store, {
    get: (target, propKey, receiver) => {
      if (innerProps(propKey as string)) {
        return Reflect.get(target, propKey, receiver);
      }
      const value = (target.state as Record<string, unknown>)[
        propKey as string
      ];
      // 顶层值为对象时，返回深层响应式 Proxy，嵌套修改自动触发 dispatch
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        return createDeepProxy(value as Record<string, unknown>, () =>
          store.dispatch()
        );
      }
      return value;
    },
    set: (target, propKey, value) => {
      if (innerProps(propKey as string)) {
        console.error(`"${String(propKey)}" 为内部保留属性，不可修改！`);
        return false;
      }
      const stateRecord = target.state as Record<string, unknown>;
      if (stateRecord[propKey as string] !== value) {
        stateRecord[propKey as string] = value;
        store.dispatch();
      }
      // 只写入 state，不写入 store 实例本身，避免双写污染
      return true;
    },
  });

  return enhanceStore as unknown as T & {
    /** 在组件中订阅 store，自动追踪依赖，解构了哪些 key 就只监听哪些 key */
    useSnapshot: () => Readonly<T>;
    /** 将 store 重置为初始状态并触发视图更新 */
    restore: () => void;
  };
};

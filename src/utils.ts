/** 监听器函数类型 */
export type Listener = () => void;

/** 内部保留属性接口 */
export interface InitProps {
  state: any;
  originStore: any;
  listeners: Set<Listener>;
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => unknown;
  dispatch: () => void;
  useSnapshot: () => unknown;
  restore: () => void;
}

/**
 * 用 Set + 类型约束同步保留属性列表，避免字符串数组与接口定义不同步。
 * 补充了原来漏掉的 listeners / originStore。
 */
const INNER_PROPS = new Set<keyof InitProps>([
  "state",
  "originStore",
  "listeners",
  "subscribe",
  "getSnapshot",
  "dispatch",
  "useSnapshot",
  "restore",
]);

export const innerProps = (propKey: string): boolean =>
  INNER_PROPS.has(propKey as keyof InitProps);

export const manualCloneDeep = (obj: any, map = new WeakMap()): any => {
  // 处理原始值和 null
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 处理循环引用
  if (map.has(obj)) {
    return map.get(obj);
  }

  // 处理特殊对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (obj instanceof Map) {
    const newMap = new Map();
    map.set(obj, newMap);
    for (const [key, value] of obj.entries()) {
      newMap.set(manualCloneDeep(key, map), manualCloneDeep(value, map));
    }
    return newMap;
  }
  if (obj instanceof Set) {
    const newSet = new Set();
    map.set(obj, newSet);
    for (const value of obj.values()) {
      newSet.add(manualCloneDeep(value, map));
    }
    return newSet;
  }

  // 处理数组和普通对象
  const clone = Array.isArray(obj)
    ? []
    : Object.create(Object.getPrototypeOf(obj));
  map.set(obj, clone); // 记录引用，防止循环引用死循环

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = manualCloneDeep(obj[key], map);
    }
  }
  return clone;
};

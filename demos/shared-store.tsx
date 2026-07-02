import { Button } from "shineout";
import { create } from "@yl_lowcode/reactive";

/**
 * 多组件共享同一个 store 实例，任意一处修改，所有订阅组件同步更新。
 */
const store = create({ count: 0 });

function Display() {
  const { count } = store.useSnapshot();
  return (
    <div style={{ padding: "8px 16px", background: "var(--aui-surface)", borderRadius: 6 }}>
      当前值：<strong>{count}</strong>
    </div>
  );
}

function Controls() {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button onClick={() => store.count--}>-1</Button>
      <Button type="primary" onClick={() => store.count++}>+1</Button>
      <Button type="primary" outline onClick={() => (store.count = 0)}>重置</Button>
    </div>
  );
}

export default function SharedStore() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Display />
      <Display />
      <Controls />
    </div>
  );
}

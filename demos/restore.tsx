import { Button } from "shineout";
import { create } from "@yl_lowcode/reactive";

/**
 * restore 演示：将 store 重置回初始状态。
 */
const store = create({
  count: 0,
  name: "Alice",
});

export default function RestoreDemo() {
  const { count, name } = store.useSnapshot();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ padding: 12, background: "var(--aui-surface)", borderRadius: 6 }}>
        <div>count = {count}</div>
        <div>name = {name}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="primary" onClick={() => store.count++}>count +1</Button>
        <Button
          outline
          onClick={() => {
            store.name = store.name === "Alice" ? "Bob" : "Alice";
          }}
        >
          切换 name
        </Button>
        <Button onClick={() => store.restore()}>
          ↺ 重置初始状态
        </Button>
      </div>
    </div>
  );
}

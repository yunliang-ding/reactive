import { Button } from "shineout";
import { create } from "@yl_lowcode/reactive";

/**
 * 自动依赖追踪演示：
 * - CountPanel 只解构了 count，name 变化时不重渲染
 * - NamePanel 只解构了 name，count 变化时不重渲染
 * - 每个面板右上角的时间戳会在重渲染时更新，可直观看出哪个面板被触发
 */
const store = create({ count: 0, name: "Alice" });

function CountPanel() {
  const { count } = store.useSnapshot();
  return (
    <div style={{ padding: 12, border: "1px solid var(--aui-border)", borderRadius: 6 }}>
      <div style={{ fontSize: 12, color: "var(--aui-text-muted)", marginBottom: 4 }}>
        CountPanel 渲染时间：{new Date().toLocaleTimeString()}
      </div>
      <div>count = <strong>{count}</strong></div>
    </div>
  );
}

function NamePanel() {
  const { name } = store.useSnapshot();
  return (
    <div style={{ padding: 12, border: "1px solid var(--aui-border)", borderRadius: 6 }}>
      <div style={{ fontSize: 12, color: "var(--aui-text-muted)", marginBottom: 4 }}>
        NamePanel 渲染时间：{new Date().toLocaleTimeString()}
      </div>
      <div>name = <strong>{name}</strong></div>
    </div>
  );
}

const names = ["Alice", "Bob", "Carol", "Dave"];
let nameIdx = 0;

export default function TrackingDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CountPanel />
      <NamePanel />
      <div style={{ display: "flex", gap: 8 }}>
        <Button type="primary" onClick={() => store.count++}>
          改 count（只触发 CountPanel）
        </Button>
        <Button
          outline
          onClick={() => {
            nameIdx = (nameIdx + 1) % names.length;
            store.name = names[nameIdx];
          }}
        >
          改 name（只触发 NamePanel）
        </Button>
      </div>
    </div>
  );
}

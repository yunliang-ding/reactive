import { Button } from "shineout";
import { create } from "@yl_lowcode/reactive";

/**
 * 嵌套对象深层响应：直接修改嵌套属性，无需手动 dispatch。
 */
const store = create({
  user: {
    name: "Alice",
    address: {
      city: "上海",
    },
  },
});

export default function NestedObject() {
  const { user } = store.useSnapshot();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ padding: 12, background: "var(--aui-surface)", borderRadius: 6 }}>
        <div>姓名：{user.name}</div>
        <div>城市：{user.address.city}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <Button
          type="primary"
          onClick={() => {
            store.user.name = store.user.name === "Alice" ? "Bob" : "Alice";
          }}
        >
          切换姓名
        </Button>
        <Button
          outline
          onClick={() => {
            const cities = ["上海", "北京", "广州", "深圳"];
            const idx = cities.indexOf(store.user.address.city);
            store.user.address.city = cities[(idx + 1) % cities.length];
          }}
        >
          切换城市（深层嵌套）
        </Button>
      </div>
    </div>
  );
}

import { Button } from "shineout";
import { create } from "@yl_lowcode/reactive";

const store = create({ count: 0 });

export default function Basic() {
  const { count } = store.useSnapshot();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Button onClick={() => store.count--}>-</Button>
      <span style={{ minWidth: 32, textAlign: "center", fontSize: 16 }}>
        {count}
      </span>
      <Button type="primary" onClick={() => store.count++}>
        +
      </Button>
    </div>
  );
}

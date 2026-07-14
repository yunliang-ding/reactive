import { CSSProperties } from "react";
import { create } from "@lite-code/reactive";

const store = create({ text: "" });

const inputStyle: CSSProperties = {
  padding: "6px 12px",
  borderRadius: 4,
  border: "1px solid var(--vp-c-divider)",
  fontSize: 14,
  width: "100%",
  outline: "none",
};

function Input() {
  const { text } = store.useSnapshot();
  return (
    <div>
      <div style={{ marginBottom: 8, color: "var(--vp-c-text-2)" }}>
        ✅ IME 无需额外处理
      </div>
      <input
        style={inputStyle}
        value={text}
        onChange={(e) => {
          store.text = e.target.value;
        }}
        placeholder="尝试输入中文（如：计划）..."
      />
      <div style={{ marginTop: 8, fontSize: 13, color: "var(--vp-c-text-3)" }}>
        store 值：「{text}」
      </div>
    </div>
  );
}

export default function IMEDemo() {
  return <Input />;
}

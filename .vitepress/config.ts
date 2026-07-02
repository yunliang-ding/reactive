import { defineConfig } from "vitepress";
import react from "@vitejs/plugin-react";
import externalGlobals from "rollup-plugin-external-globals";
//@ts-ignore
import path from "path";
//@ts-ignore
import { shikiRawPlugin } from "@yl_lowcode/docs-theme/plugins/shiki-raw";
//@ts-ignore
const base = process.env.NODE_ENV === "production" ? "" : "";

export default defineConfig({
  title: "@yl_lowcode/reactive",
  description: "轻量响应式状态管理",
  lang: "zh-CN",
  base,
  head: [
    [
      "script",
      {
        src: "https://assets.dotfashion.cn/unpkg/react@18.0.0/umd/react.production.min.js",
      },
    ],
    [
      "script",
      {
        src: "https://assets.dotfashion.cn/unpkg/react-dom@18.0.0/umd/react-dom.production.min.js",
      },
    ],
    [
      "script",
      {
        src: "https://assets.dotfashion.cn/unpkg/shineout@3.9.11/dist/shineout.min.js",
      },
    ],
    ["link", { rel: "icon", type: "image/svg+xml", href: `${base}logo.svg` }],
  ],
  themeConfig: {
    search: { provider: "local" },
    logo: "/logo.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/components/guide" },
    ],
    sidebar: [
      {
        text: "开始",
        items: [
          { text: "快速上手", link: "/components/guide" },
          { text: "使用案例", link: "/components/case" },
        ],
      },
    ],
  },
  markdown: {
    theme: { light: "light-plus", dark: "dark-plus" },
  },
  vite: {
    plugins: [
      //@ts-ignore
      shikiRawPlugin({ theme: { light: "light-plus", dark: "dark-plus" } }),
      //@ts-ignore
      react(),
    ],
    resolve: {
      alias: {
        //@ts-ignore
        "@yl_lowcode/reactive": path.resolve(__dirname, "../src/index.ts"),
      },
    },
    build: {
      rollupOptions: {
        external: ["react", "react-dom", "react-dom/client", "shineout"],
        plugins: [
          externalGlobals({
            react: "React",
            "react-dom": "ReactDOM",
            "react-dom/client": "ReactDOM",
            shineout: "Shineout",
          }) as any,
        ],
      },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "sucrase",
      ],
    },
  },
});

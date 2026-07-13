// @ts-nocheck
import docsTheme from "@lite-code/vitepress-theme";
import { provide, h, defineComponent } from "vue";
import * as reactive from "@lite-code/reactive";
import * as shineout from "shineout"
// 构建时预注册所有 demo 文件
const codeGlobs = import.meta.glob("../../demos/**/*.tsx", {
  query: "?raw",
  import: "default",
});

// 包装 Layout：注入 playground 配置后渲染 vitepress-theme 的 Layout
const Layout = defineComponent({
  setup() {
    provide("playground-config", {
      codeGlobs,
      loadModules: () => ({
        shineout,
        "@lite-code/reactive": reactive,
      }),
    });
    return () => h(docsTheme.Layout);
  },
});

export default {
  ...docsTheme,
  Layout,
};

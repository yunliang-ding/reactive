// @ts-nocheck
import docsTheme from "@yl_lowcode/docs-theme";
import { provide, h, defineComponent } from "vue";
import * as editor from "@yl_lowcode/editor";
import * as reactive from "@yl_lowcode/reactive";
import * as shineout from "shineout"
// 构建时预注册所有 demo 文件
const codeGlobs = import.meta.glob("../../demos/**/*.tsx", {
  query: "?raw",
  import: "default",
});

// 包装 Layout：注入 playground 配置后渲染 docs-theme 的 Layout
const Layout = defineComponent({
  setup() {
    provide("playground-config", {
      codeGlobs,
      loadModules: () => ({
        shineout,
        "@yl_lowcode/editor": editor,
        "@yl_lowcode/reactive": reactive,
      }),
    });
    return () => h(docsTheme.Layout);
  },
});

export default {
  ...docsTheme,
  Layout,
};

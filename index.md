---
layout: home
hero:
  name: "@yl_lowcode/reactive"
  text: 轻量响应式状态管理
  tagline: 基于 useSyncExternalStore，自动依赖追踪、深层嵌套响应、零 Context
  actions:
    - theme: brand
      text: 快速上手
      link: /components/guide.html
    - theme: alt
      text: API 文档
      link: /components/case.html
  image:
    src: /logo.svg
    alt: Reactive
features:
  - icon: 🎯
    title: 自动依赖追踪
    details: useSnapshot 通过 Proxy 自动记录组件访问的状态字段，仅在相关字段变化时触发精准重渲染
  - icon: 🪆
    title: 深层嵌套响应
    details: 递归代理嵌套对象，store.a.b.c = x 自动冒泡触发更新，无需手动展开或 immer
  - icon: 🚫
    title: 零 Context
    details: 无需 Provider 包裹，store 作为模块级对象直接导入共享，组件树任意位置均可访问
  - icon: ⚡
    title: 极简 API
    details: 仅暴露 create、useSnapshot、restore 三个核心能力，直接赋值即修改状态，零学习成本
---

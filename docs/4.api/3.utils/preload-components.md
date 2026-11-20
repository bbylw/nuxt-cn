---
title: 'preloadComponents'
description: Nuxt 提供了用于在预加载组件方面给予你控制的工具。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/preload.ts
    size: xs
---

预加载组件会加载那些你的页面很快就需要、并且你希望在渲染生命周期的早期就开始加载的组件。这能确保它们更早可用，并且不太可能阻塞页面的渲染，从而提升性能。

使用 `preloadComponents` 来手动预加载那些在你的 Nuxt 应用中已全局注册的单个组件。默认情况下，Nuxt 将它们注册为异步组件。你必须使用组件名的 Pascal 命名版本。

```ts
await preloadComponents('MyGlobalComponent')

await preloadComponents(['MyGlobalComponent1', 'MyGlobalComponent2'])
```

::note
在服务端，`preloadComponents` 没有任何效果。
::

---
title: 'prefetchComponents'
description: Nuxt 提供了用于在预取组件方面给予你控制的工具。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/preload.ts
    size: xs
---

预取组件会在后台下载代码，这是基于这样一种假设：该组件很可能会被用于渲染，从而在用户请求时使其能即时加载。组件会被下载并缓存起来，以备将来可能的使用，而无需用户显式发出请求。

使用 `prefetchComponents` 来手动预取那些在你的 Nuxt 应用中已全局注册的单个组件。默认情况下，Nuxt 将它们注册为异步组件。你必须使用组件名的 Pascal 命名版本。

```ts
await prefetchComponents('MyGlobalComponent')

await prefetchComponents(['MyGlobalComponent1', 'MyGlobalComponent2'])
```

:note
当前的实现行为与 [`preloadComponents`](/docs/api/utils/preload-components) 完全相同（通过预加载而非仅预取的方式），我们正在努力改进这一行为。
:

:note
在服务端，`prefetchComponents` 没有任何效果。
:

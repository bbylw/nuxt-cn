---
title: 'preloadRouteComponents'
description: preloadRouteComponents 允许你手动预加载 Nuxt 应用中的单个页面。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/preload.ts
    size: xs
---

预加载路由会加载某个可能被用户在未来导航到的路由所对应的组件。这能确保这些组件更早可用，并且不太可能阻塞导航，从而提升性能。

::tip{icon="i-lucide-rocket"}
如果你正在使用 `NuxtLink` 组件，Nuxt 已经会自动预加载必要的路由。
::

:read-more{to="/docs/api/components/nuxt-link"}

## 示例

在使用 `navigateTo` 时预加载一个路由。

```ts
// 我们不 await 这个异步函数，以避免阻塞渲染
// 该组件 setup 函数的执行
preloadRouteComponents('/dashboard')

const submit = async () => {
  const results = await $fetch('/api/authentication')

  if (results.token) {
    await navigateTo('/dashboard')
  }
}
```

:read-more{to="/docs/api/utils/navigate-to"}

::note
在服务端，`preloadRouteComponents` 没有任何效果。
::

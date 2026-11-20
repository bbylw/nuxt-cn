---
title: "useResponseHeader"
description: "使用 useResponseHeader 设置服务端响应头。"
minimalVersion: "3.14"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ssr.ts
    size: xs
---

::important
该组合式函数在 Nuxt v3.14+ 中可用。
::

你可以在你的页面、组件和插件中使用内置的 [`useResponseHeader`](/docs/api/composables/use-response-header) 组合式函数来设置任意服务端响应头。

```ts
// 设置一个自定义响应头
const header = useResponseHeader('X-My-Header')
header.value = 'my-value'
```

## 示例

我们可以使用 `useResponseHeader` 轻松地为每个页面设置响应头。

```vue [app/pages/test.vue]
<script setup>
// pages/test.vue
const header = useResponseHeader('X-My-Header')
header.value = 'my-value'
</script>

<template>
  <h1>带有自定义响应头的测试页面</h1>
  <p>服务器对这个 "/test" 页面的响应将包含一个自定义的 "X-My-Header" 响应头。</p>
</template>
```

我们也可以使用 `useResponseHeader`，例如在 Nuxt [中间件](/docs/directory-structure/app/middleware) 中，为所有页面设置响应头。

```ts [app/middleware/my-header-middleware.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  const header = useResponseHeader('X-My-Always-Header')
  header.value = `我无处不在！`
})
```

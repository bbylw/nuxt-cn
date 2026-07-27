---
title: "useRequestHeader"
description: "使用 useRequestHeader 访问某个特定的传入请求头。"
minimalVersion: "3.9"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ssr.ts
    size: xs
---

你可以使用内置的 [`useRequestHeader`](/docs/api/composables/use-request-header) 组合式函数，在你的页面、组件和插件中访问任何传入的请求头。

```ts
// 获取 authorization 请求头
const authorization = useRequestHeader('authorization')
```

:tip
在浏览器中，`useRequestHeader` 会返回 `undefined`。
:

## 示例

我们可以使用 `useRequestHeader` 轻松判断用户是否已授权。

下面的示例读取 `authorization` 请求头来查明某人是否可以访问受限资源。

```ts [app/middleware/authorized-only.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  if (!useRequestHeader('authorization')) {
    return navigateTo('/not-authorized')
  }
})
```

---
title: "defineNuxtRouteMiddleware"
description: "使用 defineNuxtRouteMiddleware 辅助函数创建命名路由中间件。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

路由中间件保存在你的 Nuxt 应用的 [`app/middleware/`](/docs/directory-structure/app/middleware) 中（除非[另有设置](/docs/api/nuxt-config#middleware)）。

## 类型

```ts [Signature]
export function defineNuxtRouteMiddleware (middleware: RouteMiddleware): RouteMiddleware

interface RouteMiddleware {
  (to: RouteLocationNormalized, from: RouteLocationNormalized): ReturnType<NavigationGuard>
}
```

## 参数

### `middleware`

- **类型**：`RouteMiddleware`

一个函数，以两个 Vue Router 的路由位置对象作为参数：下一个路由 `to` 作为第一个参数，当前路由 `from` 作为第二个参数。

在 **[Vue Router 文档](https://router.vuejs.org/api/type-aliases/routelocationnormalized)** 中了解更多关于 `RouteLocationNormalized` 的可用属性。

## 示例

### 显示错误页

你可以使用路由中间件来抛出错误并显示有用的错误信息：

```ts [app/middleware/error.ts]
export default defineNuxtRouteMiddleware((to) => {
  if (to.params.id === '1') {
    throw createError({ status: 404, statusText: 'Page Not Found' })
  }
})
```

上面的路由中间件会将用户重定向到 `~/error.vue` 文件中定义的自定义错误页，并暴露从中间件传递过来的错误消息和代码。

### 重定向

在路由中间件中结合 `navigateTo` 辅助函数使用 [`useState`](/docs/api/composables/use-state)，根据用户的鉴权状态将其重定向到不同的路由：

```ts [app/middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useState('auth')

  if (!auth.value.isAuthenticated) {
    return navigateTo('/login')
  }

  if (to.path !== '/dashboard') {
    return navigateTo('/dashboard')
  }
})
```

[navigateTo](/docs/api/utils/navigate-to) 和 [abortNavigation](/docs/api/utils/abort-navigation) 都是在 `defineNuxtRouteMiddleware` 内部可使用的全局辅助函数。

---
title: 'addRouteMiddleware'
description: 'addRouteMiddleware() 是一个在你的应用中动态添加中间件的辅助函数。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

::note
路由中间件是存储在 Nuxt 应用的 [`app/middleware/`](/docs/directory-structure/app/middleware) 目录中的导航守卫（除非[另有设置](/docs/api/nuxt-config#middleware)）。
::

## 类型

```ts [Signature]
function addRouteMiddleware (name: string, middleware: RouteMiddleware, options?: AddRouteMiddlewareOptions): () => void
function addRouteMiddleware (middleware: RouteMiddleware): () => void

interface AddRouteMiddlewareOptions {
  global?: boolean
}
```

## 参数

### `name`

- **类型：** `string` | `RouteMiddleware`

可以是字符串或 `RouteMiddleware` 类型的函数。该函数将下一个路由 `to` 作为第一个参数，当前路由 `from` 作为第二个参数，两者都是 Vue 路由对象。

了解更多关于[路由对象](/docs/api/composables/use-route)的可用属性。

### `middleware`

- **类型：** `RouteMiddleware`

第二个参数是一个 `RouteMiddleware` 类型的函数。同上，它提供 `to` 和 `from` 路由对象。如果 `addRouteMiddleware()` 的第一个参数已经作为函数传入，则它变为可选。

### `options`

- **类型：** `AddRouteMiddlewareOptions`

一个可选的 `options` 参数让你可以将 `global` 设为 `true`，以指示该路由中间件是否是全局的（默认设为 `false`）。

## 返回值

`addRouteMiddleware()` 返回一个函数，用于再次移除该中间件。这对于只在应用部分生命周期内生效的中间件很有用：

```ts [app/plugins/onboarding.ts]
export default defineNuxtPlugin(() => {
  const onboarded = useCookie<boolean>('onboarded')
  if (onboarded.value) {
    return
  }

  const unregister = addRouteMiddleware((to) => {
    if (to.path !== '/onboarding') {
      return navigateTo('/onboarding')
    }
  })

  watch(onboarded, (value) => {
    if (value) {
      unregister()
    }
  })
})
```

在组件中注册中间件时，请在组件卸载时调用返回的函数，例如使用 `onScopeDispose(unregister)`。如果要守卫离开当前页面，请改用 [`onBeforeRouteLeave`](https://router.vuejs.org/api/functions/onBeforeRouteLeave.html)。

移除一个覆盖了 `app/middleware/` 目录中同名中间件的具名中间件，会恢复原来的中间件。如果该名称此后又被用不同的函数注册过，那么返回的函数不会做任何事情。

## 示例

### 命名路由中间件

命名路由中间件通过传入一个字符串作为第一个参数、一个函数作为第二个参数来定义：

```ts [app/plugins/my-plugin.ts]
export default defineNuxtPlugin(() => {
  addRouteMiddleware('named-middleware', () => {
    console.log('在 Nuxt 插件中添加了命名中间件')
  })
})
```

当在插件中定义时，它会覆盖 `app/middleware/` 目录中任何同名的已有中间件。

### 全局路由中间件

全局路由中间件可以通过两种方式定义：

- 直接传入一个函数作为第一个参数，不带名称。它会被自动视为全局中间件，并在每次路由变化时应用。

  ```ts [app/plugins/my-plugin.ts]
  export default defineNuxtPlugin(() => {
    addRouteMiddleware((to, from) => {
      console.log('在每次路由变化时运行的匿名全局中间件')
    })
  })
  ```

- 设置一个可选的第三个参数 `{ global: true }` 来指示该路由中间件是否是全局的。

  ```ts [app/plugins/my-plugin.ts]
  export default defineNuxtPlugin(() => {
    addRouteMiddleware('global-middleware', (to, from) => {
      console.log('在每次路由变化时运行的全局中间件')
    },
    { global: true },
    )
  })
  ```

---
title: 'abortNavigation'
description: 'abortNavigation 是一个辅助函数，用于阻止导航的发生，并在设置了参数时抛出错误。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

:warning
`abortNavigation` 只能在[路由中间件处理器](/docs/directory-structure/app/middleware)内部使用。
:

## 类型

```ts [Signature]
export function abortNavigation (err?: Error | string): false
```

## 参数

### `err`

- **类型**：[`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | `string`

  由 `abortNavigation` 抛出的可选错误。

## 示例

下面的示例展示了如何在路由中间件中使用 `abortNavigation` 来阻止未授权的路由访问：

```ts [app/middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState('user')

  if (!user.value.isAuthorized) {
    return abortNavigation()
  }

  if (to.path !== '/edit-post') {
    return navigateTo('/edit-post')
  }
})
```

### `err` 作为字符串

你可以将错误作为字符串传入：

```ts [app/middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  const user = useState('user')

  if (!user.value.isAuthorized) {
    return abortNavigation('权限不足。')
  }
})
```

### `err` 作为 Error 对象

你可以将错误作为 [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) 对象传入，例如被 `catch` 块捕获的错误：

```ts [app/middleware/auth.ts]
export default defineNuxtRouteMiddleware((to, from) => {
  try {
    /* 可能抛出错误的代码 */
  } catch (err) {
    return abortNavigation(err)
  }
})
```

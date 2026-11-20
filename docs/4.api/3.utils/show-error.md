---
title: 'showError'
description: Nuxt 提供了一种快速且简单的方式，在需要的时候显示全屏错误页。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/error.ts
    size: xs
---

在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中，你可以使用 `showError` 来显示错误。

**参数：**

- `error`：`string | Error | Partial<{ cause, data, message, name, stack, status, statusText }>`

```ts
showError('😱 哦不，抛出了一个错误。')
showError({
  status: 404,
  statusText: 'Page Not Found',
})
```

该错误通过 [`useError()`](/docs/api/composables/use-error) 设置在状态中，从而在组件间创建一个可响应的、SSR 友好的共享错误状态。

::tip
`showError` 会调用 `app:error` 钩子。
::

:read-more{to="/docs/getting-started/error-handling"}

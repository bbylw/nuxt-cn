---
title: 'setResponseStatus'
description: setResponseStatus 设置响应的状态码（以及可选的 statusText）。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ssr.ts
    size: xs
---

Nuxt 提供了组合式函数和工具，以提供一流的服务器端渲染支持。

`setResponseStatus` 设置响应的状态码（以及可选的 statusText）。

::important
`setResponseStatus` 只能在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中调用。
::

```ts
const event = useRequestEvent()

// 在浏览器中 event 会是 undefined
if (event) {
  // 为自定义 404 页面将状态码设为 404
  setResponseStatus(event, 404)

  // 同时也设置状态信息
  setResponseStatus(event, 404, 'Page Not Found')
}
```

::note
在浏览器中，`setResponseStatus` 没有任何效果。
::

:read-more{to="/docs/getting-started/error-handling"}

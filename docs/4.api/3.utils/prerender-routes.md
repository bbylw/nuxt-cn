---
title: 'prerenderRoutes'
description: prerenderRoutes 向 Nitro 暗示预渲染一个额外的路由。
minimalVersion: "3.8"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ssr.ts
    size: xs
---

在预渲染时，你可以向 Nitro 暗示预渲染额外的路径，即使这些 URL 并没有出现在所生成页面的 HTML 中。

::important
`prerenderRoutes` 只能在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中调用。
::

::note
`prerenderRoutes` 必须在预渲染期间执行。如果 `prerenderRoutes` 被用于未被预渲染的动态页面/路由，那么它不会被执行。
::

```ts
const route = useRoute()

prerenderRoutes('/')
prerenderRoutes(['/', '/about'])
```

::note
在浏览器中，或者在预渲染之外被调用时，`prerenderRoutes` 没有任何效果。
::

你甚至可以预渲染 API 路由，这对于完全静态生成的站点（SSG）特别有用，因为这样你就可以 `$fetch` 数据，就好像你有一个可用的服务器一样！

```ts
prerenderRoutes('/api/content/article/name-of-article')

// 稍后应用中的某处
const articleContent = await $fetch('/api/content/article/name-of-article', {
  responseType: 'json',
})
```

::warning
生产环境中预渲染的 API 路由可能不会返回预期的响应头，这取决于你所部署的平台。例如，一个 JSON 响应可能会被以 `application/octet-stream` 的 content type 提供。
在 fetch 预渲染的 API 路由时，始终手动设置 `responseType`。
::

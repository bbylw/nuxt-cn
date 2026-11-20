---
title: 'useRequestURL'
description: '使用 useRequestURL 组合式函数访问传入的请求 URL。'
minimalVersion: "3.5"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/url.ts
    size: xs
---

`useRequestURL` 是一个辅助函数，返回在服务端和客户端都能工作的 [URL 对象](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL)。

::important
当使用带有缓存策略的[混合渲染](/docs/guide/concepts/rendering#hybrid-rendering)时，在处理经 [Nitro 缓存层](https://nitro.build/guide/cache) 缓存的响应时会丢弃所有传入的请求头（意味着 `useRequestURL` 的 `host` 将返回 `localhost`）。

你可以定义 [`cache.varies` 选项](https://nitro.build/guide/cache#options) 来指定在缓存和提供响应时会考虑的请求头，例如多租户环境中的 `host` 和 `x-forwarded-host`。
::

::note
如果你设置了 [`app.baseURL`](/docs/api/nuxt-config#baseurl)，服务端返回的路径是相对于它的，因此 `/base/about` 会被当作 `/about` 提供。而在客户端，`useRequestURL` 读取的是 `window.location`，其中包含 baseURL。
::

::code-group

```vue [app/pages/about.vue]
<script setup lang="ts">
const url = useRequestURL()
</script>

<template>
  <p>URL 是：{{ url }}</p>
  <p>路径是：{{ url.pathname }}</p>
</template>
```

```html [在开发环境中的结果]
<p>URL 是：http://localhost:3000/about</p>
<p>路径是：/about</p>
```

::

::tip{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/API/URL#instance_properties" target="_blank"}
在 MDN 文档中阅读关于 URL 实例属性的内容。
::

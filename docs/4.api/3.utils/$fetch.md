---
title: "$fetch"
description: Nuxt 使用 ofetch 全局暴露了 $fetch 辅助函数，用于发起 HTTP 请求。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/entry.ts
    size: xs
---

Nuxt 使用 [ofetch](https://github.com/unjs/ofetch) 全局暴露了 `$fetch` 辅助函数，用于在 Vue 应用或 API 路由中发起 HTTP 请求。

:tip{icon="i-lucide-rocket"}
在服务端渲染期间，调用 `$fetch` 来获取你内部的 [API 路由](/docs/directory-structure/server) 会直接调用相关函数（模拟请求），**省去额外的一次 API 调用**。
:

:note{color="blue" icon="i-lucide-info"}
在组件中使用 `$fetch` 而不用 [`useAsyncData`](/docs/api/composables/use-async-data) 包裹，会导致数据被获取两次：先在服务端获取一次，然后在客户端 hydration 期间再获取一次，因为 `$fetch` 不会将状态从服务端转移到客户端。因此 fetch 会在两端都执行，因为客户端必须重新获取数据。
:

## 用法

我们推荐使用 [`useFetch`](/docs/api/composables/use-fetch) 或 [`useAsyncData`](/docs/api/composables/use-async-data) + `$fetch` 来防止在获取组件数据时重复获取数据。

```vue [app/app.vue]
<script setup lang="ts">
// 在 SSR 期间数据被获取两次，一次在服务端，一次在客户端。
const dataTwice = await $fetch('/api/item')

// 在 SSR 期间数据只在服务端获取一次，并被转移到客户端。
const { data } = await useAsyncData('item', () => $fetch('/api/item'))

// 你也可以将 useFetch 作为 useAsyncData + $fetch 的简写
const { data } = await useFetch('/api/item')
</script>
```

:read-more{to="/docs/getting-started/data-fetching"}

你可以在任何只在客户端执行的方法中使用 `$fetch`。

```vue [app/pages/contact.vue]
<script setup lang="ts">
async function contactForm () {
  await $fetch('/api/contact', {
    method: 'POST',
    body: { hello: 'world' },
  })
}
</script>

<template>
  <button @click="contactForm">
    联系我们
  </button>
</template>
```

:tip
`$fetch` 是在 Nuxt 中发起 HTTP 调用的首选方式，而不是为 Nuxt 2 设计的 [@nuxt/http](https://github.com/nuxt/http) 和 [@nuxtjs/axios](https://github.com/nuxt-community/axios-module)。
:

:note
如果你在开发中使用 `$fetch` 调用带有自签名证书的（外部）HTTPS URL，你将需要在环境中设置 `NODE_TLS_REJECT_UNAUTHORIZED=0`。
:

### 传递请求头和 Cookie

当我们在浏览器中调用 `$fetch` 时，诸如 `cookie` 之类的用户请求头会直接发送给 API。

然而，在服务端渲染期间，出于**服务端请求伪造（SSRF）**或**鉴权滥用**等安全风险， `$fetch` 不会包含用户的浏览器 cookie，也不会传递 fetch 响应中的 cookie。

:code-group

```vue [app/pages/index.vue]
<script setup lang="ts">
// 在 SSR 期间这不会转发请求头或 cookie
const { data } = await useAsyncData(() => $fetch('/api/cookies'))
</script>
```

```ts [server/api/cookies.ts]
export default defineEventHandler((event) => {
  const foo = getCookie(event, 'foo')
  // ... 对 cookie 做一些处理
})
```
:

如果你需要在服务端转发请求头和 cookie，必须手动传递它们：

```vue [app/pages/index.vue]
<script setup lang="ts">
// 这会将用户的请求头和 cookie 转发给 `/api/cookies`
const requestFetch = useRequestFetch()
const { data } = await useAsyncData(() => requestFetch('/api/cookies'))
</script>
```

不过，当在服务端用相对 URL 调用 `useFetch` 时，Nuxt 会使用 [`useRequestFetch`](/docs/api/composables/use-request-fetch) 来代理请求头和 cookie（不打算转发的请求头，如 `host` 除外）。

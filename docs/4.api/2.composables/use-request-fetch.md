---
title: 'useRequestFetch'
description: '使用 useRequestFetch 组合式函数为服务端 fetch 请求转发请求上下文和请求头。'
minimalVersion: "3.2"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ssr.ts
    size: xs
---

你可以使用 `useRequestFetch` 来转发请求上下文和请求头，当发起服务端 fetch 请求时。

当发起客户端 fetch 请求时，浏览器会自动发送必要的请求头。
然而，在服务端渲染期间发起请求时，出于安全考虑，我们需要手动转发请求头。

:note
**不打算转发**的请求头将**不会**包含在请求中。这些请求头包括，例如：
`transfer-encoding`、`connection`、`keep-alive`、`upgrade`、`expect`、`host`、`accept`
:

:tip
[`useFetch`](/docs/api/composables/use-fetch) 组合式函数在底层使用 `useRequestFetch` 来自动转发请求上下文和请求头。
:

:code-group

```vue [app/pages/index.vue]
<script setup lang="ts">
// 这会将用户的请求头转发给 `/api/cookies` 事件处理器
// 结果：{ cookies: { foo: 'bar' } }
const requestFetch = useRequestFetch()
const { data: forwarded } = await useAsyncData(() => requestFetch('/api/cookies'))

// 这不会转发任何内容
// 结果：{ cookies: {} }
const { data: notForwarded } = await useAsyncData((_nuxtApp, { signal }) => $fetch('/api/cookies', { signal }))
</script>
```

```ts [server/api/cookies.ts]
export default defineEventHandler((event) => {
  const cookies = parseCookies(event)

  return { cookies }
})
```

:

:tip
在客户端导航期间的浏览器中，`useRequestFetch` 的行为就像常规 [`$fetch`](/docs/api/utils/dollarfetch) 一样。
:

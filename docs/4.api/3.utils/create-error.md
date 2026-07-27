---
title: 'createError'
description: 创建一个带有附加元数据的错误对象。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/error.ts
    size: xs
---

你可以使用这个函数创建一个带有附加元数据的错误对象。它在你的应用中的 Vue 部分和 Nitro 部分都可用，并且应当被抛出。

## 参数

- `err`：`string | { cause, data, message, name, stack, status, statusText, fatal }`

你可以向 `createError` 函数传入一个字符串或一个对象。如果传入字符串，它会被用作错误的 `message`，并且 `status` 默认为 `500`。如果传入对象，你可以设置错误的多个属性，例如 `status`、`message` 和其他错误属性。

## 在 Vue 应用中

如果你抛出由 `createError` 创建的错误：

- 在服务端，它会触发一个全屏错误页面，你可以用 `clearError` 清除。
- 在客户端，它会抛出一个非致命错误供你处理。如果你需要触发全屏错误页面，则可以通过将 `fatal: true` 来实现。

### 示例

```vue [app/pages/movies/[slug\\].vue]
<script setup lang="ts">
const route = useRoute()
const { data } = await useFetch(`/api/movies/${route.params.slug}`)
if (!data.value) {
  throw createError({ status: 404, statusText: 'Page Not Found' })
}
</script>
```

### 错误原因（Error Causes）

你可以在创建错误时传入一个 `cause`，以保留你所包装的原始错误：

```ts
try {
  await fetchMovie(route.params.slug)
} catch (cause) {
  throw createError({
    status: 500,
    message: 'Could not load movie',
    cause,
  })
}
```

在开发环境中，原因链会通过错误的 `cause` 属性暴露给你的[错误页面](/docs/getting-started/error-handling#error-page)，被序列化为 `{ name, message, stack, cause }`（原始原因原样透传；其他值则被省略）。在生产环境中，原因永远不会包含在错误响应或错误页面的 payload 中。

## 在 API 路由中

使用 `createError` 来在服务器 API 路由中触发错误处理。

### 示例

```ts [server/api/error.ts]
export default eventHandler(() => {
  throw createError({
    status: 404,
    statusText: 'Page Not Found',
  })
})
```

在 API 路由中，推荐使用传入一个简短 `statusText` 对象的 `createError`，因为它可以在客户端访问。否则，在 API 路由中传给 `createError` 的 `message` 不会传播到客户端。作为替代，你可以使用 `data` 属性将数据传回客户端。当用 `useFetch` 处理错误时，自定义数据可在 `error.value.data.data` 处访问。无论如何，始终避免将动态用户输入放入 message 中，以防潜在的安全问题。

:read-more{to="/docs/getting-started/error-handling"}

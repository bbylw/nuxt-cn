---
title: "useRoute"
description: useRoute 组合式函数返回当前路由。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

:note
在 Vue 组件的模板中，你可以使用 `$route` 访问路由。
:

`useRoute` 组合式函数是对 `vue-router` 中同名组合式函数的封装，用于在 Nuxt 应用中访问当前路由。

关键区别在于，在 Nuxt 中，该组合式函数确保路由**仅**在导航后页面内容发生变化时才更新。
相比之下，`vue-router` 版本会**立即**更新路由，这可能导致模板中依赖路由元数据的不同部分之间出现同步问题。

## 示例

在下面的示例中，我们通过 [`useFetch`](/docs/api/composables/use-fetch)，使用动态页面参数 `slug` 作为 URL 的一部分来调用 API。

```html [~/pages/[slug\\].vue]
<script setup lang="ts">
const route = useRoute()
const { data: mountain } = await useFetch(`/api/mountains/${route.params.slug}`)
</script>

<template>
  <div>
    <h1>{{ mountain.title }}</h1>
    <p>{{ mountain.description }}</p>
  </div>
</template>
```

如果你需要访问路由查询参数（例如路径 `/test?example=true` 中的 `example`），则可以使用 `useRoute().query` 而不是 `useRoute().params`。

## API

除了动态参数和查询参数，`useRoute()` 还提供以下与当前路由相关的计算引用：

- `fullPath`：与当前路由关联的编码 URL，包含 path、query 和 hash
- `hash`：URL 中以 # 开头的已解码 hash 部分
- `query`：访问路由查询参数
- `matched`：包含当前路由位置的规范化匹配路由数组
- `meta`：附加到记录上的自定义数据
- `name`：路由记录的唯一名称
- `path`：URL 的已编码路径名部分
- `redirectedFrom`：在进入当前路由位置之前尝试访问的路由位置

## 常见陷阱

### 路由同步问题

务必使用来自 Nuxt 的 `useRoute()` 组合式函数，而不是来自 `vue-router` 的那个，以避免页面导航期间的同步问题。
直接从 `vue-router` 导入 `useRoute` 会绕过 Nuxt 的实现。

```ts twoslash
// ❌ 不要从 `vue-router` 使用 `useRoute`
// @errors: 2300
import { useRoute } from 'vue-router'
// ✅ 使用 Nuxt 的 `useRoute` 组合式函数
import { useRoute } from '#app'
```

### 在中间件中调用 `useRoute`

不建议在中间件中使用 `useRoute`，因为它可能导致意外行为。
中间件中没有「当前路由」的概念。
`useRoute()` 组合式函数只应在 Vue 组件的 setup 函数或 Nuxt 插件中使用。

:warning
这也适用于任何内部使用了 `useRoute()` 的组合式函数。
:

:read-more{to="/docs/directory-structure/app/middleware"}
在中间件章节阅读更多关于访问路由的内容。
:

### `route.fullPath` 的 hydration 问题

浏览器在发起请求时不会发送 [URL 片段](https://url.spec.whatwg.org/#concept-url-fragment)（例如 `#foo`）。因此使用 `route.fullPath` 来影响模板可能会触发 hydration 问题，因为它在客户端会包含片段而在服务端不会。

:read-more{icon="i-simple-icons-vuedotjs" to="https://router.vuejs.org/api/type-aliases/RouteLocationNormalizedLoaded.html"}

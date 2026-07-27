---
title: 'createUseFetch'
description: 一个工厂函数，用于创建带有预定义默认选项的自定义 useFetch 组合式函数。
minimalVersion: "4.2"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/fetch.ts
    size: xs
---

`createUseFetch` 创建带有预定义选项的自定义 [`useFetch`](/docs/api/composables/use-fetch) 组合式函数。生成的组合式函数完全类型化，工作方式也与 `useFetch` 完全相同，只是把你预设的默认值烘焙了进去。

:note
`createUseFetch` 是一个编译器宏。它必须作为**导出**声明用在 `composables/` 目录（或任何被 Nuxt 编译器扫描的目录）中。Nuxt 会在构建时自动注入去重 key。
:

## 用法

```ts [app/composables/useAPI.ts]
export const useAPI = createUseFetch({
  baseURL: 'https://api.nuxt.com',
})
```

```vue [app/pages/modules.vue]
<script setup lang="ts">
const { data: modules } = await useAPI('/modules')
</script>
```

生成的 `useAPI` 组合式函数与 [`useFetch`](/docs/api/composables/use-fetch) 拥有相同的签名和返回类型，调用者可以使用或覆盖所有选项。

## 类型

```ts [Signature]
function createUseFetch (
  options?: Partial<UseFetchOptions>,
): typeof useFetch

function createUseFetch (
  options: (callerOptions: UseFetchOptions) => Partial<UseFetchOptions>,
): typeof useFetch
```

## Options

`createUseFetch` 接受与 [`useFetch`](/docs/api/composables/use-fetch#parameters) 相同的所有选项，包括 `baseURL`、`headers`、`query`、`onRequest`、`onResponse`、`server`、`lazy`、`transform`、`getCachedData` 等。

完整的选项列表见 [`useFetch` 文档](/docs/api/composables/use-fetch#parameters)。

## 默认模式 vs 覆盖模式

### 默认模式（纯对象）

当你传入一个纯对象时，工厂选项作为**默认值**。调用者可以覆盖任何选项：

```ts [app/composables/useAPI.ts]
export const useAPI = createUseFetch({
  baseURL: 'https://api.nuxt.com',
  lazy: true,
})
```

```ts
// 使用默认的 baseURL
const { data } = await useAPI('/modules')

// 调用者覆盖了 baseURL
const { data } = await useAPI('/modules', { baseURL: 'https://other-api.com' })
```

### 覆盖模式（函数）

当你传入一个函数时，工厂选项会**覆盖**调用者的选项。该函数接收调用者的选项作为参数，因此你可以读取它们来计算覆盖值：

```ts [app/composables/useAPI.ts]
// 无论调用者传入什么，baseURL 始终被强制使用
export const useAPI = createUseFetch(callerOptions => ({
  baseURL: 'https://api.nuxt.com',
}))
```

这对于强制设置诸如鉴权请求头或不应被调用者更改的特定 base URL 等配置很有用。

## 配合自定义 `$fetch` 使用

你可以向 `createUseFetch` 传入一个自定义的 `$fetch` 实例：

```ts [app/composables/useAPI.ts]
export const useAPI = createUseFetch(callerOptions => ({
  $fetch: useNuxtApp().$api as typeof $fetch,
  ...callerOptions,
}))
```

:important
此处需要**函数签名**（覆盖模式），这样 [`useNuxtApp()`](/docs/api/composables/use-nuxt-app) 才会在 setup 上下文中（组合式函数调用位置）被调用，而不是在模块作用域中调用——模块作用域中没有可用的 Nuxt 实例。
:

:read-more{to="/docs/guide/recipes/custom-usefetch"}

:read-more{to="/docs/api/composables/use-fetch"}

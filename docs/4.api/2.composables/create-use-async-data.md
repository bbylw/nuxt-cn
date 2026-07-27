---
title: 'createUseAsyncData'
description: 一个工厂函数，用于创建带有预定义默认选项的自定义 useAsyncData 组合式函数。
minimalVersion: "4.2"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/asyncData.ts
    size: xs
---

`createUseAsyncData` 创建带有预定义选项的自定义 [`useAsyncData`](/docs/api/composables/use-async-data) 组合式函数。生成的组合式函数完全类型化，工作方式也与 `useAsyncData` 完全相同，只是把你预设的默认值烘焙了进去。

:note
`createUseAsyncData` 是一个编译器宏。它必须作为**导出**声明用在 `composables/` 目录（或任何被 Nuxt 编译器扫描的目录）中。Nuxt 会在构建时自动注入去重 key。
:

## 用法

```ts [app/composables/useCachedData.ts]
export const useCachedData = createUseAsyncData({
  getCachedData (key, nuxtApp) {
    return nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  },
})
```

```vue [app/pages/index.vue]
<script setup lang="ts">
const { data: mountains } = await useCachedData(
  'mountains',
  () => $fetch('https://api.nuxtjs.dev/mountains'),
)
</script>
```

生成的组合式函数与 [`useAsyncData`](/docs/api/composables/use-async-data) 拥有相同的签名和返回类型，调用者可以使用或覆盖所有选项。

## 类型

```ts [Signature]
function createUseAsyncData (
  options?: Partial<AsyncDataOptions>,
): typeof useAsyncData

function createUseAsyncData (
  options: (callerOptions: AsyncDataOptions) => Partial<AsyncDataOptions>,
): typeof useAsyncData
```

## Options

`createUseAsyncData` 接受与 [`useAsyncData`](/docs/api/composables/use-async-data#parameters) 相同的所有选项，包括 `server`、`lazy`、`immediate`、`default`、`transform`、`pick`、`getCachedData`、`deep`、`dedupe`、`timeout` 和 `watch`。

完整的选项列表见 [`useAsyncData` 文档](/docs/api/composables/use-async-data#parameters)。

## 默认模式 vs 覆盖模式

### 默认模式（纯对象）

当你传入一个纯对象时，工厂选项作为**默认值**。调用者可以覆盖任何选项：

```ts [app/composables/useLazyData.ts]
export const useLazyData = createUseAsyncData({
  lazy: true,
  server: false,
})
```

```ts
// 使用默认值（lazy: true, server: false）
const { data } = await useLazyData('key', () => fetchSomeData())

// 调用者将 server 覆盖为 true
const { data } = await useLazyData('key', () => fetchSomeData(), { server: true })
```

### 覆盖模式（函数）

当你传入一个函数时，工厂选项会**覆盖**调用者的选项。该函数接收调用者的选项作为参数：

```ts [app/composables/useStrictData.ts]
// deep 始终被强制为 false
export const useStrictData = createUseAsyncData(callerOptions => ({
  deep: false,
}))
```

:read-more{to="/docs/guide/recipes/custom-usefetch"}

:read-more{to="/docs/api/composables/use-async-data"}

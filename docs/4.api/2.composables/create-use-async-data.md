---
title: 'createUseAsyncData'
description: 一个工厂函数，用于创建带有预定义默认选项的自定义 useAsyncData 组合式函数。
minimalVersion: "4.4"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/asyncData.ts
    size: xs
---

`createUseAsyncData` 创建带有预定义选项的自定义 [`useAsyncData`](/docs/api/composables/use-async-data) 组合式函数。生成的组合式函数完全类型化，工作方式也与 `useAsyncData` 完全相同，只是把你预设的默认值烘焙了进去。

::note
`createUseAsyncData` 是一个编译器宏。它必须作为**导出**声明用在 `composables/` 目录（或任何被 Nuxt 编译器扫描的目录）中。Nuxt 会在构建时自动注入去重 key。
::

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
function createUseAsyncData<
  FResT,
  FDataT = FResT,
  FPickKeys extends KeysOf<FDataT> = KeysOf<FDataT>,
  FDefaultT = undefined,
  const FAddons extends ReadonlyArray<UseAsyncDataAddon<any, any>> = [],
> (
  options?: Partial<AsyncDataOptions<FResT, FDataT, FPickKeys, FDefaultT>> & { addons?: FAddons },
): UseAsyncData<FResT, FDataT, FPickKeys, FDefaultT, MergedAddonsOptions<FAddons>, MergedAddonsExtensions<FAddons>>

function createUseAsyncData<
  FResT,
  FDataT = FResT,
  FPickKeys extends KeysOf<FDataT> = KeysOf<FDataT>,
  FDefaultT = undefined,
> (
  options: (callerOptions: AsyncDataOptions<unknown>) => Partial<AsyncDataOptions<FResT, FDataT, FPickKeys, FDefaultT>>,
): UseAsyncData<FResT, FDataT, FPickKeys, FDefaultT>
```

返回的组合式函数的签名会包含由 [addon](#addons) 提供的自定义选项与返回值扩展。

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

## Addons

除了 `useAsyncData` 选项之外，`createUseAsyncData` 还接受一个 `addons` 数组 :badge[v4.6]{color="info" size="xs" class="align-middle"}。Addon 是使用 [`defineUseAsyncDataAddon`](/docs/api/utils/define-use-async-data-addon) 定义的可复用行为单元。它们可以声明调用处的自定义选项、在 handler 外层运行中间件、扩展返回的对象，以及为组合式函数附加自定义逻辑。

例如下面这个 addon：每当窗口重新获得焦点时刷新数据，并通过自定义的 `refreshOnFocus` 选项加以控制，因此调用者可以按每次调用自行选择开启：

```ts [app/composables/useCustomAsyncData.ts]
import { useWindowFocus } from '@vueuse/core'

const refreshOnFocus = defineUseAsyncDataAddon({
  // 👇 为这个自定义的 useAsyncData 实例扩展调用处的选项
  setup: (options: UseAsyncDataAddonOptions<{ refreshOnFocus?: boolean }>) => {
    // 👈 在创建 `useAsyncData` 实例*之前*运行的代码
    if (import.meta.server || !options.refreshOnFocus) { return }

    return (asyncData) => {
      // 👈 在创建 `useAsyncData` 实例*之后*运行的代码
      const focused = useWindowFocus()
      watch(focused, (focused) => {
        if (focused) { asyncData.refresh() }
      })

      return { focused } // 👈 用新属性扩展返回的对象
    }
  },
})

export const useCustomAsyncData = createUseAsyncData({ addons: [refreshOnFocus] })
```

```vue [app/pages/index.vue]
<script setup lang="ts">
// `refreshOnFocus` 在创建出的组合式函数上是有类型的
const { data } = await useCustomAsyncData(
  'mountains',
  () => $fetch('https://api.nuxtjs.dev/mountains'),
  { refreshOnFocus: true },
)
</script>
```

:read-more{to="/docs/api/utils/define-use-async-data-addon"}

:read-more{to="/docs/guide/recipes/custom-usefetch"}

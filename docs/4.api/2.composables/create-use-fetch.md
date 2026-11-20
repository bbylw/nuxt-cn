---
title: 'createUseFetch'
description: 一个工厂函数，用于创建带有预定义默认选项的自定义 useFetch 组合式函数。
minimalVersion: "4.4"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/fetch.ts
    size: xs
---

`createUseFetch` 创建带有预定义选项的自定义 [`useFetch`](/docs/api/composables/use-fetch) 组合式函数。生成的组合式函数完全类型化，工作方式也与 `useFetch` 完全相同，只是把你预设的默认值烘焙了进去。

::note
`createUseFetch` 是一个编译器宏。它必须作为**导出**声明用在 `composables/` 目录（或任何被 Nuxt 编译器扫描的目录）中。Nuxt 会在构建时自动注入去重 key。
::

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
  options?: Partial<UseFetchOptions> & { addons?: UseFetchAddon[] },
): typeof useFetch

function createUseFetch (
  options: (callerOptions: UseFetchOptions) => Partial<UseFetchOptions>,
): typeof useFetch

// 其中由客户端声明它要调用哪些路由
function createUseFetch<Routes> (
  options: Partial<UseFetchOptions> & { routes: Routes, addons?: UseFetchAddon[] },
): DeclaredUseFetch<Routes>
```

返回的组合式函数的签名会包含由 [addon](#addons) 提供的自定义选项与返回值扩展。

## Options

`createUseFetch` 接受与 [`useFetch`](/docs/api/composables/use-fetch#parameters) 相同的所有选项，包括 `baseURL`、`headers`、`query`、`onRequest`、`onResponse`、`server`、`lazy`、`transform`、`getCachedData` 等。

完整的选项列表见 [`useFetch` 文档](/docs/api/composables/use-fetch#parameters)。

## 为第三方 API 定义类型

默认情况下，用 `createUseFetch` 创建的组合式函数的类型来自你自己的服务端所提供的那些路由，
因此对另一个 API 的请求会被解析为 `unknown`。传入 `routes` 来声明那个 API 提供哪些路由，
该组合式函数发出的每个请求都会改为按它来解析：

```ts [app/composables/usePetStore.ts]
import type { DynamicParam, Endpoint } from 'nuxt/app'

interface Pet { id: number, name: string }

interface PetStoreRoutes {
  '/pets': {
    [Endpoint]: {
      GET: { response: Pet[], query: { limit?: number } }
      POST: { response: Pet, body: { name: string } }
    }
    // 一个路径参数，按位置匹配
    [DynamicParam]: {
      [Endpoint]: { GET: { response: Pet } }
    }
  }
}

export const usePetStore = createUseFetch({
  baseURL: 'https://api.example.com',
  routes: {} as PetStoreRoutes,
})
```

```ts
const { data: pets } = await usePetStore('/pets')
//      ^? Pet[]
const { data: pet } = await usePetStore('/pets/42')
//      ^? Pet
await usePetStore('/pets', { method: 'post', body: { name: 'Rex' } })

await usePetStore('/pats')
//                ^ 没有 GET 路由匹配 '/pats'
await usePetStore('/pets', { method: 'put' })
//                          ^ 没有 PUT 路由匹配 '/pets'
await usePetStore('/pets', { method: 'post' })
//                          ^ body 是必填项
```

只有 `routes` 的**类型**会被读取，因此请传入 `{} as Routes`；其值在发出请求之前就会被丢弃。
声明的路径是**按书写原样**匹配的，因为它们就是 API 文档中所写的路径。你不应该给它们加上 `baseURL` 前缀。
在运行时构建出来的路径会被解析为 `unknown`。

::note
客户端声明的那些路由属于它自己。它们不会被加入你应用的路由集合，因此普通的
`$fetch` 和 `useFetch` 不受影响，而这个客户端也不会接受你自己服务端的路径。
::

::tip
上面的接口正是 [`fetchdts`](https://github.com/unjs/fetchdts) 所使用的形式，Nuxt 也是用它为你自己的服务端路由生成类型的。
因此模块可以用 `fetchdts/compiler` 中的 `compileRoutes`，从 API 描述（例如 OpenAPI 文档）生成一份这样的接口，
再把生成的 interface 交给 `routes`。
::

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

::important
此处需要**函数签名**（覆盖模式），这样 [`useNuxtApp()`](/docs/api/composables/use-nuxt-app) 才会在 setup 上下文中（组合式函数调用位置）被调用，而不是在模块作用域中调用——模块作用域中没有可用的 Nuxt 实例。
::

## Addons

除了 `useFetch` 选项之外，`createUseFetch` 还接受一个 `addons` 数组 :badge[v4.6]{color="info" size="xs" class="align-middle"}。Addon 是使用 [`defineUseFetchAddon`](/docs/api/utils/define-use-fetch-addon) 定义的可复用行为单元。它们可以声明调用处的自定义选项、在 handler 外层运行中间件、扩展返回的对象，以及为组合式函数附加自定义逻辑。

例如下面这个 addon：每当窗口重新获得焦点时刷新数据，并通过自定义的 `refreshOnFocus` 选项加以控制，因此调用者可以按每次调用自行选择开启：

```ts [app/composables/useCustomFetch.ts]
import { useWindowFocus } from '@vueuse/core'

const refreshOnFocus = defineUseFetchAddon({
  // 👇 为这个自定义的 useFetch 实例扩展调用处的选项
  setup: (options: UseFetchAddonOptions<{ refreshOnFocus?: boolean }>) => {
    // 👈 在 `useFetch` 中调用 `useAsyncData` *之前*运行的代码
    if (import.meta.server || !options.refreshOnFocus) { return }

    return (asyncData) => {
      // 👈 在 `useFetch` 中调用 `useAsyncData` *之后*运行的代码
      const focused = useWindowFocus()
      watch(focused, (focused) => {
        if (focused) { asyncData.refresh() }
      })

      return { focused } // 👈 用新属性扩展返回的对象
    }
  },
})

export const useCustomFetch = createUseFetch({ addons: [refreshOnFocus] })
```

```vue [app/pages/index.vue]
<script setup lang="ts">
// `refreshOnFocus` 在创建出的组合式函数上是有类型的
const { data } = await useCustomFetch(
  'https://api.nuxtjs.dev/mountains',
  { refreshOnFocus: true },
)
</script>
```

:read-more{to="/docs/api/utils/define-use-fetch-addon"}

:read-more{to="/docs/guide/recipes/custom-usefetch"}

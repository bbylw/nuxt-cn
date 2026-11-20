---
title: 'useFetch'
description: '使用 SSR 友好的组合式函数从 API 端点获取数据。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/fetch.ts
    size: xs
---

该组合式函数提供了对 [`useAsyncData`](/docs/api/composables/use-async-data) 和 [`$fetch`](/docs/api/utils/$fetch) 的便捷封装。它会自动为请求生成 key，基于服务端路由提供请求 url 的类型提示，并推断 API 响应类型。

::note
`useFetch` 是一个组合式函数，意在 setup 函数、插件或路由中间件中直接调用。它返回可响应的组合式值，并处理将响应添加到 Nuxt payload 中，这样它们就可以从服务端传递到客户端，在页面 hydration 时无需在客户端重新获取数据。
::

## 用法

```vue [app/pages/modules.vue]
<script setup lang="ts">
const { data, status, error, refresh, clear } = await useFetch('/api/modules', {
  pick: ['title'],
})
</script>
```

::tip{to="/docs/guide/recipes/custom-usefetch#recipe-api-client-with-auth"}
需要一个带有预定义默认值（如 `baseURL` 或鉴权请求头）的自定义 `useFetch`？使用 `createUseFetch` 创建一个完全类型化的自定义组合式函数。
::

::note
你无需 `await` `useFetch`。在服务端，无论哪种情况 Nuxt 都会等待 promise 解析完成后再渲染，因此返回的 HTML 始终包含数据。`await` 影响的是调用之后发生的事情：使用它时，执行会暂停直到 `data` 被填充，且客户端导航会阻塞直到数据就绪；不使用它时，执行立即继续，`data` 在请求解析完成前保持其默认值，在客户端导航时你需要使用返回的 `status` 和 `error` ref 自行处理加载和错误状态。这与 [`lazy`](#parameters) 选项效果类似，不过 `lazy` 是显式选择非阻塞导航的方式。
::

::note
`data`、`status` 和 `error` 是 Vue ref，在 `<script setup>` 中通过 `.value` 访问它们的值，而 `refresh`/`execute` 和 `clear` 是普通函数。
::

::note
请求 URL、响应，以及匹配 handler 所做的任何 `body`、`query` 或 `headers` 校验，其类型都来自你的服务端所提供的那些路由。在运行时构建的路径会被解析为 `unknown`，而显式命名响应类型（`useFetch<Todo[]>(url)`）会覆盖 Nuxt 解析出的任何类型。阅读更多有关[类型化路由](/docs/getting-started/data-fetching#typed-routes)的内容。
::

使用 `query` 选项，你可以为查询添加搜索参数。该选项继承自 [unjs/ofetch](https://github.com/unjs/ofetch) 并使用 [unjs/ufo](https://github.com/unjs/ufo) 来创建 URL。对象会自动字符串化。

```ts [app/pages/index.vue]
const param1 = ref('value1')
const { data, status, error, refresh } = await useFetch('/api/modules', {
  query: { param1, param2: 'value2' },
})
```

上面的示例会生成 `https://api.nuxt.com/modules?param1=value1&param2=value2`。

你也可以使用 [拦截器](https://github.com/unjs/ofetch#%EF%B8%8F-interceptors)：

```ts [app/pages/index.vue]
const { data, status, error, refresh, clear } = await useFetch('/api/auth/login', {
  onRequest ({ request, options }) {
    // 设置请求头
    // 注意这依赖 ofetch >= 1.4.0——你可能需要刷新你的 lockfile
    options.headers.set('Authorization', '...')
  },
  onRequestError ({ request, options, error }) {
    // 处理请求错误
  },
  onResponse ({ request, response, options }) {
    // 处理响应数据
    localStorage.setItem('token', response._data.token)
  },
  onResponseError ({ request, response, options }) {
    // 处理响应错误
  },
})
```

### 响应式 Key 与共享状态

你可以使用计算 ref 或普通 ref 作为 URL，从而实现动态数据获取，并在 URL 变化时自动更新：

```vue [app/pages/[id\\].vue]
<script setup lang="ts">
const route = useRoute()
const id = computed(() => route.params.id)

// 当路由改变且 id 更新时，数据会自动重新获取
const { data: post } = await useFetch(() => `/api/posts/${id.value}`)
</script>
```

自动生成的 key 对每个调用位置是唯一的，因此在不同组件中以相同的 URL 和选项调用 `useFetch` **不会**共享状态，每次调用都会执行自己的请求。同一个组件的多个实例会共享状态，因为它们使用相同的调用位置。要在不同组件间共享相同的 `data`、`error` 和 `status` ref，请为每个调用提供相同的显式 `key`：

::code-group

```vue [app/components/ComponentA.vue]
<script setup lang="ts">
// 与 ComponentB 共享数据——只发出一个请求
const { data } = await useFetch('/api/random', { key: 'random' })
</script>
```

```vue [app/components/ComponentB.vue]
<script setup lang="ts">
// 与 ComponentA 共享数据——只发出一个请求
const { data } = await useFetch('/api/random', { key: 'random' })
</script>
```

::

::tip
使用 `useFetch` 创建的 keyed 状态可以通过 [`useNuxtData`](/docs/api/composables/use-nuxt-data) 在你的 Nuxt 应用中获取。
::

::warning
`useFetch` 是编译器转换的保留函数名，因此你不应该把自己的函数命名为 `useFetch`。要创建带有预定义选项的自定义变体，请改用 [`createUseFetch`](/docs/api/composables/create-use-fetch)。
::

::warning
如果你遇到从 `useFetch` 解构出的 `data` 变量返回的是字符串而不是 JSON 解析对象，请确保你的组件没有导入类似 `import { useFetch } from '@vueuse/core` 的语句。
::

:video-accordion{title="观看 Alexander Lichter 关于避免错误使用 useFetch 的视频" videoId="njsGVmcWviY"}

:read-more{to="/docs/getting-started/data-fetching"}

### 响应式 Fetch 选项

fetch 选项可以作为响应式提供，支持 `computed`、`ref` 和 [computed getters](https://vuejs.org/guide/essentials/computed)。当响应式 fetch 选项更新时，它会使用更新后的解析值触发重新获取。

```ts [app/pages/index.vue]
const searchQuery = ref('initial')
const { data } = await useFetch('/api/search', {
  query: { q: searchQuery },
})
// 触发重新获取：/api/search?q=new%20search
searchQuery.value = 'new search'
```

如果需要，你可以使用 `watch: false` 关闭此行为：

```ts [app/pages/index.vue]
const searchQuery = ref('initial')
const { data } = await useFetch('/api/search', {
  query: { q: searchQuery },
  watch: false,
})
// 不会触发重新获取
searchQuery.value = 'new search'
```

## 类型

```ts [Signature]
export function useFetch<ResT, ErrorT = NuxtError<unknown>, DataT = ResT> (
  url: string | Request | Ref<string | Request> | (() => string | Request),
  options?: UseFetchOptions<ResT, DataT>,
): AsyncData<DataT, ErrorT> & Promise<AsyncData<DataT, ErrorT>>

type UseFetchOptions<ResT, DataT = ResT> = {
  key?: MaybeRefOrGetter<string>
  method?: MaybeRefOrGetter<string>
  query?: MaybeRefOrGetter<SearchParams>
  body?: MaybeRefOrGetter<RequestInit['body'] | Record<string, any>>
  headers?: MaybeRefOrGetter<Record<string, string> | [key: string, value: string][] | Headers>
  baseURL?: MaybeRefOrGetter<string>
  cache?: false | 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload'
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  getCachedData?: (key: string, nuxtApp: NuxtApp, ctx: AsyncDataRequestContext) => DataT | undefined
  deep?: boolean
  dedupe?: 'cancel' | 'defer'
  timeout?: number
  enabled?: MaybeRefOrGetter<boolean>
  serialize?: boolean
  middleware?: AsyncDataMiddleware<ResT>[]
  default?: () => DataT | Ref<DataT>
  transform?: (input: ResT) => DataT | Promise<DataT>
  pick?: string[]
  $fetch?: typeof globalThis.$fetch
  watch?: MultiWatchSources | false
}

type AsyncDataRequestContext = {
  /** 该数据请求的原因 */
  cause: 'initial' | 'refresh:manual' | 'refresh:hook' | 'watch'
}

type AsyncData<DataT, ErrorT> = {
  data: Ref<DataT | undefined>
  pending: Ref<boolean>
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>
  clear: () => void
  error: Ref<ErrorT | undefined>
  status: Ref<AsyncDataRequestStatus>
}

interface AsyncDataExecuteOptions {
  dedupe?: 'cancel' | 'defer'
  timeout?: number
  signal?: AbortSignal
}

type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error'
```

## 参数

- `URL` (`string | Request | Ref<string | Request> | () => string | Request`)：要获取的 URL 或请求。可以是字符串、Request 对象、Vue ref，或返回字符串/Request 的函数。支持动态端点的响应式。

- `options`（对象）：fetch 请求的配置。继承自 [unjs/ofetch](https://github.com/unjs/ofetch) 选项和 [`AsyncDataOptions`](/docs/api/composables/use-async-data#parameters)。所有选项可以是静态值、`ref` 或计算值。

| 选项 | 类型 | 默认值 | 描述 |
|---------------------------------------------------------------------------|-------------------------------------------------------------------------|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key` | `MaybeRefOrGetter<string>` | 自动生成 | 用于去重的唯一 key。如果未提供，则从 URL、选项和源代码中的调用位置生成。 |
| `method` | `MaybeRefOrGetter<string>` | `'GET'` | HTTP 请求方法。 |
| `query` | `MaybeRefOrGetter<SearchParams>` | - | 要附加到 URL 的查询/搜索参数。 |
| `body` | `MaybeRefOrGetter<RequestInit['body'] \| Record<string, any>>` | - | 请求体。对象会自动字符串化。 |
| `headers` | `MaybeRefOrGetter<Record<string, string> \| [key, value][] \| Headers>` | - | 请求头。 |
| `baseURL` | `MaybeRefOrGetter<string>` | - | 请求的基础 URL。 |
| `cache` | `false \| string` | - | 缓存控制。布尔值禁用缓存，或使用 Fetch API 的值：`default`、`no-store` 等。 |
| `server` | `boolean` | `true` | 是否在服务端获取。 |
| `lazy` | `boolean` | `false` | 如果为 true，则在路由加载后解析（不阻塞导航）。 |
| `immediate` | `boolean` | `true` | 如果为 false，则阻止请求立即发起。 |
| `default` | `() => DataT` | - | 在 async 解析之前 `data` 默认值的工厂函数。 |
| `timeout` :badge[v4.2]{color="info" size="xs" class="align-middle"} | `number` | - | 在请求超时前等待的毫秒数（默认 `undefined`，表示不超时） |
| `transform` | `(input: DataT) => DataT \| Promise<DataT>` | - | 解析后转换结果的函数。 |
| `getCachedData` :badge[v3.8]{color="info" size="xs" class="align-middle"} | `(key, nuxtApp, ctx) => DataT \| undefined` | - | 返回缓存数据的函数。默认实现见下文。 |
| `pick` | `string[]` | - | 仅从结果中挑选指定的 key。 |
| `watch` | `MultiWatchSources \| false` | - | 要监视并自动刷新的响应式源数组。`false` 禁用监视。 |
| `deep` :badge[v3.8]{color="info" size="xs" class="align-middle"} | `boolean` | `false` | 以深层 ref 对象形式返回数据。默认为 `false` 以获得更好性能（浅层 ref 对象）。 |
| `dedupe` :badge[v3.9]{color="info" size="xs" class="align-middle"} | `'cancel' \| 'defer'` | `'cancel'` | 避免同时对同一 key 多次获取。 |
| `enabled` :badge[v4.5]{color="info" size="xs" class="align-middle"} | `boolean` | `true` | 控制请求是否可以运行的屏障。为 `false` 时，每次执行都会被阻塞（初始获取、`execute`/`refresh` 和 watch 触发），且从 `true` → `false` 切换会取消任何进行中的请求而不清除 `data`。重新启用不会自行重新获取。 |
| `serialize` :badge[v4.6]{color="info" size="xs" class="align-middle"} | `boolean` | `true` | 是否把解析后的数据存入 Nuxt payload（`__NUXT_DATA__`）。为 `false` 时，服务端获取的数据不会进入 payload，如果有组件渲染它，客户端会在 hydration 之后重新获取。配合[延迟水合（lazy hydration）](/docs/guide/best-practices/performance#lazy-hydration)使用可以避免 hydration 不匹配和不必要的客户端请求。 |
| `middleware` :badge[v4.6]{color="info" size="xs" class="align-middle"} | `AsyncDataMiddleware[]` | - | 包裹请求执行的函数。每一项都会接收 `next`，它用于执行链中剩余的部分并解析为数据，同时接收 handler 上下文（`{ signal }`）。第一个条目是最外层的包裹。调用 `next()` 以继续，或抛出错误以中止。 |
| `$fetch` :badge[v3.2]{color="info" size="xs" class="align-middle"} | `typeof globalThis.$fetch` | - | 自定义 $fetch 实现。参见 [Nuxt 中的自定义 useFetch](/docs/guide/recipes/custom-usefetch) |

::note
所有 fetch 选项都可以给定 `computed` 或 `ref` 值。这些会被监视，并在更新时使用任何新值自动发起新请求（除非 `watch` 设为 `false`）。
::

**getCachedData 默认值：**

```ts [Default getCachedData Implementation]
const getDefaultCachedData = (key, nuxtApp, ctx) => nuxtApp.isHydrating
  ? nuxtApp.payload.data[key]
  : nuxtApp.static.data[key]
```
这仅在 `nuxt.config` 中启用了 `experimental.payloadExtraction` 时才会缓存数据。

## 返回值

该组合式函数返回一个可以 await 的 `Promise`，这使得可以在 `<script setup>` 中直接使用 `data`（即会有一个值存在，而不是 undefined）。你也可以在不 await 返回值的情况下直接解构这些值，这种情况下直到获取完成之前 `data` 在 `<script setup>` 中可能仍为 undefined。

::tip
即使你不 await 返回值，在 SSR 期间 Nuxt 也会等待请求完成并将解析后的数据发送到客户端。
::

::note
如果你没有在服务端获取数据（例如使用 `server: false`），那么数据在 hydration 完成之前**不会**被获取。这意味着即使在客户端 await [`useFetch`](/docs/api/composables/use-fetch)，`data` 在 `<script setup>` 中也会保持 `undefined`。
::

| 名称 | 类型 | 描述 |
|-----------|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data` | `Ref<DataT \| undefined>` | 异步 fetch 的结果。 |
| `refresh` | `(opts?: AsyncDataExecuteOptions) => Promise<void>` | 手动刷新数据的函数。默认情况下，Nuxt 会等待一次 `refresh` 完成之后才能再次执行。 |
| `execute` | `(opts?: AsyncDataExecuteOptions) => Promise<void>` | `refresh` 的别名。 |
| `error` | `Ref<ErrorT \| undefined>` | 如果数据获取失败的错误对象。 |
| `status` | `Ref<'idle' \| 'pending' \| 'success' \| 'error'>` | 数据请求的状态。用它来区分 `idle`、`pending`、`success` 和 `error`。 |
| `pending` | `Ref<boolean>` | 请求进行中为 `true`。配合 [`experimental.pendingWhenIdle`](/docs/guide/going-further/experimental-features#pendingwhenidle)，当 `status` 为 `idle` 且没有可用缓存数据时也为 `true`。 |
| `clear` | `() => void` | 将 `data` 重置为 `undefined`（或提供了 `options.default()` 时为其值），`error` 重置为 `undefined`，将 `status` 设为 `idle`，并取消任何挂起的请求。 |

::tip
如果你没有 await 返回值，来自 `Promise` 的函数（`then`、`catch` 和 `finally`）可以被安全解构。
::

### 状态值

- `idle`：请求尚未开始（例如 `{ immediate: false }` 或服务端渲染时的 `{ server: false }`）
- `pending`：请求进行中
- `success`：请求成功完成
- `error`：请求失败

### 示例

:link-example{to="/docs/examples/advanced/use-custom-fetch-composable"}

:link-example{to="/docs/examples/features/data-fetching"}

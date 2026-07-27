---
title: 'useAsyncData'
description: useAsyncData 以 SSR 友好的方式提供对异步解析数据的访问。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/asyncData.ts
    size: xs
---

在你的页面、组件和插件中，可以使用 useAsyncData 来获取异步解析的数据。

:note
[`useAsyncData`](/docs/api/composables/use-async-data) 是一个用于在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中直接调用的组合式函数。它返回可响应的组合式值，并处理将响应添加到 Nuxt payload 中，这样它们就可以从服务端传递到客户端，**在页面 hydration 时无需在客户端重新获取数据**。
:

## 用法

```vue [app/pages/index.vue]
<script setup lang="ts">
const { data, status, pending, error, refresh, clear } = await useAsyncData(
  'mountains',
  (_nuxtApp, { signal }) => $fetch('https://api.nuxtjs.dev/mountains', { signal }),
)
</script>
```

:tip{to="/docs/guide/recipes/custom-usefetch#custom-usefetch-with-createusefetch"}
需要一个带有预定义默认值的自定义 `useAsyncData`？使用 `createUseAsyncData` 创建一个完全类型化的自定义组合式函数。详见 [custom useFetch 配方](/docs/guide/recipes/custom-usefetch)。
:

:note
你无需 `await` `useAsyncData`。在服务端，无论哪种情况 Nuxt 都会等待 promise 解析完成后再渲染，因此返回的 HTML 始终包含数据。`await` 影响的是调用之后发生的事情：使用它时，执行会暂停直到 `data` 被填充，且客户端导航会阻塞直到数据就绪；不使用它时，执行立即继续，`data` 在请求解析完成前保持其默认值，在客户端导航时你需要使用返回的 `status` 和 `error` ref 自行处理加载和错误状态。这与 [`lazy`](#parameters) 选项效果类似，不过 `lazy` 是显式选择非阻塞导航的方式。
:

:note
`data`、`status`、`pending` 和 `error` 是 Vue ref。在 `<script setup>` 中通过 `.value` 访问它们的值。`refresh`/`execute` 和 `clear` 是普通函数。
:

### Watch 参数

内置的 `watch` 选项允许在检测到任何变化时自动重新运行 fetcher 函数。

```vue [app/pages/index.vue]
<script setup lang="ts">
const page = ref(1)
const { data: posts } = await useAsyncData(
  'posts',
  (_nuxtApp, { signal }) => $fetch('https://fakeApi.com/posts', {
    params: {
      page: page.value,
    },
    signal,
  }), {
    watch: [page],
  },
)
</script>
```

### 响应式 Key

你可以使用计算 ref、普通 ref 或 getter 函数作为 key，从而实现动态数据获取，并在 key 变化时自动更新：

```vue [app/pages/[id\\].vue]
<script setup lang="ts">
const route = useRoute()
const userId = computed(() => `user-${route.params.id}`)

// 当路由改变且 userId 更新时，数据会自动重新获取
const { data: user } = useAsyncData(
  userId,
  () => fetchUserById(route.params.id),
)
</script>
```

### 使你的 `handler` 可中止

你可以使用第二个参数中提供的 `signal` 让你的 `handler` 函数可中止。这在请求不再需要时（例如用户离开页面时）取消请求很有用。`$fetch` 原生支持中止信号。

```ts [app/pages/index.vue]
const { data, error } = await useAsyncData(
  'users',
  (_nuxtApp, { signal }) => $fetch('/api/users', { signal }),
)

refresh() // 会取消 $fetch 请求（如果 dedupe: cancel）
refresh() // 会取消 $fetch 请求（如果 dedupe: cancel）
refresh()

clear() // 会取消最新的待处理 handler
```

你也可以向 `refresh`/`execute` 函数传入一个 `AbortSignal` 来手动取消单个请求。

```ts [app/pages/index.vue]
const { refresh } = await useAsyncData(
  'users',
  (_nuxtApp, { signal }) => $fetch('/api/users', { signal }),
)
let abortController: AbortController | undefined

function handleUserAction () {
  abortController = new AbortController()
  refresh({ signal: abortController.signal })
}

function handleCancel () {
  abortController?.abort() // 中止正在进行的 refresh 请求
}
```

如果你的 `handler` 函数不支持中止信号，你可以使用提供的 `signal` 实现自己的中止逻辑。

```ts [app/pages/index.vue]
const { data, error } = await useAsyncData(
  'users',
  (_nuxtApp, { signal }) => {
    return new Promise((resolve, reject) => {
      signal?.addEventListener('abort', () => {
        reject(new Error('请求已中止'))
      })
      return Promise.resolve(callback.call(this, yourHandler)).then(resolve, reject)
    })
  },
)
```

handler 信号会在以下情况被中止：

- 使用 `dedupe: 'cancel'` 发起新请求时
- 调用 `clear` 函数时
- 超过 `options.timeout` 时长时

:warning
[`useAsyncData`](/docs/api/composables/use-async-data) 是编译器转换的保留函数名，因此你不应该把自己的函数命名为 [`useAsyncData`](/docs/api/composables/use-async-data)。
:

:read-more{to="/docs/getting-started/data-fetching#useasyncdata"}

## 类型

```ts [Signature]
export type AsyncDataHandler<ResT> = (nuxtApp: NuxtApp, options: { signal: AbortSignal }) => Promise<ResT>

export function useAsyncData<ResT, DataE = unknown, DataT = ResT> (
  handler: AsyncDataHandler<ResT>,
  options?: AsyncDataOptions<ResT, DataT>,
): AsyncData<DataT, DataE> & Promise<AsyncData<DataT, DataE>>
export function useAsyncData<ResT, DataE = unknown, DataT = ResT> (
  key: MaybeRefOrGetter<string>,
  handler: AsyncDataHandler<ResT>,
  options?: AsyncDataOptions<ResT, DataT>,
): AsyncData<DataT, DataE> & Promise<AsyncData<DataT, DataE>>

type AsyncDataOptions<ResT, DataT = ResT> = {
  server?: boolean
  lazy?: boolean
  immediate?: boolean
  deep?: boolean
  dedupe?: 'cancel' | 'defer'
  default?: () => DataT | Ref<DataT>
  transform?: (input: ResT) => DataT | Promise<DataT>
  pick?: string[]
  watch?: MultiWatchSources
  getCachedData?: (key: string, nuxtApp: NuxtApp, ctx: AsyncDataRequestContext) => DataT | undefined
  timeout?: number
  enabled?: MaybeRefOrGetter<boolean>
}

type AsyncDataRequestContext = {
  /** 该数据请求的原因 */
  cause: 'initial' | 'refresh:manual' | 'refresh:hook' | 'watch'
}

type AsyncData<DataT, ErrorT> = {
  data: Ref<DataT | undefined>
  refresh: (opts?: AsyncDataExecuteOptions) => Promise<void>
  execute: (opts?: AsyncDataExecuteOptions) => Promise<void>
  clear: () => void
  error: Ref<ErrorT | undefined>
  status: Ref<AsyncDataRequestStatus>
  pending: Ref<boolean>
}

interface AsyncDataExecuteOptions {
  dedupe?: 'cancel' | 'defer'
  timeout?: number
  signal?: AbortSignal
}

type AsyncDataRequestStatus = 'idle' | 'pending' | 'success' | 'error'
```

:read-more{to="/docs/getting-started/data-fetching"}

## 参数

- `key`：一个唯一的 key，确保数据获取能够在多个请求之间正确去重。如果你不提供 key，则会为你生成一个对 `useAsyncData` 实例的文件名和行号唯一的 key。
- `handler`：一个必须返回真值（例如，不应为 `undefined` 或 `null`）的异步函数，否则请求可能会在客户端被重复。
:warning
`handler` 函数应该是**无副作用**的，以确保在 SSR 和 CSR hydration 期间行为可预测。如果你需要触发副作用，请使用 [`callOnce`](/docs/api/utils/call-once) 工具来实现。
:
- `options`（对象）：异步函数调用的配置。所有选项可以是静态值、`ref` 或计算值。

| 选项 | 类型 | 默认值 | 描述 |
|---------------------------------------------------------------------------|---------------------------------------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `server` | `boolean` | `true` | 是否在服务端调用该函数。 |
| `lazy` | `boolean` | `false` | 如果为 true，则在路由加载后解析（不阻塞导航）。 |
| `immediate` | `boolean` | `true` | 如果为 false，则阻止函数被立即调用。 |
| `default` | `() => DataT` | - | 在 async 解析之前 `data` 默认值的工厂函数。 |
| `timeout` :badge[v4.2]{color="info" size="xs" class="align-middle"} | `number` | - | 在调用超时前等待的毫秒数（默认为 `undefined`，表示不超时） |
| `transform` | `(input: DataT) => DataT \| Promise<DataT>` | - | 解析后转换结果的函数。 |
| `getCachedData` :badge[v3.8]{color="info" size="xs" class="align-middle"} | `(key, nuxtApp, ctx) => DataT \| undefined` | - | 返回缓存数据的函数。默认实现见下文。 |
| `pick` | `string[]` | - | 仅从结果中挑选指定的 key。 |
| `watch` | `MultiWatchSources` | - | 要监视并自动刷新的响应式源数组。 |
| `deep` :badge[v3.8]{color="info" size="xs" class="align-middle"} | `boolean` | `false` | 以深层 ref 对象形式返回数据。默认为 `false` 以获得更好性能（浅层 ref 对象）。 |
| `dedupe` :badge[v3.9]{color="info" size="xs" class="align-middle"} | `'cancel' \| 'defer'` | `'cancel'` | 一次触发多次执行时的策略。 |
| `enabled` :badge[v4.5]{color="info" size="xs" class="align-middle"} | `boolean` | `true` | 控制 `handler` 是否可以运行的屏障。为 `false` 时，每次执行都会被阻塞（初始获取、`execute`/`refresh` 和 watch 触发），且从 `true` → `false` 切换会取消任何进行中的请求而不清除 `data`。重新启用不会自行重新获取。 |

:note
所有选项都可以给定 `computed` 或 `ref` 值。它们会被监视，并在更新时自动发起新请求。
:

**getCachedData 默认值：**

```ts [Default getCachedData Implementation]
const getDefaultCachedData = (key, nuxtApp, ctx) => nuxtApp.isHydrating
  ? nuxtApp.payload.data[key]
  : nuxtApp.static.data[key]
```
这仅在 `nuxt.config` 中启用了 `experimental.payloadExtraction` 时才会缓存数据。

:note
在底层，`lazy: false` 使用 `<Suspense>` 在获取完数据之前阻塞路由的加载。为了更灵敏的用户体验，请考虑改用 `lazy: true` 并实现加载状态。
:

:read-more{to="/docs/api/composables/use-lazy-async-data"}
你可以使用 `useLazyAsyncData` 来获得与 `useAsyncData` 中 `lazy: true` 相同的行为。
:

:video-accordion{title="观看 Alexander Lichter 关于使用 getCachedData 进行客户端缓存的视频" videoId="aQPR0xn-MMk"}

### 共享状态与选项一致性

当多个 `useAsyncData` 调用使用相同的 key 时，它们共享相同的 `data`、`error`、`status` 和 `pending` ref。请保持下列选项在这些调用之间一致。

以下选项**必须一致**（所有使用相同 key 的调用）：

- `handler` 函数
- `deep` 选项
- `transform` 函数
- `pick` 数组
- `getCachedData` 函数
- `default` 值

以下选项**可以不同**（不会触发警告）：

- `server`
- `lazy`
- `immediate`
- `dedupe`
- `watch`
- `enabled`

```ts [app/pages/index.vue]
// ❌ 这会触发一个开发警告
const { data: users1 } = useAsyncData('users', (_nuxtApp, { signal }) => $fetch('/api/users', { signal }), { deep: false })
const { data: users2 } = useAsyncData('users', (_nuxtApp, { signal }) => $fetch('/api/users', { signal }), { deep: true })

// ✅ 这是允许的
const { data: users1 } = useAsyncData('users', (_nuxtApp, { signal }) => $fetch('/api/users', { signal }), { immediate: true })
const { data: users2 } = useAsyncData('users', (_nuxtApp, { signal }) => $fetch('/api/users', { signal }), { immediate: false })
```

:tip
使用 `useAsyncData` 创建的 keyed 状态可以通过 [`useNuxtData`](/docs/api/composables/use-nuxt-data) 在你的 Nuxt 应用中获取。
:

## 返回值

该组合式函数返回一个可以 await 的 `Promise`，这使得可以在 `<script setup>` 中直接使用 `data`（即会有一个值存在，而不是 undefined）。你也可以在不 await 返回值的情况下直接解构这些值，这种情况下直到获取完成之前 `data` 在 `<script setup>` 中可能为 undefined。

:tip
即使你不 await 返回值，在 SSR 期间 Nuxt 也会等待请求完成并将解析后的数据发送到客户端。
:

:note
如果你没有在服务端获取数据（例如使用 `server: false`），那么数据在 hydration 完成之前**不会**被获取。这意味着即使在客户端 await [`useAsyncData`](/docs/api/composables/use-async-data)，`data` 在 `<script setup>` 中也会保持 `undefined`。
:

| 名称 | 类型 | 描述 |
|-----------|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data` | `Ref<DataT \| undefined>` | 传入的异步函数的结果。 |
| `refresh` | `(opts?: AsyncDataExecuteOptions) => Promise<void>` | 手动刷新数据的函数。默认情况下，Nuxt 会等待一次 `refresh` 完成之后才能再次执行。 |
| `execute` | `(opts?: AsyncDataExecuteOptions) => Promise<void>` | `refresh` 的别名。 |
| `error` | `Ref<ErrorT \| undefined>` | 如果异步函数抛出错误时的错误对象。 |
| `status` | `Ref<'idle' \| 'pending' \| 'success' \| 'error'>` | 异步函数调用的状态。用它来区分 `idle`、`pending`、`success` 和 `error`。 |
| `pending` | `Ref<boolean>` | 请求进行中为 `true`。配合 [`experimental.pendingWhenIdle`](/docs/guide/going-further/experimental-features#pendingwhenidle)，当 `status` 为 `idle` 且没有可用缓存数据时也为 `true`。 |
| `clear` | `() => void` | 将 `data` 重置为 `undefined`（或提供了 `options.default()` 时为其值），`error` 重置为 `undefined`，将 `status` 设为 `idle`，并取消任何挂起的调用。 |

:tip
如果你没有 await 返回值，来自 `Promise` 的函数（`then`、`catch` 和 `finally`）可以被安全解构。
:

### 状态值

- `idle`：函数尚未被调用（例如 `{ immediate: false }` 或服务端渲染时的 `{ server: false }`）
- `pending`：函数已被调用且 promise 处于挂起状态
- `success`：函数返回了一个值
- `error`：函数抛出了错误

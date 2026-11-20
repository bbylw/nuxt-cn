---
title: 'useLazyFetch'
description: 该组合式函数是对 useFetch 的封装，会在 handler 解析之前立即触发导航。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/fetch.ts
    size: xs
---

`useLazyFetch` 提供了对 [`useFetch`](/docs/api/composables/use-fetch) 的封装，通过将 `lazy` 选项设为 `true`，在 handler 解析之前就触发导航。

## 用法

默认情况下，[`useFetch`](/docs/api/composables/use-fetch) 会阻塞导航直到其 async handler 解析完成。`useLazyFetch` 允许在后台继续获取数据时立即发生导航。

```vue [app/pages/index.vue]
<script setup lang="ts">
const { status, data: posts } = await useLazyFetch('/api/posts')
</script>

<template>
  <div v-if="status === 'pending'">
    Loading ...
  </div>
  <div v-else-if="status === 'error'">
    Error loading posts
  </div>
  <div v-else>
    <div v-for="post in posts">
      <!-- do something -->
    </div>
  </div>
</template>
```

::note
`useLazyFetch` 与 [`useFetch`](/docs/api/composables/use-fetch) 拥有相同的签名。
::

::warning
await `useLazyFetch` 会初始化调用但不会等待数据。在客户端导航时，使用结果前请在组件模板中检查 `status === 'pending'` 和 `status === 'error'`。
::

::warning
`useLazyFetch` 是编译器转换的保留函数名，因此你不应该把自己的函数命名为 `useLazyFetch`。
::

## 类型

```ts [Signature]
export function useLazyFetch<ResT, ErrorT = NuxtError<unknown>, DataT = ResT> (
  url: string | Request | Ref<string | Request> | (() => string | Request),
  options?: UseFetchOptions<ResT, DataT>,
): AsyncData<DataT, ErrorT> & Promise<AsyncData<DataT, ErrorT>>
```

::note
`useLazyFetch` 等同于设置了 `lazy: true` 选项的 `useFetch`。完整类型定义见 [`useFetch`](/docs/api/composables/use-fetch)。
::

## 参数

`useLazyFetch` 接受与 [`useFetch`](/docs/api/composables/use-fetch) 相同的参数：

- `URL`（`string | Request | Ref<string | Request> | () => string | Request`）：要获取的 URL 或请求。
- `options`（对象）：与 [`useFetch 选项`](/docs/api/composables/use-fetch#参数) 相同，其中 `lazy` 自动设为 `true`。

:read-more{to="/docs/api/composables/use-fetch#参数"}

## 返回值

返回与 [`useFetch`](/docs/api/composables/use-fetch) 相同的 `AsyncData` 对象：

| 名称 | 类型 | 描述 |
|-----------|-----------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `data` | `Ref<DataT \| undefined>` | 异步 fetch 的结果。 |
| `refresh` | `(opts?: AsyncDataExecuteOptions) => Promise<void>` | 手动刷新数据的函数。 |
| `execute` | `(opts?: AsyncDataExecuteOptions) => Promise<void>` | `refresh` 的别名。 |
| `error` | `Ref<ErrorT \| undefined>` | 如果数据获取失败的错误对象。 |
| `status` | `Ref<'idle' \| 'pending' \| 'success' \| 'error'>` | 数据请求的状态。用它来区分 `idle`、`pending`、`success` 和 `error`。 |
| `pending` | `Ref<boolean>` | 请求进行中为 `true`。参见 [`useFetch`](/docs/api/composables/use-fetch#返回值)。 |
| `clear` | `() => void` | 将 `data` 重置为 `undefined`，`error` 重置为 `undefined`，将 `status` 设为 `idle`，并取消任何挂起的请求。 |

:read-more{to="/docs/api/composables/use-fetch#返回值}

## 示例

### 处理加载状态

```vue [app/pages/index.vue]
<script setup lang="ts">
/* useLazyFetch 让导航在 fetch 完成之前就能继续。
 * 在模板中处理加载和错误状态。
 */
const { status, data: posts } = await useLazyFetch('/api/posts')
watch(posts, (newPosts) => {
  // 因为 posts 初始可能为 null，你无法立即访问其内容，
  // 但你可以 watch 它。
})
</script>

<template>
  <div v-if="status === 'pending'">
    Loading ...
  </div>
  <div v-else-if="status === 'error'">
    Error loading posts
  </div>
  <div v-else>
    <div v-for="post in posts">
      <!-- do something -->
    </div>
  </div>
</template>
```

:read-more{to="/docs/getting-started/data-fetching"}

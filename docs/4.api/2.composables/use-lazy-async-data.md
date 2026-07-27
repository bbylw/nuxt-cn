---
title: useLazyAsyncData
description: 该组合式函数包装 useAsyncData，会在 handler 解析之前立即触发导航。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/asyncData.ts
    size: xs
---

`useLazyAsyncData` 提供了对 [`useAsyncData`](/docs/api/composables/use-async-data) 的封装，通过将 `lazy` 选项设为 `true`，在 handler 解析之前就触发导航。

:note
默认情况下，[`useAsyncData`](/docs/api/composables/use-async-data) 会阻塞导航直到其异步 handler 解析完成。`useLazyAsyncData` 允许在后台继续获取数据时立即发生导航。
:

## 用法

```vue [app/pages/index.vue]
<script setup lang="ts">
const { status, data: posts } = await useLazyAsyncData('posts', () => $fetch('/api/posts'))
</script>

<template>
  <div>
    <div v-if="status === 'pending'">
      Loading...
    </div>
    <div v-else-if="status === 'error'">
      Error loading posts
    </div>
    <div v-else>
      {{ posts }}
    </div>
  </div>
</template>
```

`useLazyAsyncData` 在获取数据时让导航继续进行。在使用结果之前，请先在组件模板中检查 `status === 'pending'` 和 `status === 'error'`。

:warning
`useLazyAsyncData` 是编译器转换的保留函数名，因此你不应该把自己的函数命名为 `useLazyAsyncData`。
:

## 类型

```ts [Signature]
export function useLazyAsyncData<ResT, DataE = unknown, DataT = ResT> (
  handler: AsyncDataHandler<ResT>,
  options?: AsyncDataOptions<ResT, DataT>,
): AsyncData<DataT, DataE> & Promise<AsyncData<DataT, DataE>>

export function useLazyAsyncData<ResT, DataE = unknown, DataT = ResT> (
  key: MaybeRefOrGetter<string>,
  handler: AsyncDataHandler<ResT>,
  options?: AsyncDataOptions<ResT, DataT>,
): AsyncData<DataT, DataE> & Promise<AsyncData<DataT, DataE>>
```

`useLazyAsyncData` 拥有与 [`useAsyncData`](/docs/api/composables/use-async-data) 相同的签名。

## 参数

`useLazyAsyncData` 接受与 [`useAsyncData`](/docs/api/composables/use-async-data) 相同的参数，唯一的区别是 `lazy` 选项会被自动设为 `true`。

:read-more{to="/docs/api/composables/use-async-data#参数"}

## 返回值

`useLazyAsyncData` 返回与 [`useAsyncData`](/docs/api/composables/use-async-data) 相同的值。

:read-more{to="/docs/api/composables/use-async-data#返回值"}

## 示例

```vue [app/pages/index.vue]
<script setup lang="ts">
/* useLazyAsyncData 让导航在 fetch 完成之前就能继续。
  在模板中处理加载和错误状态。
*/
const { status, data: count } = await useLazyAsyncData('count', () => $fetch('/api/count'))

watch(count, (newCount) => {
  // 因为 count 初始可能为 null，你无法立即访问其内容，
  // 但你可以 watch 它。
})
</script>

<template>
  <div v-if="status === 'pending'">
    Loading
  </div>
  <div v-else-if="status === 'error'">
    Error loading count
  </div>
  <div v-else>
    {{ count }}
  </div>
</template>
```

:read-more{to="/docs/getting-started/data-fetching"}

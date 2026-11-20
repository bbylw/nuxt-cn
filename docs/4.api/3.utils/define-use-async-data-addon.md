---
title: 'defineUseAsyncDataAddon'
description: 定义一个可复用的 addon，用于扩展由 createUseAsyncData 创建的组合式函数。
minimalVersion: "4.6"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/addons.ts
    size: xs
---

`defineUseAsyncDataAddon` 为使用 [`createUseAsyncData`](/docs/api/composables/create-use-async-data) 创建的 `useAsyncData` 组合式函数定义一个可复用的扩展。

一个 addon 可以声明调用处的自定义选项、用中间件包裹 handler、附加自定义的响应式逻辑，或扩展返回的对象。

:read-more{to="/docs/api/utils/define-use-fetch-addon" title="defineUseFetchAddon：useAsyncData 的 addon 与 useFetch 的 addon 工作方式相同"}

## 用法

例如下面这个 addon 添加了 `pollEvery` 选项，按固定间隔刷新数据：

```ts [app/composables/usePolledAsyncData.ts]
const polling = defineUseAsyncDataAddon({
  setup: (options: UseAsyncDataAddonOptions<{ pollEvery?: number }>) => {
    if (import.meta.server || !options.pollEvery) { return }
    return (asyncData) => {
      const interval = setInterval(() => asyncData.refresh(), options.pollEvery)
      onScopeDispose(() => clearInterval(interval))
    }
  },
})

export const usePolledAsyncData = createUseAsyncData({ addons: [polling] })
```

```vue [app/pages/index.vue]
<script setup lang="ts">
// 每 30 秒刷新一次数据
const { data } = await usePolledAsyncData(
  'mountains',
  () => $fetch('https://api.nuxtjs.dev/mountains'),
  { pollEvery: 30_000 },
)
</script>
```

::note
Addon 按 `addons` 数组的顺序运行，第一个 addon 的中间件是最外层的包裹。同一个 addon 对象重复列出也只会运行一次。
::

## 类型

```ts [Signature]
function defineUseAsyncDataAddon<Opts extends Record<string, any> = {}, Ext = {}> (addon: {
  setup: (options: UseAsyncDataAddonOptions<Opts>) => ((asyncData: AsyncDataAddonInstance) => Ext | void) | void
}): UseAsyncDataAddon<Opts, Ext>
```

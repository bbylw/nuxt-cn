---
title: 'clearNuxtData'
description: 删除 useAsyncData 和 useFetch 的缓存数据、错误状态和挂起的 promise。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/asyncData.ts
    size: xs
---

:note
如果你想让另一个页面的数据获取失效，这个方法很有用。
:

## 类型

```ts [Signature]
export function clearNuxtData (keys?: string | string[] | ((key: string) => boolean)): void
```

## 参数

* `keys`：在 [`useAsyncData`](/docs/api/composables/use-async-data) 中用于删除其缓存数据的一个或多个 key。如果不提供 key，则**所有数据**都将被置为失效。

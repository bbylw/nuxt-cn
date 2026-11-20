---
title: 'useHydration'
description: '允许完全控制 hydration 周期，以便从服务端设置和接收数据。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/hydrate.ts
    size: xs
---

`useHydration` 是一个内置的组合式函数，提供一种方式：在每次发起新的 HTTP 请求时于服务端设置数据，并在客户端接收这些数据。通过这种方式，`useHydration` 让你完全控制 hydration 周期。

::note
这是一个高级组合式函数，主要设计用于插件中，多数由 Nuxt 模块使用。
::

::note
`useHydration` 旨在**确保 SSR 期间的状态同步与恢复**。如果你需要创建在 Nuxt 中 SSR 友好的全局响应状态，[`useState`](/docs/api/composables/use-state) 是推荐的选择。
::

## 用法

服务端 `get` 函数返回的数据会被存储在 `nuxtApp.payload` 中，key 为传给 `useHydration` 的第一个参数提供的唯一 key。在 hydration 期间，这些数据随后会在客户端被取回，从而避免冗余的计算或 API 调用。

::code-group

```ts [With useHydration]
export default defineNuxtPlugin((nuxtApp) => {
  const myStore = new MyStore()

  useHydration(
    'myStoreState',
    () => myStore.getState(),
    data => myStore.setState(data),
  )
})
```

```ts [Without useHydration]
export default defineNuxtPlugin((nuxtApp) => {
  const myStore = new MyStore()

  if (import.meta.server) {
    nuxt.hooks.hook('app:rendered', () => {
      nuxtApp.payload.myStoreState = myStore.getState()
    })
  }

  if (import.meta.client) {
    nuxt.hooks.hook('app:created', () => {
      myStore.setState(nuxtApp.payload.myStoreState)
    })
  }
})
```
::

## 类型

```ts [Signature]
export function useHydration<T> (key: string, get: () => T, set: (value: T) => void): void
```

## 参数

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| `key` | `string` | 在你的 Nuxt 应用中标识该数据的唯一 key。 |
| `get` | `() => T` | **仅在服务端**执行的函数（SSR 渲染完成时调用）以设置初始值。 |
| `set` | `(value: T) => void` | **仅在客户端**执行的函数（在应用创建时调用，如果在 hydration 期间较晚注册，则立即调用）以接收数据。 |

## 返回值

该组合式函数不返回任何值。

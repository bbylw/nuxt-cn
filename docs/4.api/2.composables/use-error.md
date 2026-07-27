---
title: "useError"
description: useError 组合式函数返回正在被处理的全局 Nuxt 错误。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/error.ts
    size: xs
---

## 用法

`useError` 组合式函数返回正在被处理的全局 Nuxt 错误，在客户端和服务端都可用。它在你的整个应用中提供了一个可响应的、SSR 友好的错误状态。

```ts
const error = useError()
```

你可以在组件、页面或插件中使用该组合式函数来访问或响应当前的 Nuxt 错误。

## 类型

```ts
interface NuxtError<DataT = unknown> {
  status: number
  statusText?: string
  message: string
  data?: DataT
  cause?: unknown
  fatal: boolean
}

export const useError: () => Ref<NuxtError | undefined>
```

## 参数

该组合式函数不接受任何参数。

## 返回值

返回一个包含当前 Nuxt 错误（如果没有错误则为 `undefined`）的 `Ref`。该错误对象是可响应的，会在错误状态变化时自动更新。

## 示例

```vue
<script setup lang="ts">
const error = useError()

if (error.value) {
  console.error('Nuxt error:', error.value)
}
</script>
```

:read-more{to="/docs/getting-started/error-handling"}

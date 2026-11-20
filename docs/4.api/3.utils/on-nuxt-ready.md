---
title: "onNuxtReady"
description: onNuxtReady 组合式函数允许在你的应用完成初始化之后运行一个回调。
minimalVersion: "3.1"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ready.ts
    size: xs
---

::important
`onNuxtReady` 只在客户端运行。:br
它非常适合用来运行那些不应阻塞应用初始渲染的代码。
::

```ts [app/plugins/ready.client.ts]
export default defineNuxtPlugin(() => {
  onNuxtReady(async () => {
    const myAnalyticsLibrary = await import('my-big-analytics-library')
    // 使用 myAnalyticsLibrary 做一些处理
  })
})
```

即使你的应用已经初始化完成，它也是「安全」的。在这种情况下，代码会被注册到下一个空闲回调中运行。

## 类型

```ts [Signature]
export function onNuxtReady (callback: () => any, options?: OnNuxtReadyOptions): void

interface OnNuxtReadyOptions {
  timeout?: number
  signal?: AbortSignal
}
```

### `callback`

**类型**：`() => any`

在你的应用完成初始化且浏览器空闲后要运行的函数。

### `options`（可选）

**类型**：`OnNuxtReadyOptions`

- `timeout`（可选）

  **类型**：`number`

  应用就绪后，等待浏览器进入空闲状态的最大毫秒数。它会被传给 [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback#timeout)。如果不设置它，当浏览器没有安排空闲时段时（在无头浏览器中可能发生），回调可能会被延迟数秒。

```ts [app/plugins/ready.client.ts]
export default defineNuxtPlugin(() => {
  onNuxtReady(() => {
    // 在浏览器空闲时运行，或在你的应用就绪约 2 秒后运行，以先到者为准
  }, { timeout: 2000 })
})
```

- `signal`（可选）

  **类型**：`AbortSignal`

  如果 signal 在回调运行之前被中止，则跳过该回调。当在某个组件中调用 `onNuxtReady`、而该组件可能在你应用就绪之前卸载时，这很有用。

```vue [app/components/MyComponent.vue]
<script setup lang="ts">
const controller = new AbortController()

onMounted(() => {
  onNuxtReady(() => {
    // 如果组件先卸载，则不会运行
  }, { signal: controller.signal })
})

onBeforeUnmount(() => controller.abort())
</script>
```

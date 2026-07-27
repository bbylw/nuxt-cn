---
title: 'useLoadingIndicator'
description: 该组合式函数让你访问应用页面的加载状态。
minimalVersion: "3.9"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/loading-indicator.ts
    size: xs
---

## 描述

一个返回页面加载状态的组合式函数。被 [`<NuxtLoadingIndicator>`](/docs/api/components/nuxt-loading-indicator) 使用且可受控。
它钩入 [`page:loading:start`](/docs/api/advanced/hooks#app-hooks-runtime) 和 [`page:loading:end`](/docs/api/advanced/hooks#app-hooks-runtime) 来改变其状态。

## 参数

- `duration`：加载条的持续时间，单位毫秒（默认 `2000`）。
- `throttle`：出现和隐藏的节流时间，单位毫秒（默认 `200`）。
- `estimatedProgress`：默认情况下 Nuxt 会在接近 100% 时放缓。你可以提供一个自定义函数来调整进度估算，该函数接收加载条持续时间（如上）和已用时间，应返回 0 到 100 之间的值。

## 属性

### `isLoading`

- **类型**：`Readonly<ShallowRef<boolean>>`
- **描述**：加载状态

### `error`

- **类型**：`Readonly<ShallowRef<boolean>>`
- **描述**：错误状态

### `progress`

- **类型**：`Readonly<ShallowRef<number>>`
- **描述**：进度状态。从 `0` 到 `100`。

## 方法

### `start()`

将 `isLoading` 设为 true 并开始增加 `progress` 值。`start` 接受 `{ force: true }` 选项，以跳过间隔并立即显示加载状态。

### `set()`

将 `progress` 值设为特定值。`set` 接受 `{ force: true }` 选项，以跳过间隔并立即显示加载状态。

### `finish()`

将 `progress` 值设为 `100`，停止所有计时器和间隔，然后在 `500` 毫秒后重置加载状态。`finish` 接受 `{ force: true }` 选项以在状态重置前跳过间隔，以及 `{ error: true }` 以改变加载条颜色并将 error 属性设为 true。

### `clear()`

由 `finish()` 使用。清除该组合式函数使用的所有计时器和间隔。

## 示例

```vue
<script setup lang="ts">
const { progress, isLoading, start, finish, clear } = useLoadingIndicator({
  duration: 2000,
  throttle: 200,
  // 这是默认情况下进度的计算方式
  estimatedProgress: (duration, elapsed) => (2 / Math.PI * 100) * Math.atan(elapsed / duration * 100 / 50),
})
</script>
```

```vue
<script setup lang="ts">
const { start, set } = useLoadingIndicator()
// 等同于 set(0, { force: true })
// 将进度设为 0，并立即显示加载
start({ force: true })
</script>
```

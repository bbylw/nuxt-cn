---
title: 'useRouteAnnouncer'
description: 该组合式函数监视页面标题变化，并相应地更新播报消息。
minimalVersion: "3.12"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/route-announcer.ts
    size: xs
---

::important
该组合式函数在 Nuxt v3.12+ 中可用。
::

## 描述

一个监视页面标题变化并相应地更新播报消息的组合式函数。被 [`<NuxtRouteAnnouncer>`](/docs/api/components/nuxt-route-announcer) 使用且可受控。
它钩入 Unhead 的 `dom:rendered` 钩子来读取页面标题并将其设为播报消息。

## 参数

- `politeness`：设置屏幕阅读器播报的紧急程度：`off`（禁用播报）、`polite`（等待静默后播报）、或 `assertive`（立即打断播报）。（默认 `polite`）

## 属性

### `message`

- **类型**：`Ref<string>`
- **描述**：要播报的消息

### `politeness`

- **类型**：`Ref<string>`
- **描述**：屏幕阅读器播报紧急程度 `off`、`polite` 或 `assertive`

## 方法

### `set(message, politeness = "polite")`

设置要播报的消息及其紧急程度。

### `polite(message)`

以 `politeness = "polite"` 设置消息。

### `assertive(message)`

以 `politeness = "assertive"` 设置消息。

## 示例

```vue [app/pages/index.vue]
<script setup lang="ts">
const { message, politeness, set, polite, assertive } = useRouteAnnouncer({
  politeness: 'assertive',
})
</script>
```

::callout
对于页内动态内容变化（表单校验、toast、加载状态）的播报，请改用 [`useAnnouncer`](/docs/api/composables/use-announcer)。
::

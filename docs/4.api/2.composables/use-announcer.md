---
title: 'useAnnouncer'
description: 一个用于向屏幕阅读器播报消息的组合式函数。
minimalVersion: "4.4"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/announcer.ts
    size: xs
---

::important
该组合式函数在 Nuxt v4.4.2+ 中可用。
::

## 描述

一个用于向屏幕阅读器播报动态内容变化的组合式函数。不同于会自动播报路由变化的 [`useRouteAnnouncer`](/docs/api/composables/use-route-announcer)，`useAnnouncer` 让你可以手动控制播报什么以及何时播报。

将其用于表单校验、异步操作、toast 通知和实时内容变化等页内更新。

## 参数

- `politeness`：设置屏幕阅读器播报的默认紧急程度：`off`（禁用播报）、`polite`（等待静默）、或 `assertive`（立即打断）。（默认 `polite`）

## 属性

### `message`

- **类型**：`Ref<string>`
- **描述**：要播报的当前消息

### `politeness`

- **类型**：`Ref<'polite' | 'assertive' | 'off'>`
- **描述**：屏幕阅读器播报的紧急程度

## 方法

### `set(message, politeness = "polite")`

设置要播报的消息及其紧急程度。

### `polite(message)`

以 `politeness = "polite"` 设置消息。用于可以等待屏幕阅读器完成当前任务的非紧急更新。

### `assertive(message)`

以 `politeness = "assertive"` 设置消息。用于应该立即打断屏幕阅读器的紧急更新。

## 示例

```vue [app/pages/contact.vue]
<script setup lang="ts">
const { polite, assertive } = useAnnouncer()

async function submitForm () {
  try {
    await $fetch('/api/contact', { method: 'POST', body: formData })
    polite('消息发送成功')
  } catch (error) {
    assertive('错误：发送消息失败')
  }
}
</script>
```

## 使用场景

### 表单校验

```vue [app/components/LoginForm.vue]
<script setup lang="ts">
const { assertive } = useAnnouncer()

function validateForm () {
  const errors = []
  if (!email.value) { errors.push('邮箱为必填项') }
  if (!password.value) { errors.push('密码为必填项') }

  if (errors.length) {
    assertive(`表单有 ${errors.length} 个错误：${errors.join(', ')}`)
    return false
  }
  return true
}
</script>
```

### 加载状态

```vue [app/pages/dashboard.vue]
<script setup lang="ts">
const { polite } = useAnnouncer()

const { data, status } = await useFetch('/api/data')

watch(status, (newStatus) => {
  if (newStatus === 'pending') {
    polite('正在加载数据...')
  } else if (newStatus === 'success') {
    polite('数据加载成功')
  }
})
</script>
```

### 搜索结果

```vue [app/components/Search.vue]
<script setup lang="ts">
const { polite } = useAnnouncer()

const results = ref([])

watch(results, (newResults) => {
  polite(`找到 ${newResults.length} 条结果`)
})
</script>
```

::callout
你需要将 [`<NuxtAnnouncer>`](/docs/api/components/nuxt-announcer) 组件添加到你的应用中，播报内容才会被渲染到 DOM 中。
::

::callout
对于路由/页面变化的自动播报，请改用 [`useRouteAnnouncer`](/docs/api/composables/use-route-announcer) 配合 [`<NuxtRouteAnnouncer>`](/docs/api/components/nuxt-route-announcer) 组件。
::

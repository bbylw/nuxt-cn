---
title: "useLayout"
description: useLayout 返回为当前路由解析出的布局。
minimalVersion: "4.5"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/layout.ts
    size: xs
---

## 描述

`useLayout` 返回一个计算引用，表示当前路由解析出的布局，使用的解析链与 [`<NuxtLayout>`](/docs/api/components/nuxt-layout) 相同：先是页面的 `layout` meta，然后是通过[路由规则](/docs/guide/concepts/rendering#hybrid-rendering)设置的 `appLayout`，最后是 `'default'`。

在已渲染的 `<NuxtLayout>` 内部，它反映外层布局；在布局之外（例如在 `app.vue` 中），它返回当前路由将要解析出的布局。

与直接读取 `route.meta.layout` 不同，它会考虑通过路由规则设置的布局，并随路由变化保持同步。

## 返回值

一个只读的计算引用，解析为布局名称（一个 `string`），当布局被禁用时解析为 `false`。

## 示例

```vue [app.vue]
<script setup lang="ts">
const layout = useLayout()
</script>

<template>
  <div>
    <CommandPalette v-if="layout !== 'minimal'" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
```

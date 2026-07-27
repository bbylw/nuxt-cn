---
title: 'setPageLayout'
description: setPageLayout 允许你动态更改页面的布局。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

:important
`setPageLayout` 允许你动态更改页面的布局。它依赖于对 Nuxt 上下文的访问，因此只能在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中调用。
:

```ts [app/middleware/custom-layout.ts]
export default defineNuxtRouteMiddleware((to) => {
  // 为你正在导航_到_的路由设置布局
  setPageLayout('other')
})
```

## 向布局传递 Props :badge[v4.3]{color="info" size="xs" class="align-middle"}

你可以通过传入一个对象作为第二个参数来向布局传递 props：

```ts [app/middleware/admin-layout.ts]
export default defineNuxtRouteMiddleware((to) => {
  setPageLayout('admin', {
    sidebar: true,
    title: 'Dashboard',
  })
})
```

布局随后就可以接收这些 props：

```vue [app/layouts/admin.vue]
<script setup lang="ts">
const props = defineProps<{
  sidebar?: boolean
  title?: string
}>()
</script>

<template>
  <div>
    <aside v-if="sidebar">
      Sidebar
    </aside>
    <main>
      <h1>{{ title }}</h1>
      <slot />
    </main>
  </div>
</template>
```

:note
如果你选择在服务端动态设置布局，你**必须**在布局被 Vue 渲染之前（即在插件或路由中间件中）完成，以避免 hydration 不匹配。
:

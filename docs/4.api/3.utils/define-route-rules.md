---
title: 'defineRouteRules'
description: '在页面层面定义用于混合渲染的路由规则。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/pages/runtime/composables.ts
    size: xs
---

:read-more{to="/docs/guide/going-further/experimental-features#inlinerouterules" icon="i-lucide-star"}
该特性是实验性的，要使用它你必须在你的 `nuxt.config` 中启用 `experimental.inlineRouteRules` 选项。
:

## 用法

```vue [app/pages/index.vue]
<script setup lang="ts">
defineRouteRules({
  prerender: true,
})
</script>

<template>
  <h1>Hello world!</h1>
</template>
```

会被转换为：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
  },
})
```

:note
当运行 [`nuxt build`](/docs/api/commands/build) 时，首页会被预渲染到 `.output/public/index.html` 中并作为静态资源提供。
:

## 注意事项

- 在 `~/pages/foo/bar.vue` 中定义的规则会应用到 `/foo/bar` 的请求。
- 在 `~/pages/foo/[id].vue` 中定义的规则会应用到 `/foo/*` 的请求。
- 在带有有限可选集的页面（例如自定义 `path` 为 `/:locale(en|fr)/about`）中定义的规则，会为每个可选值各生成一条规则（`/en/about` 和 `/fr/about`）。

如果某个页面路径无法转换为等价的路由规则模式（例如带有正则表达式的参数如 `/:id(\d+)`、部分片段如 `/prefix-:id`，或重复参数如 `/:slug+`），该页面的规则将**不会**被应用，且 Nuxt 会在构建期间发出警告。在这种情况下，请直接在 `nuxt.config` 的 `nitro.routeRules` 中显式定义规则。

如果需要更精细的控制，例如你正在使用页面 [`definePageMeta`](/docs/api/utils/define-page-meta) 中设置的自定义 `path` 或 `alias`，你应该在 `nuxt.config` 中直接设置 `routeRules`。

:read-more{to="/docs/guide/concepts/rendering#hybrid-rendering" icon="i-lucide-medal"}
阅读更多关于 `routeRules` 的内容。
:

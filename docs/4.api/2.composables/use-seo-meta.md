---
title: 'useSeoMeta'
description: useSeoMeta 组合式函数让你可以将站点的 SEO meta 标签定义为一个扁平对象，并提供完整的 TypeScript 支持。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/unjs/unhead/blob/main/packages/vue/src/composables.ts
    size: xs
---

这有助于你避免常见的错误，例如使用 `name` 而不是 `property`，以及拼写错误——有 100 多个 meta 标签都已完整类型化。

::important
这是向你站点添加 meta 标签的推荐方式，因为它是 XSS 安全的，并且拥有完整的 TypeScript 支持。
::

:read-more{to="/docs/getting-started/seo-meta"}

## 用法

```vue [app/app.vue]
<script setup lang="ts">
useSeoMeta({
  title: '我的超酷站点',
  ogTitle: '我的超酷站点',
  description: '这是我的超酷站点，让我来告诉你关于它的一切。',
  ogDescription: '这是我的超酷站点，让我来告诉你关于它的一切。',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>
```

当插入需要响应的标签时，你应该使用计算 getter 语法（`() => value`）：

```vue [app/app.vue]
<script setup lang="ts">
const title = ref('我的标题')

useSeoMeta({
  title,
  description: () => `这是 ${title.value} 页面的描述`,
})
</script>
```

## 参数

有 100 多个参数。请参阅[源代码中的完整参数列表](https://github.com/harlan-zw/zhead/blob/main/packages/zhead/src/metaFlat.ts#L1035)。

:read-more{to="/docs/getting-started/seo-meta"}

## 性能

在大多数情况下，SEO meta 标签不需要是响应式的，因为搜索引擎机器人主要扫描初始页面加载。

为了获得更好的性能，当 meta 标签不需要响应时，你可以将 `useSeoMeta` 调用包裹在服务端专属条件下：

```vue [app/app.vue]
<script setup lang="ts">
if (import.meta.server) {
  // 这些 meta 标签将只在服务端渲染期间被添加
  useSeoMeta({
    robots: 'index, follow',
    description: '不需要响应式的静态描述',
    ogImage: 'https://example.com/image.png',
    // 其他静态 meta 标签...
  })
}

const dynamicTitle = ref('我的标题')
// 仅在必要的时候在条件之外使用响应式 meta 标签
useSeoMeta({
  title: () => dynamicTitle.value,
  ogTitle: () => dynamicTitle.value,
})
</script>
```

这以前使用的是 [`useServerSeoMeta`](/docs/api/composables/use-server-seo-meta) 组合式函数，但现已弃用，推荐使用这种方式。

---
title: 'useServerSeoMeta'
description: useServerSeoMeta 组合式函数让你可以将站点的 SEO meta 标签定义为一个扁平对象，并提供完整的 TypeScript 支持。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/unjs/unhead/blob/main/packages/vue/src/composables.ts
    size: xs
---

:warning
`useServerSeoMeta` 已弃用。请改用将 [`useSeoMeta`](/docs/api/composables/use-seo-meta) 包裹在 `if (import.meta.server)` 代码块中的方式。在 `future.compatibilityVersion: 5` 下自动导入已被移除。
:

`useServerSeoMeta` 让你将站点的 SEO meta 标签定义为一个扁平对象并提供完整的 TypeScript 支持，与 [`useSeoMeta`](/docs/api/composables/use-seo-meta) 完全一致，但它只运行在服务端，且会被从客户端打包中 tree-shake 掉。

:read-more{to="/docs/api/composables/use-seo-meta"}

对于新代码，请直接使用服务端专属模式：

```vue [app/app.vue]
<script setup lang="ts">
if (import.meta.server) {
  useSeoMeta({
    robots: 'index, follow',
  })
}
</script>
```

参数与 [`useSeoMeta`](/docs/api/composables/use-seo-meta) 完全相同。

:read-more{to="/docs/getting-started/seo-meta"}

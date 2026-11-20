---
title: useHead
description: useHead 用于自定义 Nuxt 应用各个页面的 head 属性。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/unjs/unhead/blob/main/packages/vue/src/composables.ts
    size: xs
---

## 用法

`useHead` 组合式函数允许你以编程和可响应的方式管理 head 标签，其底层由 [Unhead](https://unhead.unjs.io) 驱动。它让你自定义 HTML 文档 `<head>` 部分中的 meta 标签、链接、脚本和其他元素。

```vue [app/app.vue]
<script setup lang="ts">
useHead({
  title: 'My App',
  meta: [
    { name: 'description', content: 'My amazing site.' },
  ],
  bodyAttrs: {
    class: 'test',
  },
  script: [{ innerHTML: 'console.log(\'Hello world\')' }],
})
</script>
```

::warning
如果数据来自用户或其他不可信来源，我们建议你查看 [`useHeadSafe`](/docs/api/composables/use-head-safe)。
::

::note
`useHead` 的属性可以是动态的，接受 `ref`、`computed` 和 `reactive` 属性。`meta` 参数也可以接受一个返回对象的函数，使整个对象可响应。
::

## 类型

```ts [Signature]
export function useHead (meta: MaybeComputedRef<MetaObject>): ActiveHeadEntry<UseHeadInput>

interface MetaObject {
  title?: string
  titleTemplate?: string | ((title?: string) => string)
  base?: Base
  link?: Link[]
  meta?: Meta[]
  style?: Style[]
  script?: Script[]
  noscript?: Noscript[]
  htmlAttrs?: HtmlAttributes
  bodyAttrs?: BodyAttributes
}

interface ActiveHeadEntry<Input> {
  /**
   * 使用新输入更新该条目。
   *
   * 会先清除之前输入的任何副作用。
   */
  patch: (input: Input) => void
  /**
   * 处置该条目，将其从活跃的 head 中移除。
   *
   * 会排队移除副作用。
   */
  dispose: () => void
}
```

详见 [@unhead/schema](https://github.com/unjs/unhead/blob/main/packages/vue/src/types/schema.ts) 以获取更详细的类型。

## 参数

`meta`：一个接受 head 元数据属性以自定义页面 `<head>` 部分的对象。所有属性都支持响应式值（`ref`、`computed`、`reactive`），也可以是返回元数据对象的函数。

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `title` | `string` | 设置页面标题。 |
| `titleTemplate` | `string \| ((title?: string) => string)` | 配置动态模板来自定义页面标题。可以是带有 `%s` 占位符的字符串或函数。 |
| `base` | `Base` | 设置文档的 `<base>` 标签。 |
| `link` | `Link[]` | 链接对象数组。每个元素映射到 `<link>` 标签，其中对象属性对应 HTML 属性。 |
| `meta` | `Meta[]` | meta 对象数组。每个元素映射到 `<meta>` 标签，其中对象属性对应 HTML 属性。 |
| `style` | `Style[]` | 样式对象数组。每个元素映射到 `<style>` 标签，其中对象属性对应 HTML 属性。 |
| `script` | `Script[]` | 脚本对象数组。每个元素映射到 `<script>` 标签，其中对象属性对应 HTML 属性。 |
| `noscript` | `Noscript[]` | noscript 对象数组。每个元素映射到 `<noscript>` 标签，其中对象属性对应 HTML 属性。 |
| `htmlAttrs` | `HtmlAttributes` | 设置 `<html>` 标签的属性。每个对象属性映射到对应的属性。 |
| `bodyAttrs` | `BodyAttributes` | 设置 `<body>` 标签的属性。每个对象属性映射到对应的属性。 |

## 返回值

该组合式函数不返回任何值。它向 Unhead 注册 head 元数据，由 Unhead 管理实际的 DOM 更新。

## 示例

### 基础 Meta 标签

```vue [app/pages/about.vue]
<script setup lang="ts">
useHead({
  title: 'About Us',
  meta: [
    { name: 'description', content: 'Learn more about our company' },
    { property: 'og:title', content: 'About Us' },
    { property: 'og:description', content: 'Learn more about our company' },
  ],
})
</script>
```

### 响应式 Meta 标签

```vue [app/pages/profile.vue]
<script setup lang="ts">
const profile = ref({ name: 'John Doe' })

useHead({
  title: computed(() => profile.value.name),
  meta: [
    {
      name: 'description',
      content: computed(() => `Profile page for ${profile.value.name}`),
    },
  ],
})
</script>
```

### 使用函数实现完整响应式

```vue [app/pages/dynamic.vue]
<script setup lang="ts">
const count = ref(0)

useHead(() => ({
  title: `Count: ${count.value}`,
  meta: [
    { name: 'description', content: `Current count is ${count.value}` },
  ],
}))
</script>
```

### 添加外部脚本和样式

```vue [app/pages/external.vue]
<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.example.com/styles.css',
    },
  ],
  script: [
    {
      src: 'https://cdn.example.com/script.js',
      async: true,
    },
  ],
})
</script>
```

### Body 和 HTML 属性

```vue [app/pages/themed.vue]
<script setup lang="ts">
const isDark = ref(true)

useHead({
  htmlAttrs: {
    lang: 'en',
    class: computed(() => isDark.value ? 'dark' : 'light'),
  },
  bodyAttrs: {
    class: 'themed-page',
  },
})
</script>
```

:read-more{to="/docs/getting-started/seo-meta"}

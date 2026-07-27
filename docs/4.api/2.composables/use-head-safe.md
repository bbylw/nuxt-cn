---
title: useHeadSafe
description: 处理用户输入时提供 head 数据的推荐方式。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/unjs/unhead/blob/main/packages/vue/src/composables.ts
    size: xs
---

## 用法

`useHeadSafe` 组合式函数是 [`useHead`](/docs/api/composables/use-head) 组合式函数的封装，它限制输入只允许安全的值。这是在处理用户输入时管理 head 数据的推荐方式，因为它通过清理潜在危险的属性来防止 XSS 攻击。

:warning
使用 `useHeadSafe` 时，像脚本中的 `innerHTML` 或 meta 标签中的 `http-equiv` 等潜在危险的属性会被自动剥离以防止 XSS 攻击。每当你处理用户生成的内容时，请使用此组合式函数。
:

## 类型

```ts [Signature]
export function useHeadSafe (input: MaybeComputedRef<HeadSafe>): void
```

### 允许的属性

以下属性被每个 head 元素类型列入白名单：

```ts
const WhitelistAttributes = {
  htmlAttrs: ['class', 'style', 'lang', 'dir'],
  bodyAttrs: ['class', 'style'],
  meta: ['name', 'property', 'charset', 'content', 'media'],
  noscript: ['textContent'],
  style: ['media', 'textContent', 'nonce', 'title', 'blocking'],
  script: ['type', 'textContent', 'nonce', 'blocking'],
  link: ['color', 'crossorigin', 'fetchpriority', 'href', 'hreflang', 'imagesrcset', 'imagesizes', 'integrity', 'media', 'referrerpolicy', 'rel', 'sizes', 'type'],
}
```

详见 [@unhead/vue](https://github.com/unjs/unhead/blob/main/packages/vue/src/types/safeSchema.ts) 以获取更详细的类型。

## 参数

`input`：一个包含 head 数据的 `MaybeComputedRef<HeadSafe>` 对象。你可以传入与 [`useHead`](/docs/api/composables/use-head) 相同的所有值，但只会渲染安全的属性。

## 返回值

该组合式函数不返回任何值。

## 示例

```vue [app/pages/user-profile.vue]
<script setup lang="ts">
// 可能包含恶意代码的用户生成内容
const userBio = ref('<script>alert("xss")<' + '/script>')

useHeadSafe({
  title: `User Profile`,
  meta: [
    {
      name: 'description',
      content: userBio.value, // 安全地被清理
    },
  ],
})
</script>
```

:read-more{to="https://unhead.unjs.io/docs/typescript/head/api/composables/use-head-safe" target="_blank"}
在 `Unhead` 文档中阅读更多内容。
:

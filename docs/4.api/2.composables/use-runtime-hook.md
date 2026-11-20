---
title: useRuntimeHook
description: 在 Nuxt 应用中注册一个运行时钩子，并确保在作用域销毁时被正确清理。
minimalVersion: "3.14"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/runtime-hook.ts
    size: xs
---

::important
该组合式函数在 Nuxt v3.14+ 中可用。
::

```ts [Signature]
function useRuntimeHook<THookName extends keyof RuntimeNuxtHooks> (
  name: THookName,
  fn: RuntimeNuxtHooks[THookName] extends HookCallback ? RuntimeNuxtHooks[THookName] : never,
): void
```

## 用法

### 参数

- `name`：要注册的运行时钩子名称。你可以在[这里查看完整的运行时 Nuxt 钩子列表](/docs/api/advanced/hooks#app-hooks-runtime)。
- `fn`：当钩子被触发时要执行的回调函数。函数的签名会根据钩子名称而不同。

### 返回值

该组合式函数不返回值，但它在组件的作用域销毁时会自动注销该钩子。

## 示例

```vue twoslash [pages/index.vue]
<script setup lang="ts">
// 注册一个每次预取链接时都会运行的钩子，但它在组件卸载时会
// 被自动清理（不再被调用）
useRuntimeHook('link:prefetch', (link) => {
  console.log('正在预取', link)
})
</script>
```

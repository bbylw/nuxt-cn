---
title: "usePreviewMode"
description: "使用 usePreviewMode 检查并控制 Nuxt 的预览模式"
minimalVersion: "3.11"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/preview.ts
    size: xs
---

# `usePreviewMode`

预览模式允许你在不向用户展示的情况下，查看你的更改在线上站点上的显示效果。

你可以使用内置的 `usePreviewMode` 组合式函数来访问和控制 Nuxt 的预览状态。如果该组合式函数检测到预览模式，它会自动强制 [`useAsyncData`](/docs/api/composables/use-async-data) 和 [`useFetch`](/docs/api/composables/use-fetch) 重新渲染预览内容所需的所有更新。

```ts
const { enabled, state } = usePreviewMode()
```

## 选项

### 自定义 `enable` 检查

你可以指定自定义的方式来启用预览模式。默认情况下，如果 URL 中包含值为 `true` 的 `preview` 参数（例如 `http://localhost:3000?preview=true`），`usePreviewMode` 组合式函数会启用预览模式。你可以将 `usePreviewMode` 包装进自定义组合式函数中，以在多次使用时保持选项一致并避免错误。

```ts
export function useMyPreviewMode () {
  const route = useRoute()
  return usePreviewMode({
    shouldEnable: () => {
      return !!route.query.customPreview
    },
  })
}
```

### 修改默认状态

`usePreviewMode` 会尝试将 URL 中 `token` 参数的值存储到 state 中。你可以修改这个状态，它将对所有 [`usePreviewMode`](/docs/api/composables/use-preview-mode) 调用可用。

```ts
const data1 = ref('data1')

const { enabled, state } = usePreviewMode({
  getState: (currentState) => {
    return { data1, data2: 'data2' }
  },
})
```

:note
`getState` 函数会将其返回的值追加到当前 state 中，因此请注意不要意外覆盖重要的 state。
:

### 自定义 `onEnable` 和 `onDisable` 回调

默认情况下，当 `usePreviewMode` 被启用时，它会调用 `refreshNuxtData()` 从服务端重新获取所有数据。

当预览模式被禁用时，该组合式函数会附加一个回调，在后续 router 导航之后调用 `refreshNuxtData()`。

你可以提供自己的函数作为 `onEnable` 和 `onDisable` 选项来指定要触发的自定义回调。

```ts
const { enabled, state } = usePreviewMode({
  onEnable: () => {
    console.log('预览模式已启用')
  },
  onDisable: () => {
    console.log('预览模式已禁用')
  },
})
```

## 示例

下面的示例创建了一个页面，其中一部分内容仅在预览模式下渲染。

```vue [app/pages/some-page.vue]
<script setup>
const { enabled, state } = usePreviewMode()

const { data } = await useFetch('/api/preview', {
  query: {
    apiKey: state.token,
  },
})
</script>

<template>
  <div>
    一些基础内容
    <p v-if="enabled">
      仅预览内容：{{ state.token }}
      <br>
      <button @click="enabled = false">
        禁用预览模式
      </button>
    </p>
  </div>
</template>
```

现在你可以生成站点并运行它：

```bash [Terminal]
npx nuxt generate
npx nuxt preview
```

然后你可以通过在想要查看的页面末尾加上查询参数 `preview` 来查看预览页面，例如 `http://localhost:3000/?preview=true`。

:note
`usePreviewMode` 应当在本地使用 `nuxt generate` 再配合 `nuxt preview` 来测试，而不是 `nuxt dev`。（[preview 命令](/docs/api/commands/preview) 与预览模式无关。）
:

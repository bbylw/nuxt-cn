---
title: 'reloadNuxtApp'
description: reloadNuxtApp 会对页面执行一次硬刷新。
minimalVersion: "3.3"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/chunk.ts
    size: xs
---

::note
`reloadNuxtApp` 会对你的应用执行一次硬刷新，从服务端重新请求页面及其依赖项。
::

默认情况下，它还会保存你应用的当前 `state`（即你可以通过 `useState` 访问到的任何状态）。

::read-more{to="/docs/guide/going-further/experimental-features#restorestate" icon="i-lucide-star"}
你可以在 `nuxt.config` 文件中启用 `experimental.restoreState` 选项来启用对该状态的实验性恢复。
::

## 类型

```ts [Signature]
export function reloadNuxtApp (options?: ReloadNuxtAppOptions)

interface ReloadNuxtAppOptions {
  ttl?: number
  force?: boolean
  path?: string
  persistState?: boolean
}
```

### `options`（可选）

**类型**：`ReloadNuxtAppOptions`

一个接受以下属性的对象：

- `path`（可选）

  **类型**：`string`

  **默认值**：`window.location.pathname`

  要重载的路径（默认为当前路径）。如果这与当前窗口位置不同，它将触发一次导航，并在浏览器历史中新增一条记录。

- `ttl`（可选）

  **类型**：`number`

  **默认值**：`10000`

  在该毫秒数内忽略后续的刷新请求。如果在这段时间内再次调用，`reloadNuxtApp` 将不会重载你的应用，以避免刷新循环。

- `force`（可选）

  **类型**：`boolean`

  **默认值**：`false`

  该选项允许完全绕过刷新循环保护，即使在此前指定的 TTL 内已经发生过一次刷新，也会强制重载。

- `persistState`（可选）

  **类型**：`boolean`

  **默认值**：`false`

  是否将当前的 Nuxt 状态转储到 sessionStorage（作为 `nuxt:reload:state`）。默认情况下，除非同时设置了 `experimental.restoreState`，或者你自己处理状态的恢复，否则它对刷新没有任何效果。

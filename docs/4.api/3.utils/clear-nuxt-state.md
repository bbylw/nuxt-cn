---
title: 'clearNuxtState'
description: 删除 useState 的缓存状态。
minimalVersion: "3.6"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/state.ts
    size: xs
---

::note
如果你想要让 `useState` 的状态失效，这个方法很有用。你也可以将第二个参数传入 `{ reset: true }`，把状态重置为初始值。
::

## 类型

```ts [Signature]
export function clearNuxtState (keys?: string | string[] | ((key: string) => boolean), opts?: ClearNuxtStateOptions): void
```

## 参数

- `keys`：在 [`useState`](/docs/api/composables/use-state) 中用于删除其缓存状态的一个或多个 key。如果不提供 key，则**所有状态**都将被置为失效。
- `opts`：一个用于配置清除行为的 options 对象。
  - `reset` :badge[v4.4]{color="info" size="xs" class="align-middle"}：当设为 `true` 时，将状态重置为 [`useState`](/docs/api/composables/use-state) 的 `init` 函数提供的初始值，而不是将其设为 `undefined`。由组件提供的 `init` 函数只在该组件挂载期间生效；由插件或路由中间件提供的 `init` 函数会在应用的整个生命周期内保留。如果没有可用的 `init` 函数，则改为将状态设为 `undefined`。若未指定，默认为你 Nuxt 配置中 `experimental.defaults.useState.resetOnClear` 的值（默认为 `true`）。

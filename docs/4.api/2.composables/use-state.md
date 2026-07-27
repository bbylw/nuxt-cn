---
title: "useState"
description: useState 组合式函数创建一个可响应的、SSR 友好的共享状态。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/state.ts
    size: xs
---

## 用法

```ts
// 创建一个响应式状态并设置默认值
const count = useState('counter', () => Math.round(Math.random() * 100))
```

:read-more{to="/docs/getting-started/state-management"}

:important
因为 `useState` 内部的数据会被序列化为 JSON，所以它重要的一点是不能包含任何无法被序列化的内容，例如类、函数或符号。
:

:warning
`useState` 是编译器转换的保留函数名，因此你不应该把自己的函数命名为 `useState`。
:

:video-accordion{title="观看 Alexander Lichter 关于为什么以及何时使用 useState 的视频" videoId="mv0WcBABcIk"}

## 使用 `shallowRef`

如果你不需要你的状态是深层响应的，你可以将 `useState` 与 [`shallowRef`](https://vuejs.org/api/reactivity-advanced#shallowref) 结合使用。当你的状态包含大型对象和数组时，这能提升性能。

```ts
const state = useState('my-shallow-state', () => shallowRef({ deep: 'not reactive' }))
// isShallow(state) === true
```

## 类型

```ts [Signature]
export function useState<T> (init?: () => T | Ref<T>): Ref<T>
export function useState<T> (key: string, init?: () => T | Ref<T>): Ref<T>
```

- `key`：一个唯一的 key，确保数据获取能在多个请求之间正确去重。如果你不提供 key，则会为你生成一个对 [`useState`](/docs/api/composables/use-state) 实例的文件名和行号唯一的 key。
- `init`：一个函数，在未初始化时提供状态的初始值。该函数也可以返回一个 `Ref`。
- `T`：（仅 typescript）指定状态的类型

## 故障排查

### `Cannot stringify arbitrary non-POJOs`

当你尝试用 `useState` 存储不可序列化的 payload（例如类实例）时，会发生此错误。

如果你想用 `useState` 存储 Nuxt 不支持的类实例，可以使用 [`definePayloadPlugin`](/docs/api/composables/use-nuxt-app#自定义-reducerreviver) 为你的类添加自定义的序列化器与反序列化器。

:read-more{to="/docs/api/composables/use-nuxt-app#payload}

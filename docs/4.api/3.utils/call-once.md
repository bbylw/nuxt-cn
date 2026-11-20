---
title: "callOnce"
description: "在 SSR 或 CSR 期间只运行一次给定的函数或代码块。"
minimalVersion: "3.9"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/once.ts
    size: xs
---

::important
该工具自 [Nuxt v3.9](/blog/v3-9) 起可用。
::

## 用途

`callOnce` 函数被设计为只在以下情况执行一次给定的函数或代码块：
- 服务端渲染（但不包含 hydration）
- 客户端导航

这对于只应执行一次的代码很有用，例如记录一个事件或设置全局状态。

## 用法

`callOnce` 的默认模式是只运行一次代码。例如，如果代码在服务端运行，它就不会在客户端再次运行。如果你在客户端多次 `callOnce`（例如通过导航回到此页面），它也不会再次运行。

```vue [app/app.vue]
<script setup lang="ts">
const websiteConfig = useState('config')

await callOnce(async () => {
  console.log('这只会记录一次')
  websiteConfig.value = await $fetch('https://my-cms.com/api/website-config')
})
</script>
```

也可以在每次导航时运行，同时仍避免初始的服务端/客户端双重执行。为此，可以使用 `navigation` 模式 :badge[v3.15]{color="info" size="xs" class="align-middle"}：

```vue [app/app.vue]
<script setup lang="ts">
const websiteConfig = useState('config')

await callOnce(async () => {
  console.log('这只会记录一次，然后在每次客户端导航时记录')
  websiteConfig.value = await $fetch('https://my-cms.com/api/website-config')
}, { mode: 'navigation' })
</script>
```

::important
`navigation` 模式自 [Nuxt v3.15](/blog/v3-15) 起可用。
::

::tip{to="/docs/getting-started/state-management#usage-with-pinia"}
`callOnce` 与 [Pinia 模块](/modules/pinia) 搭配使用来调用 store 的 action 很有用。
::

:read-more{to="/docs/getting-started/state-management"}

::warning
注意 `callOnce` 不返回任何值。如果你希望在 SSR 期间获取数据，应该使用 [`useAsyncData`](/docs/api/composables/use-async-data) 或 [`useFetch`](/docs/api/composables/use-fetch)。
::

::note
`callOnce` 是一个组合式函数，意为应当直接在 setup 函数、插件或路由中间件中调用，因为它需要向 Nuxt payload 添加数据，以避免在页面 hydration 时于客户端重新调用该函数。
::

## 类型

```ts [Signature]
export function callOnce (key?: string, fn?: (() => any | Promise<any>), options?: CallOnceOptions): Promise<void>
export function callOnce (fn?: (() => any | Promise<any>), options?: CallOnceOptions): Promise<void>

type CallOnceOptions = {
  /**
   * callOnce 函数的执行模式
   * @default 'render'
   */
  mode?: 'navigation' | 'render'
}
```

## 参数

- `key`：一个唯一的 key，确保代码只运行一次。如果你不提供 key，则会为你生成一个对 `callOnce` 实例的文件名和行号唯一的 key。
- `fn`：要运行一次的函数。它可以是异步的。
- `options`：设置模式，可以是 `navigation`（在导航时重新执行）或 `render`（在应用生命周期内只执行一次）。默认为 `render`。
  - `render`：在初始渲染（SSR 或 CSR）期间执行一次 - 默认模式
  - `navigation`：在初始渲染期间执行一次，并在后续每次客户端导航时执行一次

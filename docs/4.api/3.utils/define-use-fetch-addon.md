---
title: 'defineUseFetchAddon'
description: 定义一个可复用的 addon，用于扩展由 createUseFetch 创建的组合式函数。
minimalVersion: "4.6"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/addons.ts
    size: xs
---

`defineUseFetchAddon` 为使用 [`createUseFetch`](/docs/api/composables/create-use-fetch) 创建的 `useFetch` 组合式函数定义一个可复用的扩展。

一个 addon 可以声明调用处的自定义选项、用中间件包裹 handler、附加自定义的响应式逻辑，或扩展返回的对象。

## 用法

通过 `addons` 数组把 addon 传给 `createUseFetch`。

下面这个 addon 附加了自定义逻辑：一个 watch，每当窗口重新获得焦点时就刷新数据，并通过自定义的 `refreshOnFocus` 选项加以控制：

```ts [app/composables/useCustomFetch.ts]
import { useWindowFocus } from '@vueuse/core'

const refreshOnFocus = defineUseFetchAddon({
  // 👇 为这个自定义的 useFetch 实例扩展调用处的选项
  setup: (options: UseFetchAddonOptions<{ refreshOnFocus?: boolean }>) => {
    // 👈 在 `useFetch` 中调用 `useAsyncData` *之前*运行的代码
    if (import.meta.server || !options.refreshOnFocus) { return }

    return (asyncData) => {
      // 👈 在 `useFetch` 中调用 `useAsyncData` *之后*运行的代码
      const focused = useWindowFocus()
      watch(focused, (focused) => {
        if (focused) { asyncData.refresh() }
      })

      return { focused } // 👈 用新属性扩展返回的对象
    }
  },
})

export const useCustomFetch = createUseFetch({ addons: [refreshOnFocus] })
```

```vue [app/pages/index.vue]
<script setup lang="ts">
const { data } = await useCustomFetch('/some-endpoint', { refreshOnFocus: true })
</script>
```

addon 的 `setup` 函数会在组合式函数每次被调用时运行，并接收合并后的选项（工厂默认值加上调用者传入的选项）。

::note
Addon 按 `addons` 数组的顺序运行，第一个 addon 的中间件是最外层的包裹。同一个 addon 对象重复列出也只会运行一次。
::

## 自定义选项

通过给 `setup` 的 `options` 参数标注 `UseFetchAddonOptions<{ ... }>` 来声明自定义选项。这些选项会成为创建出的组合式函数签名的一部分，并对调用者完全类型化：

```ts [app/composables/useCustomFetch.ts]
const auth = defineUseFetchAddon({
  setup: (options: UseFetchAddonOptions<{ auth?: MaybeRefOrGetter<boolean> }>) => {
    const { token } = useTokenStore()
    options.auth ??= true
    options.onRequest.push(({ options: fetchOptions }) => {
      if (!toValue(options.auth)) { return }
      fetchOptions.headers.set('Authorization', `Bearer ${token.value}`)
    })
  },
})

export const useCustomFetch = createUseFetch({ addons: [auth] })
```

```vue [app/pages/index.vue]
<script setup lang="ts">
// `auth` 是有类型的
const { data } = await useCustomFetch('/public-endpoint', { auth: false })
</script>
```

自定义选项会保留在合并后的选项对象中，因此它们会随请求选项一起传给 `$fetch`，而 `$fetch` 会忽略它不认识的 key。

## 扩展返回值

如果 `setup` 返回一个函数，那么该函数会带着 async data 实例被调用。它返回的任何对象都会被合并进组合式函数的返回值：

```ts
const timestamps = defineUseFetchAddon({
  setup: () => {
    const refreshedAt = ref<Date>()

    return (asyncData) => {
      watch(asyncData.status, (status) => {
        if (status === 'success') { refreshedAt.value = new Date() }
      }, { immediate: true })

      return { refreshedAt: readonly(refreshedAt) }
    }
  },
})

export const useCustomFetch = createUseFetch({ addons: [timestamps] })
```

```vue [app/pages/index.vue]
<script setup lang="ts">
// `refreshedAt` 是有类型的
const { data, refreshedAt } = await useCustomFetch('/modules')
</script>
```

## 中间件

中间件包裹请求 handler 的执行。调用 `next()` 以继续这条链（并获得解析后的数据），或抛出错误以中止。第一个 addon 的中间件是最外层的包裹：

```ts
const minDuration = defineUseFetchAddon({
  setup: (options: UseFetchAddonOptions<{ minDuration?: number }>) => {
    options.middleware.push(async (next) => {
      const [result] = await Promise.all([
        next(),
        new Promise(resolve => setTimeout(resolve, toValue(options.minDuration) ?? 300)),
      ])
      return result
    })
  },
})
```

## 为自动生成的 key 做出贡献

默认情况下，自定义选项**不**属于自动生成的 key。如果某个自定义选项会影响响应，请提供一个 `key` 解析器，以免不同取值的调用共享同一个缓存条目。返回一个可序列化的值，或返回 `undefined` 表示不贡献任何内容：

```ts
const scoped = defineUseFetchAddon({
  setup: (options: UseFetchAddonOptions<{ scope?: string }>) => {
    options.scope ??= 'default'
    // ...
  },
  key: options => toValue(options.scope),
})
```

::warning
请将 `setup` 声明在 `key` 之前。TypeScript 会从 `setup` 的参数标注推断出自定义选项，而写在 `setup` 之前的 `key` 解析器——当该 `setup` 返回一个扩展函数时——会被先检查并以空选项进行类型推断。
::

## 包裹 `then`、`catch` 和 `finally`

作为一种高级的兜底手段，扩展对象可以包含 `then`、`catch` 或 `finally` 函数。它们不会被合并进实例，而是包裹这个可 await 的 promise 上对应的方法，并把原方法作为第一个参数接收。

::note
当多个 addon 包裹同一个方法时，这些包裹函数会按 `addons` 数组的顺序组合：第一个 addon 的包裹函数会包住其后所有的包裹函数，就像它的中间件一样。
::

## 类型

```ts [Signature]
function defineUseFetchAddon<Opts extends Record<string, any> = {}, Ext = {}> (addon: {
  setup: (options: UseFetchAddonOptions<Opts>) => ((asyncData: AsyncDataAddonInstance) => Ext | void) | void
  key?: (options: UseFetchAddonOptions<Opts>) => SerializableValue
}): UseFetchAddon<Opts, Ext>
```

::note
`middleware`、`onRequest`、`onRequestError`、`onResponse` 和 `onResponseError` 总是会被规范化为数组，因此来自调用者和其他 addon 的拦截器都会被保留。
::

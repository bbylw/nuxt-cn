---
title: 'useNuxtApp'
description: '访问 Nuxt 应用的共享运行时上下文。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/nuxt.ts
    size: xs
---

`useNuxtApp` 是一个内置组合式函数，提供了访问 Nuxt 共享运行时上下文的方式，也就是 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context)，它在客户端和服务端都可用（但不在 Nitro 路由内）。它帮助你访问 Vue app 实例、运行时钩子、运行时配置变量以及内部状态，例如 `ssrContext` 和 `payload`。

```vue [app/app.vue]
<script setup lang="ts">
const nuxtApp = useNuxtApp()
</script>
```

如果你的作用域中运行时上下文不可用，调用 `useNuxtApp` 会抛出异常。你可以改用 [`tryUseNuxtApp`](/docs/api/composables/use-nuxt-app#tryusenuxtapp)，它适用于不要求 `nuxtApp` 的组合式函数，或者在不抛异常的情况下简单检查上下文是否可用。

## 方法

### `provide (name, value)`

`nuxtApp` 是一个运行时上下文，你可以使用 [Nuxt 插件](/docs/directory-structure/app/plugins) 来扩展它。使用 `provide` 函数创建 Nuxt 插件，让你的值和辅助方法在你的 Nuxt 应用中的所有组合式函数和组件里都可用。

`provide` 函数接受 `name` 和 `value` 参数。

```ts [app/plugins/hello.ts]
const nuxtApp = useNuxtApp()
nuxtApp.provide('hello', name => `Hello ${name}!`)

// 打印 "Hello name!"
console.log(nuxtApp.$hello('name'))
```

正如你在上面的示例中看到的，`$hello` 已经成为 `nuxtApp` 上下文新的自定义部分，并且在所有能访问 `nuxtApp` 的地方都可用。

### `hook(name, cb)`

`nuxtApp` 中可用的钩子让你能够自定义 Nuxt 应用的运行时方面。你可以在 Vue.js 组合式函数和 [Nuxt 插件](/docs/directory-structure/app/plugins) 中使用运行时钩子，钩入渲染生命周期。

`hook` 函数用于通过在特定点钩入渲染生命周期来添加自定义逻辑。它最常用于创建 Nuxt 插件。

关于 Nuxt 调用的可用运行时钩子，请参见 [运行时钩子](/docs/api/advanced/hooks#app-hooks-runtime)。

```ts [app/plugins/test.ts]
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:start', () => {
    /* 你的代码写在这里 */
  })
  nuxtApp.hook('vue:error', (..._args) => {
    console.log('vue:error')
    // if (import.meta.client) {
    //   console.log(..._args)
    // }
  })
})
```

### `callHook(name, ...args)`

`callHook` 在配合任意已有钩子调用时会返回一个 promise。

```ts [app/plugins/my-plugin.ts]
await nuxtApp.callHook('my-plugin:init')
```

## 属性

`useNuxtApp()` 暴露了以下属性，你可以用它们来扩展和自定义你的应用，并共享状态、数据和变量。

### `vueApp`

`vueApp` 是你可以通过 `nuxtApp` 访问的全局 Vue.js [应用实例](https://vuejs.org/api/application#application-api)。

一些有用的方法：
- [`component()`](https://vuejs.org/api/application#app-component) - 如果同时传入名称字符串和组件定义，则注册一个全局组件；如果只传入名称，则获取已注册的组件。
- [`directive()`](https://vuejs.org/api/application#app-directive) - 如果同时传入名称字符串和指令定义，则注册一个全局自定义指令；如果只传入名称，则获取已注册的指令[(示例)](/docs/directory-structure/app/plugins#vue-directives)。
- [`use()`](https://vuejs.org/api/application#app-use) - 安装一个 **[Vue.js 插件](https://vuejs.org/guide/reusability/plugins)** [(示例)](/docs/directory-structure/app/plugins#vue-plugins)。

:read-more{icon="i-simple-icons-vuedotjs" to="https://vuejs.org/api/application.html#application-api"}

### `ssrContext`

`ssrContext` 在服务端渲染期间生成，只在服务端可用。

Nuxt 通过 `ssrContext` 暴露以下属性：
- `url`（string）- 当前请求 url。
- `event`（[h3js/h3](https://github.com/h3js/h3) 请求事件）- 访问当前路由的请求与响应。
- `payload`（object）- NuxtApp payload 对象。

### `payload`

`payload` 将数据与状态变量从服务端暴露给客户端。以下键在从服务端传递之后会在客户端可用：

- `serverRendered`（boolean）- 指示响应是否由服务端渲染。
- `data`（object）- 当你使用 [`useFetch`](/docs/api/composables/use-fetch) 或 [`useAsyncData`](/docs/api/composables/use-async-data) 从 API 端点获取数据时，结果 payload 可以从 `payload.data` 访问。这些数据被缓存，能帮助你避免重复获取相同数据。

  ::code-group
  ```vue [app/app.vue]
  <script setup lang="ts">
  const { data } = await useAsyncData('count', (_nuxtApp, { signal }) => $fetch('/api/count', { signal }))
  </script>
  ```
  ```ts [server/api/count.ts]
  export default defineEventHandler((event) => {
    return { count: 1 }
  })
  ```
  ::

  在上面的示例中用 [`useAsyncData`](/docs/api/composables/use-async-data) 获取到 `count` 的值之后，如果你访问 `payload.data`，会看到其中记录着 `{ count: 1 }`。

  当从 [`ssrcontext`](/docs/api/composables/use-nuxt-app#ssrcontext) 访问相同的 `payload.data` 时，你在服务端侧也能访问相同的值。

- `state`（object）- 当在 Nuxt 中使用 [`useState`](/docs/api/composables/use-state) 组合式函数设置共享状态时，该状态数据通过 `payload.state.[你的状态名称]` 访问。

  ```ts [app/plugins/my-plugin.ts]
  export const useColor = () => useState<string>('color', () => 'pink')

  export default defineNuxtPlugin((nuxtApp) => {
    if (import.meta.server) {
      const color = useColor()
    }
  })
  ```

  也可以使用更高级的类型，例如 `ref`、`reactive`、`shallowRef`、`shallowReactive` 和 `NuxtError`。

#### 自定义 Reducer/Reviver :badge[v3.4]{color="info" size="xs" class="align-middle"}

  自 [Nuxt v3.4](https://nuxt.com/blog/v3-4#payload-enhancements) 起，你可以为 Nuxt 不支持的类型定义自己的 reducer/reviver。

  :video-accordion{title="观看 Alexander Lichter 关于序列化 payload 的视频，特别是关于类的部分" videoId="8w6ffRBs8a4"}

  在下面的示例中，我们使用 payload 插件为 [Luxon](https://moment.github.io/luxon/#/) 的 DateTime 类定义 reducer（序列化器）和 reviver（反序列化器）。

  ```ts [app/plugins/date-time-payload.ts]
  /**
   * 这类插件在 Nuxt 生命周期中运行得非常早，在我们恢复 payload 之前。
   * 你将无法访问 router 或其他 Nuxt 注入的属性。
   *
   * 注意 "DateTime" 字符串是类型标识符，在 reducer 和 reviver 中必须相同。
   */
  export default definePayloadPlugin((nuxtApp) => {
    definePayloadReducer('DateTime', (value) => {
      return value instanceof DateTime && value.toJSON()
    })
    definePayloadReviver('DateTime', (value) => {
      return DateTime.fromISO(value)
    })
  })
  ```

### `isHydrating`

使用 `nuxtApp.isHydrating`（boolean）来检查 Nuxt 应用是否正在客户端进行 hydration。

```ts [app/components/nuxt-error-boundary.ts]
export default defineComponent({
  setup (_props, { slots, emit }) {
    const nuxtApp = useNuxtApp()
    onErrorCaptured((err) => {
      if (import.meta.client && !nuxtApp.isHydrating) {
        // ...
      }
    })
  },
})
```

### `runWithContext`

::note
你很可能是因为收到「Nuxt instance unavailable」消息才来到这里。请谨慎使用此方法，并报告导致问题的示例，以便最终能在框架层面解决。
::

`runWithContext` 方法用于调用一个函数并为其提供显式的 Nuxt 上下文。通常，Nuxt 上下文是隐式传递的，你无需为此担心。然而，在处理中间件/插件中复杂的 `async`/`await` 场景时，你可能会遇到当前实例在异步调用后被取消设置的情况。

```ts [app/middleware/auth.ts]
export default defineNuxtRouteMiddleware(async (to, from) => {
  const nuxtApp = useNuxtApp()
  let user
  try {
    user = await fetchUser()
    // 由于 try/catch 块，Vue/Nuxt 编译器在这里丢失了上下文。
  } catch (e) {
    user = null
  }
  if (!user) {
    // 将正确的 Nuxt 上下文应用到我们的 `navigateTo` 调用上。
    return nuxtApp.runWithContext(() => navigateTo('/auth'))
  }
})
```

#### 用法

```ts [Usage]
const result = nuxtApp.runWithContext(() => functionWithContext())
```

- `functionWithContext`：任何需要当前 Nuxt 应用上下文的函数。该上下文会被自动正确应用。

`runWithContext` 会返回 `functionWithContext` 返回的任何值。

#### 关于上下文的深入解释

Vue.js 组合式 API（以及类似的 Nuxt 组合式函数）依赖于隐式上下文来工作。在生命周期中，Vue 将当前组件的临时实例（以及 Nuxt 的 nuxtApp 临时实例）设置到一个全局变量上，并在同一 tick 中取消设置。在服务端渲染时，来自不同用户的多个请求和 nuxtApp 运行在同一个全局上下文中。正因如此，Nuxt 和 Vue 会立即取消设置这个全局实例，以避免在两个用户或组件之间泄漏共享引用。

这意味着什么？组合式 API 和 Nuxt 组合式函数只在生命周期内、且在任何异步操作之前的同一 tick 中可用：

```ts [概念示例]
// --- Vue 内部 ---
const _vueInstance = null
const getCurrentInstance = () => _vueInstance
// ---

// Vue / Nuxt 在调用 setup() 时将引用当前组件的全局变量设置到 _vueInstance 中
async function setup () {
  getCurrentInstance() // 可用
  await someAsyncOperation() // Vue 在同一 tick 中、异步操作之前取消设置上下文！
  getCurrentInstance() // null
}
```

经典的解决方案是，在首次调用时将当前实例缓存到一个局部变量，如 `const instance = getCurrentInstance()`，并在下一次组合式函数调用中使用它；但问题在于，任何嵌套的组合式函数调用现在都需要显式接受该实例作为参数，而不能依赖组合式 API 的隐式上下文。这是组合式函数的设计限制，本身并非问题。

为了克服这个限制，Vue 在编译应用代码时会做一些幕后工作，并在每次 `<script setup>` 调用之后恢复上下文：

```ts [编译输出]
const __instance = getCurrentInstance() // 由 Vue 编译器生成
getCurrentInstance() // 可用！
await someAsyncOperation() // Vue 取消设置上下文
__restoreInstance(__instance) // 由 Vue 编译器生成
getCurrentInstance() // 仍然可用！
```

关于 Vue 实际做了什么的更好描述，请参见 [unjs/unctx#2 (评论)](https://github.com/unjs/unctx/issues/2#issuecomment-942193723)。

#### 解决方案

这正是 `runWithContext` 可以用来恢复上下文的地方，其工作方式与 `<script setup>` 类似。

Nuxt 内部使用 [unjs/unctx](https://github.com/unjs/unctx) 来支持类似于 Vue 的组合式函数，以用于插件和中间件。这使得诸如 `navigateTo()` 之类的组合式函数无需直接向其传入 `nuxtApp` 就能工作——将组合式 API 的开发体验和性能优势带给了整个 Nuxt 框架。

Nuxt 组合式函数与 Vue 组合式 API 拥有相同的设计，因此需要类似的方案来自动完成这个转换。查看 [unjs/unctx#2](https://github.com/unjs/unctx/issues/2)（提案）、[unjs/unctx#4](https://github.com/unjs/unctx/pull/4)（转换实现），以及 [nuxt/framework#3884](https://github.com/nuxt/framework/pull/3884)（集成到 Nuxt）。

Vue 目前只支持 `<script setup>` 中异步/await 用法的异步上下文恢复。在 Nuxt 中，`defineNuxtPlugin()` 和 `defineNuxtRouteMiddleware()` 的转换支持已被添加，这意味着当你使用它们时，Nuxt 会自动对它们进行上下文恢复转换。

#### 剩余问题

`unjs/unctx` 自动恢复上下文的转换在包含 `await` 的 `try/catch` 语句中似乎存在问题，这最终需要被解决，才能移除上面变通方案的要求。

#### 原生异步上下文

使用一个实验性新特性，可以启用原生异步上下文支持，通过 [Node.js `AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) 和新的 unctx 支持，将异步上下文**原生地**提供给**任何嵌套的异步组合式函数**，而无需转换或手动传递/调用上下文。

::tip
原生异步上下文支持目前可在 Bun 和 Node 中工作。
::

:read-more{to="/docs/guide/going-further/experimental-features#asynccontext"}

## tryUseNuxtApp :badge[v3.10]{color="info" size="xs" class="align-middle"}

该函数的工作方式与 `useNuxtApp` 完全相同，但如果上下文不可用，则返回 `null` 而不是抛出异常。

你可以将它用于不要求 `nuxtApp` 的组合式函数，或者在不抛异常的情况下简单检查上下文是否可用。

示例用法：

```ts [composable.ts]
export function useStandType () {
  // 在客户端始终可用
  if (tryUseNuxtApp()) {
    return useRuntimeConfig().public.STAND_TYPE
  } else {
    return process.env.STAND_TYPE
  }
}
```

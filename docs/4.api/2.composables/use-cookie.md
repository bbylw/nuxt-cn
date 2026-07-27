---
title: 'useCookie'
description: useCookie 是一个 SSR 友好的组合式函数，用于读写 cookie。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/cookie.ts
    size: xs
---

## 用法

在你的页面、组件和插件中，你可以使用 `useCookie` 以 SSR 友好的方式读写 cookie。

```ts [Usage]
const cookie = useCookie(name, options)
```

:note
`useCookie` 只能在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中使用。
:

:tip
返回的 ref 会自动将 cookie 值序列化和反序列化为 JSON。
:

## 类型

```ts [Signature]
import type { Ref } from 'vue'
import type { CookieParseOptions, CookieSerializeOptions } from 'cookie-es'

export interface CookieOptions<T = any> extends Omit<CookieSerializeOptions & CookieParseOptions, 'decode' | 'encode'> {
  decode?(value: string): T
  encode?(value: T): string
  default?: () => T | Ref<T>
  watch?: boolean | 'shallow'
  readonly?: boolean
  refresh?: boolean
}

export interface CookieRef<T> extends Ref<T> {}

export function useCookie<T = string | null | undefined> (
  name: string,
  options?: CookieOptions<T>,
): CookieRef<T>
```

## 参数

`name`：cookie 的名称。

`options`：用于控制 cookie 行为的选项。该对象可以具有以下属性：

大多数选项会直接传给 [cookie](https://github.com/jshttp/cookie) 包。

| 属性 | 类型 | 默认值 | 描述 |
|---------------|------------------------|----------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `decode` | `(value: string) => T` | `decodeURIComponent` + [destr](https://github.com/unjs/destr)。 | 用于解码 cookie 值的自定义函数。由于 cookie 的值字符集有限（且必须是简单的字符串），该函数可用于将之前编码的 cookie 值解码为 JavaScript 字符串或其他对象。<br/> **注意：** 如果该函数抛出错误，将返回原始、未解码的 cookie 值作为该 cookie 的值。 |
| `encode` | `(value: T) => string` | `JSON.stringify` + `encodeURIComponent` | 用于编码 cookie 值的自定义函数。由于 cookie 的值字符集有限（且必须是简单的字符串），该函数可用于将值编码为适合 cookie 值的字符串。 |
| `default` | `() => T \| Ref<T>` | `undefined` | 当 cookie 不存在时返回默认值的函数。该函数也可以返回 `Ref`。 |
| `watch` | `boolean \| 'shallow'` | `true` | 是否监视变化并更新 cookie。`true` 为深度监视，`'shallow'` 为浅层监视（即仅顶层属性的数据变化），`false` 为禁用。<br/> **注意：** 当 cookie 发生变化时，使用 [`refreshCookie`](/docs/api/utils/refresh-cookie) 手动刷新 `useCookie` 值。 |
| `refresh` :badge[v4.4]{color="info" size="xs" class="align-middle"} | `boolean` | `false` | 如果为 `true`，则每次显式写入（如 `cookie.value = cookie.value`）时都会刷新 cookie 过期时间，即使值本身没有变化。注意：过期时间不会自动刷新——你必须对 `.value` 赋值来触发它。 |
| `readonly` | `boolean` | `false` | 如果为 `true`，则禁用对 cookie 的写入。 |
| `maxAge` | `number` | `undefined` | cookie 的最大存活时间（秒），即 [`Max-Age` `Set-Cookie` 属性](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.2) 的值。给定的数字会被向下取整为整数。默认不设置最大存活时间。 |
| `expires` | `Date \| (() => Date \| undefined)` | `undefined` | cookie 的过期时间，或返回过期时间的 getter。提供函数时，它会在每次写入 cookie 时被求值，因此过期时间可以在值被重置时刷新。返回 `undefined` 会创建一个会话 cookie。getter 应当是纯函数（无副作用）。默认不设置过期时间。大多数客户端会将其视为「非持久 cookie」，并在退出浏览器应用时删除它。<br/> **注意：** [cookie 存储模型规范](https://datatracker.ietf.org/doc/html/rfc6265#section-5.3) 指出如果同时设置了 `expires` 和 `maxAge`，则 `maxAge` 优先，但并非所有客户端都会遵守这一点，因此如果同时设置两者，它们应指向相同的日期和时间！<br/>如果 `expires` 和 `maxAge` 都没有设置，cookie 将仅为会话级别，并在用户关闭浏览器时被移除。 |
| `httpOnly` | `boolean` | `false` | 设置 HttpOnly 属性。<br/> **注意：** 将其设为 `true` 时要小心，因为合规的客户端将不允许客户端 JavaScript 在 `document.cookie` 中看到该 cookie。 |
| `secure` | `boolean` | `false` | 设置 [`Secure` `Set-Cookie` 属性](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.5)。<br/>**注意：** 将其设为 `true` 时要小心，因为如果浏览器没有 HTTPS 连接，合规的客户端未来不会将 cookie 回传给服务器。这可能导致 hydration 错误。 |
| `partitioned` | `boolean` | `false` | 设置 [`Partitioned` `Set-Cookie` 属性](https://datatracker.ietf.org/doc/html/draft-cutler-httpbis-partitioned-cookies#section-2.1)。<br/>**注意：** 这是一个尚未完全标准化的属性，未来可能会变化。<br/>这也意味着许多客户端在该属性被它们理解之前会忽略它。<br/>更多信息可参见 [提案](https://github.com/privacycg/CHIPS)。 |
| `domain` | `string` | `undefined` | 设置 [`Domain` `Set-Cookie` 属性](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.3)。默认不设置 domain，大多数客户端会考虑仅将 cookie 应用于当前 domain。 |
| `path` | `string` | `'/'` | 设置 [`Path` `Set-Cookie` 属性](https://datatracker.ietf.org/doc/html/rfc6265#section-5.2.4)。默认 path 被视为 [「默认 path」](https://datatracker.ietf.org/doc/html/rfc6265#section-5.1.4)。 |
| `sameSite` | `boolean \| string` | `undefined` | 设置 [`SameSite` `Set-Cookie` 属性](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7)。<br/>- `true` 会将 `SameSite` 属性设为 `Strict`，进行严格同站强制。<br/>- `false` 不会设置 `SameSite` 属性。<br/>- `'lax'` 会将 `SameSite` 属性设为 `Lax`，进行宽松同站强制。<br/>- `'none'` 会将 `SameSite` 属性设为 `None`，用于显式的跨站 cookie。<br/>- `'strict'` 会将 `SameSite` 属性设为 `Strict`，进行严格同站强制。 |

## 返回值

返回一个代表 cookie 值的 Vue `Ref<T>`。更新 ref 会更新 cookie（除非设置了 `readonly`）。该 ref 是 SSR 友好的，在服务端和客户端都能工作。

## 示例

### 基础用法

下面的示例创建了一个名为 `counter` 的 cookie。如果 cookie 不存在，则初始设为随机值。每当我们更新 `counter` 变量时，cookie 也会相应更新。

```vue [app/app.vue]
<script setup lang="ts">
const counter = useCookie('counter')

counter.value ||= Math.round(Math.random() * 1000)
</script>

<template>
  <div>
    <h1>Counter: {{ counter || '-' }}</h1>
    <button @click="counter = null">
      reset
    </button>
    <button @click="counter--">
      -
    </button>
    <button @click="counter++">
      +
    </button>
  </div>
</template>
```

### 只读 Cookie

```vue [app/app.vue]
<script setup lang="ts">
const user = useCookie(
  'userInfo',
  {
    default: () => ({ score: -1 }),
    watch: false,
  },
)

if (user.value) {
  // 实际的 `userInfo` cookie 不会被更新
  user.value.score++
}
</script>

<template>
  <div>User score: {{ user?.score }}</div>
</template>
```

### 可写 Cookie

```vue [app/app.vue]
<script setup lang="ts">
const list = useCookie(
  'list',
  {
    default: () => [],
    watch: 'shallow',
  },
)

function add () {
  list.value?.push(Math.round(Math.random() * 1000))
  // list cookie 不会因这次变化而更新
}

function save () {
  // 实际的 `list` cookie 会被更新
  list.value &&= [...list.value]
}
</script>

<template>
  <div>
    <h1>List</h1>
    <pre>{{ list }}</pre>
    <button @click="add">
      Add
    </button>
    <button @click="save">
      Save
    </button>
  </div>
</template>
```

### 刷新 Cookie

```vue [app/app.vue]
<script setup lang="ts">
const session = useCookie(
  'session', {
    maxAge: 60 * 60, // 1 小时
    refresh: true,
    default: () => 'active',
  })

// 即使值没有变化，
// 每次调用 setter 时都会刷新 cookie 过期时间
session.value = 'active'
</script>

<template>
  <div>Session: {{ session }}</div>
</template>
```

### 使用 Getter 实现动态过期

当你希望每次写入 cookie 时都有一个全新的过期时间（例如滑动会话或 token）时，可以对 `expires` 使用函数：

```vue [app/app.vue]
<script setup lang="ts">
const token = useCookie('token', {
  // 每次写入时重新求值——保持该 getter 为纯函数
  expires: () => new Date(Date.now() + 60 * 60 * 1000), // 当前时间起 1 小时
})

// 赋值新值也会刷新 cookie 过期时间
token.value = 'new-token'
</script>
```

### API 路由中的 Cookie

你可以在服务端 API 路由中使用 [`h3`](https://github.com/h3js/h3) 包的 `getCookie` 和 `setCookie` 来设置 cookie。

```ts [server/api/counter.ts]
export default defineEventHandler((event) => {
  // 读取 counter cookie
  let counter = getCookie(event, 'counter') || 0

  // counter cookie 加 1
  setCookie(event, 'counter', ++counter)

  // 发送 JSON 响应
  return { counter }
})
```

:link-example{to="/docs/examples/advanced/use-cookie"}

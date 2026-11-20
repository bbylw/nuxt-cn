---
title: 'useRuntimeConfig'
description: '使用 useRuntimeConfig 组合式函数访问运行时配置变量。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/nuxt.ts
    size: xs
---

## 用法

```vue [app/app.vue]
<script setup lang="ts">
const config = useRuntimeConfig()
</script>
```

```ts [server/api/foo.ts]
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
})
```

:read-more{to="/docs/guide/going-further/runtime-config"}

## 定义运行时配置

下面的示例展示了如何设置一个公共的 API base URL，以及一个仅在服务端可访问的私密 API token。

我们应该始终在 `nuxt.config` 内部定义 `runtimeConfig` 变量。

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  runtimeConfig: {
    // 私有 key 只在服务端可用
    apiSecret: '123',

    // 暴露给客户端的公共 key
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
})
```

::note
需要在服务端访问的变量直接添加在 `runtimeConfig` 内。需要同时在客户端和服务端访问的变量定义在 `runtimeConfig.public` 中。
::

:read-more{to="/docs/guide/going-further/runtime-config"}

## 访问运行时配置

要访问运行时配置，我们可以使用 `useRuntimeConfig()` 组合式函数：

```ts [server/api/test.ts]
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // 访问公共变量
  const result = await $fetch(`/test`, {
    baseURL: config.public.apiBase,
    headers: {
      // 访问私有变量（只在服务端可用）
      Authorization: `Bearer ${config.apiSecret}`,
    },
  })
  return result
})
```

在这个示例中，由于 `apiBase` 定义在 `public` 命名空间内，它在服务端和客户端都能普遍访问，而 `apiSecret` **只在服务端可用**。

## 环境变量

可以通过使用 `NUXT_` 前缀的环境变量名来更新运行时配置值。

:read-more{to="/docs/guide/going-further/runtime-config"}

### 使用 `.env` 文件

我们可以在 `.env` 文件中设置环境变量，使其在**开发**和**构建/生成**期间可访问。

```ini [.env]
NUXT_PUBLIC_API_BASE = "https://api.localhost:5555"
NUXT_API_SECRET = "123"
```

::note
在 `.env` 文件中设置的任何环境变量，在 Nuxt 应用**开发**和**构建/生成**期间都可以通过 `process.env` 访问。
::

::warning
在**生产运行时**，你应该使用平台环境变量，`.env` 不会被使用。
::

:read-more{to="/docs/directory-structure/env"}

## `app` 命名空间

Nuxt 在 runtime-config 中使用 `app` 命名空间，其 key 包括 `baseURL` 和 `cdnURL`。你可以在运行时通过设置环境变量来自定义它们的值。

::note
这是一个保留命名空间。你不应该在 `app` 内引入额外的 key。
::

### `app.baseURL`

默认情况下，`baseURL` 设为 `'/'`。

不过，`baseURL` 可以通过设置 `NUXT_APP_BASE_URL` 环境变量在运行时更新。

然后，你可以通过 `config.app.baseURL` 访问这个新的 base URL：

```ts [/plugins/my-plugin.ts]
export default defineNuxtPlugin((NuxtApp) => {
  const config = useRuntimeConfig()

  // 普遍访问 baseURL
  const baseURL = config.app.baseURL
})
```

### `app.cdnURL`

这个示例展示了如何设置自定义 CDN url 并使用 `useRuntimeConfig()` 访问它。

你可以使用 NUXT_APP_CDN_URL 环境变量，用自定义 CDN 来提供 `.output/public` 内的静态资源。

然后通过 `config.app.cdnURL` 访问新的 CDN url。

```ts [server/api/foo.ts]
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  // 普遍访问 cdnURL
  const cdnURL = config.app.cdnURL
})
```

:read-more{to="/docs/guide/going-further/runtime-config"}

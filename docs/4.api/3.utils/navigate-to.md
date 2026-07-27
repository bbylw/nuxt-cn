---
title: "navigateTo"
description: navigateTo 是一个用于以编程方式导航用户的辅助函数。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

## 用法

`navigateTo` 在服务端和客户端都可用。它可以在 [Nuxt 上下文](/docs/guide/going-further/nuxt-app#the-nuxt-context) 中使用，也可以直接使用，以执行页面导航。

:warning
调用 `navigateTo` 时，务必对其结果使用 `await` 或 `return`。
:

:note
`navigateTo` 不能在 Nitro 路由中使用。要在 Nitro 路由中执行服务端重定向，请改用 [`sendRedirect`](https://h3.dev/utils/response#redirectlocation-status-statustext)。
:

### 在 Vue 组件中

```vue
<script setup lang="ts">
// 将 'to' 作为字符串传入
await navigateTo('/search')

// ... 或作为路由对象
await navigateTo({ path: '/search' })

// ... 或作为带有查询参数的路由对象
await navigateTo({
  path: '/search',
  query: {
    page: 1,
    sort: 'asc',
  },
})
</script>
```

### 在路由中间件中

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== '/search') {
    // 将重定向码设为 '301 Moved Permanently'
    return navigateTo('/search', { redirectCode: 301 })
  }
})
```

在路由中间件中使用 `navigateTo` 时，你必须**return 其结果**，以确保中间件执行流程正常工作。

例如，下面的实现**将无法按预期工作**：

```ts
export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path !== '/search') {
    // ❌ 这将无法按预期工作
    navigateTo('/search', { redirectCode: 301 })
    return
  }
})
```

在这种情况下，`navigateTo` 会被执行但没有被 return，这可能导致意外的行为。

:read-more{to="/docs/directory-structure/app/middleware"}

### 导航到外部 URL

`navigateTo` 中的 `external` 参数会影响处理 URL 导航的方式：

- **不使用 `external: true`**：
  - 内部 URL 按预期导航。
  - 外部 URL 会抛出错误。

- **使用 `external: true`**：
  - 内部 URL 以整页重新加载的方式导航。
  - 外部 URL 按预期导航。

#### 示例

```vue
<script setup lang="ts">
// 会抛出错误；
// 默认不允许导航到外部 URL
await navigateTo('https://nuxt.com')

// 将成功重定向，'external' 参数设为 'true'
await navigateTo('https://nuxt.com', {
  external: true,
})
</script>
```

### 在新标签页中打开页面

```vue
<script setup lang="ts">
// 将在新标签页中打开 'https://nuxt.com'
await navigateTo('https://nuxt.com', {
  open: {
    target: '_blank',
    windowFeatures: {
      width: 500,
      height: 500,
    },
  },
})
</script>
```

## 类型

```ts [Signature]
export function navigateTo (
  to: RouteLocationRaw | undefined | null,
  options?: NavigateToOptions,
): Promise<void | NavigationFailure | false> | false | void | RouteLocationRaw

interface NavigateToOptions {
  replace?: boolean
  redirectCode?: number
  external?: boolean
  open?: OpenOptions
}

type OpenOptions = {
  target: string
  windowFeatures?: OpenWindowFeatures
}

type OpenWindowFeatures = {
  popup?: boolean
  noopener?: boolean
  noreferrer?: boolean
} & XOR<{ width?: number }, { innerWidth?: number }>
  & XOR<{ height?: number }, { innerHeight?: number }>
  & XOR<{ left?: number }, { screenX?: number }>
  & XOR<{ top?: number }, { screenY?: number }>
```

## 参数

### `to`

**类型**：[`RouteLocationRaw`](https://router.vuejs.org/api/interfaces/routelocationoptions) | `undefined` | `null`

**默认值**：`'/`

`to` 可以是一个纯字符串，或要重定向到的路由对象。当传入 `undefined` 或 `null` 时，默认会指向 `'/'`。

#### 示例

```ts
// 直接传入 URL 会重定向到 '/blog' 页面
await navigateTo('/blog')

// 使用路由对象，会重定向到名称为 'blog' 的路由
await navigateTo({ name: 'blog' })

// 使用路由对象重定向到 'product' 路由，同时传入参数 (id = 1)
await navigateTo({ name: 'product', params: { id: 1 } })
```

### `options`（可选）

**类型**：`NavigateToOptions`

一个接受以下属性的对象：

- `replace`

  - **类型**：`boolean`
  - **默认值**：`false`
  - 默认情况下，`navigateTo` 会将给定路由推入客户端的 Vue Router 实例。

    可以通过将 `replace` 设为 `true` 来改变此行为，表示应该替换给定路由。

- `redirectCode`

  - **类型**：`number`
  - **默认值**：`302`

  - 当重定向发生在服务端时，`navigateTo` 默认重定向到给定路径并将重定向码设为 [`302 Found`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/302)。

    可以通过提供不同的 `redirectCode` 来修改这个默认行为。通常，[`301 Moved Permanently`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301) 可用于永久性重定向。

- `external`

  - **类型**：`boolean`
  - **默认值**：`false`

  - 设为 `true` 时允许导航到外部 URL。否则，由于默认不允许外部导航，`navigateTo` 会抛出错误。

- `open`

  - **类型**：`OpenOptions`
  - 允许使用 window 的 [open()](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) 方法导航到该 URL。此选项仅适用于客户端，在服务端会被忽略。

    一个接受以下属性的对象：

  - `target`

    - **类型**：`string`
    - **默认值**：`'_blank'`

    - 一个没有空白字符的字符串，指定资源被加载到的浏览上下文的名称。

  - `windowFeatures`

    - **类型**：`OpenWindowFeatures`

    - 一个接受以下属性的对象：

      | 属性                      | 类型      | 描述                                                                              |
      |---------------------------|-----------|-----------------------------------------------------------------------------------|
      | `popup`                   | `boolean` | 请求一个最小的弹出窗口而不是新标签页，其 UI 特性由浏览器决定。                    |
      | `width` 或 `innerWidth`   | `number`  | 指定内容区域的宽度（最小 100 像素），包括滚动条。                                |
      | `height` 或 `innerHeight` | `number`  | 指定内容区域的高度（最小 100 像素），包括滚动条。                                |
      | `left` 或 `screenX`       | `number`  | 设置新窗口相对于屏幕左边缘的水平位置。                                            |
      | `top` 或 `screenY`        | `number`  | 设置新窗口相对于屏幕顶部的垂直位置。                                              |
      | `noopener`                | `boolean` | 阻止新窗口通过 `window.opener` 访问原始窗口。                                      |
      | `noreferrer`              | `boolean` | 阻止发送 Referer 请求头，并隐式启用 `noopener`。                                  |

      参见[文档](https://developer.mozilla.org/en-US/docs/Web/API/Window/open#windowfeatures)以获取关于 **windowFeatures** 属性的更详细信息。

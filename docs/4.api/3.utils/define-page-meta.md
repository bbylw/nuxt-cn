---
title: 'definePageMeta'
description: '为你的页面组件定义元数据。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/pages/runtime/composables.ts
    size: xs
---

`definePageMeta` 是一个编译器宏，可用于为位于 [`app/pages/`](/docs/directory-structure/app/pages) 目录中的**页面**组件（除非[另有设置](/docs/api/nuxt-config#pages)）设置元数据。这样你就可以为 Nuxt 应用的每个静态或动态路由设置自定义元数据。

```vue [app/pages/some-page.vue]
<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>
```

:read-more{to="/docs/directory-structure/app/pages#page-metadata"}

## 类型

```ts [Signature]
export function definePageMeta (meta: PageMeta): void

interface PageMeta {
  validate?: ((route: RouteLocationNormalized) => boolean | Promise<boolean> | Partial<NuxtError> | Promise<Partial<NuxtError>>)
  redirect?: RouteRecordRedirectOption
  name?: string
  path?: string
  props?: RouteRecordRaw['props']
  alias?: string | string[]
  groups?: string[]
  pageTransition?: boolean | TransitionProps
  layoutTransition?: boolean | TransitionProps
  viewTransition?: ViewTransitionPageOptions['enabled'] | ViewTransitionPageOptions
  key?: false | string | ((route: RouteLocationNormalizedLoaded) => string)
  keepalive?: boolean | KeepAliveProps
  layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey> | { name?: LayoutKey | false, props?: Record<string, unknown> /* or the selected layout's props */ }
  middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  scrollToTop?: boolean | ((to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded) => boolean)
  [key: string]: unknown
}
```

## 参数

### `meta`

- **类型**：`PageMeta`

  一个接受以下页面元数据的对象：

  **`name`**

  - **类型**：`string`

    你可以为这个页面的路由定义一个名称。默认情况下，name 是基于 [`app/pages/` 目录](/docs/directory-structure/app/pages) 中的路径生成的。

  **`path`**

  - **类型**：`string`

    如果你有比文件名能表达的更复杂的模式，可以定义一个[自定义正则表达式](/docs/api/utils/define-page-meta#using-a-custom-regular-expression)。

  **`props`**

  - **类型**：[`RouteRecordRaw['props']`](https://router.vuejs.org/guide/essentials/passing-props)

    允许将路由的 `params` 作为 props 传入页面组件。

  **`alias`**

  - **类型**：`string | string[]`

    该记录的别名。允许定义额外的路径，使其表现得像该记录的一个副本。允许使用路径简写，例如 `/users/:id` 和 `/u/:id`。所有 `alias` 和 `path` 值必须共享相同的 params。

  **`groups`** :badge[v4.3]{color="info" size="xs" class="align-middle"}

  - **类型**：`string[]`

    页面所属的路由组，基于文件夹结构。会自动为[路由组](/docs/guide/directory-structure/app/pages#route-groups)中的页面填充。

  **`keepalive`**

  - **类型**：`boolean` | [`KeepAliveProps`](https://vuejs.org/api/built-in-components#keepalive)

    当你想在路由切换之间保留页面状态，或使用 [`KeepAliveProps`](https://vuejs.org/api/built-in-components#keepalive) 进行细粒度控制时，设为 `true`。

  **`key`**

  - **类型**：`false` | `string` | `((route: RouteLocationNormalizedLoaded) => string)`

    当你需要更多地控制 `<NuxtPage>` 组件何时重新渲染时，设置 `key` 值。

  **`layout`**

  - **类型**：`false` | `LayoutKey` | `Ref<LayoutKey>` | `ComputedRef<LayoutKey>` | `{ name?: LayoutKey | false; props?: Record<string, unknown> /* or the selected layout's props */ }`

    为每个路由设置静态或动态的布局名称。如果默认布局需要被禁用，可以将其设为 `false`。

    你也可以传入一个带有 `name` 和 `props` 的对象，将带类型的 props 传给你的布局组件。当你的布局用 `defineProps` 定义 props 时，它们在 `definePageMeta` 中会被完全类型化。

  **`layoutTransition`**

  - **类型**：`boolean` | [`TransitionProps`](https://vuejs.org/api/built-in-components#transition)

    设置要应用于当前布局的过渡名称。你也可以将此值设为 `false` 来禁用布局过渡。

  **`middleware`**

  - **类型**：`MiddlewareKey` | [`NavigationGuard`](https://router.vuejs.org/api/interfaces/navigationguard) | `Array<MiddlewareKey | NavigationGuard>`

    直接在 `definePageMeta` 中定义匿名或命名中间件。了解更多关于[路由中间件](/docs/directory-structure/app/middleware)的内容。

  **`pageTransition`**

  - **类型**：`boolean` | [`TransitionProps`](https://vuejs.org/api/built-in-components#transition)

    设置要应用于当前页面的过渡名称。你也可以将此值设为 `false` 来禁用页面过渡。

  **`viewTransition`**

  - **类型**：`boolean | 'always' | ViewTransitionPageOptions`

    **实验性特性，仅在[你的 nuxt.config 文件中启用](/docs/getting-started/transitions#view-transitions-api-experimental)后才可用**</br>
    启用/禁用当前页面的视图过渡（View Transitions）。
    如果设为 true，当用户的浏览器匹配 `prefers-reduced-motion: reduce` 时 Nuxt 不会应用过渡（推荐）。如果设为 `always`，Nuxt 将总是应用过渡。

    你也可以传入一个 `ViewTransitionPageOptions` 对象来配置[视图过渡类型](/docs/getting-started/transitions#view-transition-types)：
    - `enabled`：`boolean | 'always'` - 启用/禁用过渡
    - `types`：`string[] | (to, from) => string[]` - 应用于任何涉及此页面的过渡的类型
    - `toTypes`：`string[] | (to, from) => string[]` - 仅当导航**到**此页面时应用的类型
    - `fromTypes`：`string[] | (to, from) => string[]` - 仅当导航**离开**此页面时应用的类型

  **`redirect`**

  - **类型**：[`RouteRecordRedirectOption`](https://router.vuejs.org/guide/essentials/redirect-and-alias)

    如果路由被直接匹配，重定向到哪里。重定向发生在任何导航守卫之前，并触发一个以新目标位置为对象的新导航。

  **`validate`**

  - **类型**：`(route: RouteLocationNormalized) => boolean | Promise<boolean> | Partial<NuxtError> | Promise<Partial<NuxtError>>`

    校验给定的路由是否可以有效地由本页面渲染。如果有效则返回 true，否则返回 false。如果找不到其他匹配项，这意味着 404。你也可以直接返回一个带有 `status`/`statusText` 的对象，以立即响应一个错误（不会再去检查其他匹配项）。

  **`scrollToTop`**

  - **类型**：`boolean | (to: RouteLocationNormalized, from: RouteLocationNormalized) => boolean`

    告诉 Nuxt 在渲染页面之前是否滚动到顶部。导航与渲染是独立的，因此即使页面没有重新渲染（例如使用固定的 [`key`](/docs/api/utils/define-page-meta#key)），滚动行为也总是会被触发。在这种情况下设置 `scrollToTop: false` 可禁用滚动。如果你想覆盖 Nuxt 的默认滚动行为，可以在 `~/router.options.ts` 中进行（参见[自定义路由](/docs/guide/recipes/custom-routing#using-routeroptions)获取更多信息）。

  **`[key: string]`**

  - **类型**：`any`

    除了上述属性，你还可以设置**自定义**元数据。你可能希望以类型安全的方式通过[扩充 `meta` 对象的类型](/docs/directory-structure/app/pages/#typing-custom-metadata)来实现。

## 示例

### 基础用法

下面的示例展示了：

- `key` 如何可以是一个返回值的函数；
- `keepalive` 属性如何确保在多个组件之间切换时 `<modal>` 组件不会被缓存；
- 如何添加 `pageType` 作为自定义属性：

```vue [app/pages/some-page.vue]
<script setup lang="ts">
definePageMeta({
  key: route => route.fullPath,

  keepalive: {
    exclude: ['modal'],
  },

  pageType: 'Checkout',
})
</script>
```

### 定义中间件

下面的示例展示了中间件如何使用 `definePageMeta` 内的 `function` 直接定义，或者设置为匹配 `app/middleware/` 目录中中间件文件名的 `string`：

```vue [app/pages/some-page.vue]
<script setup lang="ts">
definePageMeta({
  // 使用函数定义中间件
  middleware: [
    function (to, from) {
      const auth = useState('auth')

      if (!auth.value.authenticated) {
        return navigateTo('/login')
      }

      if (to.path !== '/checkout') {
        return navigateTo('/checkout')
      }
    },
  ],

  // ... 或者一个字符串
  middleware: 'auth',

  // ... 或者多个字符串
  middleware: ['auth', 'another-named-middleware'],
})
</script>
```

### 使用自定义正则表达式

自定义正则表达式是解决重叠路由之间冲突的好方法，例如：

两个路由 "/test-category" 和 "/1234-post" 都同时匹配 `[postId]-[postSlug].vue` 和 `[categorySlug].vue` 页面路由。

为了确保我们只在 `[postId]-[postSlug]` 路由中匹配数字（`\d+`），我们可以在 `[postId]-[postSlug].vue` 页面模板中添加以下内容：

```vue [app/pages/[postId\\]-[postSlug\\].vue]
<script setup lang="ts">
definePageMeta({
  path: '/:postId(\\d+)-:postSlug',
})
</script>
```

更多示例参见 [Vue Router 的匹配语法](https://router.vuejs.org/guide/essentials/route-matching-syntax)。

### 定义布局

你可以定义（默认情况下）匹配 [`app/layouts/` 目录](/docs/directory-structure/app/layouts) 中布局文件名的布局。你也可以通过将 `layout` 设为 `false` 来禁用布局：

```vue [app/pages/some-page.vue]
<script setup lang="ts">
definePageMeta({
  // 设置自定义布局
  layout: 'admin',

  // ... 或者禁用默认布局
  layout: false,
})
</script>
```

### 向布局传递 Props

你可以使用 `layout` 的对象语法向布局传递 props。如果你的布局用 `defineProps` 定义 props，这些 props 会被完全类型化。

:code-group

```vue [app/pages/dashboard.vue]
<script setup lang="ts">
definePageMeta({
  layout: {
    name: 'panel',
    props: {
      sidebar: true,
      title: 'Dashboard',
    },
  },
})
</script>
```

```vue [app/layouts/panel.vue]
<script setup lang="ts">
const props = defineProps<{
  sidebar?: boolean
  title?: string
}>()
</script>

<template>
  <div>
    <aside v-if="sidebar">
      Sidebar
    </aside>
    <main>
      <h1>{{ title }}</h1>
      <slot />
    </main>
  </div>
</template>
```

:

:tip
通过 `definePageMeta` 设置的布局 props 是基于布局的 `defineProps` 完全类型化的。你会在编辑器中获得自动补全和类型检查。
:

:read-more{to="/docs/directory-structure/app/layouts#passing-props-to-layouts"}

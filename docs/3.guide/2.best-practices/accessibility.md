---
navigation.title: '无障碍'
title: Nuxt 无障碍
description: Nuxt 应用中无障碍（accessibility）的最佳实践。
---

让一个应用具备无障碍能力的要素，大多并不专属于 Nuxt：颜色对比、表单语义和 ARIA 在这里与在任何 Vue 或纯 HTML 应用中都是一样的，本指南末尾的[资源](#有用的资源)对这些有很好的覆盖。

Nuxt 真正改变的是导航。一旦你的应用完成水合，它就运行在客户端路由之上，于是文档不会再被重新加载，浏览器也不会替你播报一个新页面或重置焦点。Nuxt 内置了一些特性来填补其中的部分空缺，另外几条约定则覆盖了剩下的部分。本指南概述了处理这些问题的最佳实践。

:::tip
[`@nuxt/a11y`](https://github.com/nuxt/a11y) 可以在你开发时就把组件中的无障碍问题呈现出来，可与下面的实践一起使用。它仍处于 alpha 阶段，因此请预期它的 API 会变化。
:::

## 路由播报

屏幕阅读器会自行播报一次完整的页面加载，但它们无法得知发生过一次客户端导航。[`<NuxtRouteAnnouncer>`](/docs/api/components/nuxt-route-announcer) 解决了这个问题：它渲染一个隐藏的 live region，并在每次导航之后把新的页面标题写入其中：

```vue [app.vue]
<template>
  <NuxtRouteAnnouncer />
  <NuxtPage />
</template>
```

播报器读取的是 Unhead 渲染出的标题，所以它的有用程度取决于你的标题写得多好。如果两个路由共享同一个 `<title>`，用户在它们之间切换时什么都听不到。

当你需要播报别的内容，或需要改变播报的紧急程度时，请使用 [`useRouteAnnouncer`](/docs/api/composables/use-route-announcer)：

```vue [app/pages/search.vue]
<script setup lang="ts">
const { set } = useRouteAnnouncer()
const { data: results } = await useFetch('/api/search')

watch(results, (results) => {
  set(`${results?.length ?? 0} results found`)
})
</script>
```

:read-more{title="NuxtRouteAnnouncer" to="/docs/api/components/nuxt-route-announcer"}

对于那些并非导航的页面内更新，例如表单校验或 toast，请改用 [`<NuxtAnnouncer>`](/docs/api/components/nuxt-announcer) 配合 [`useAnnouncer`](/docs/api/composables/use-announcer)。

## 页面标题

由于路由播报器跟随文档标题，为每个路由给出一个有区分度的标题是你能做的最有价值的一件事。在 `app.vue` 中设置一个全局模板，再让每个页面填入自己的那部分：

```vue [app.vue]
<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} - Nuxt` : 'Nuxt',
})
</script>
```

```vue [app/pages/about.vue]
<script setup lang="ts">
useHead({
  title: 'About us',
})
</script>
```

如果你的标题来自路由元数据而不是页面本身，你可以在布局中通过 [`useRoute`](/docs/api/composables/use-route) 读取 [`definePageMeta`](/docs/directory-structure/app/pages#page-metadata) 的值。

:read-more{title="SEO 与 Meta" to="/docs/getting-started/seo-meta#dynamic-title"}

## 链接

对应用内导航请使用 [`<NuxtLink>`](/docs/api/components/nuxt-link)。它会渲染一个真正的 `<a href="...">`，这意味着它可以被聚焦、出现在 Tab 顺序中，并且能与中键点击和「在新标签页中打开」配合使用——如果你在一个 `<div>` 上用 `@click` 处理函数调用 `navigateTo`，这些都还得自己重新实现。

```vue
<template>
  <NuxtLink to="/about">About page</NuxtLink>
</template>
```

在菜单或一组面包屑中，与当前路由匹配的那个链接已经暴露了 `aria-current="page"`，因此辅助技术能够知道你正处在哪个项目上。当另一个语义更能描述这种关系时（例如多步表单中的一个步骤），请设置 [`ariaCurrentValue`](/docs/api/components/nuxt-link#routerlink)：

```vue
<template>
  <NuxtLink
    to="/checkout/payment"
    aria-current-value="step"
  >Payment</NuxtLink>
</template>
```

Vue Router 依据路由及其 params 来决定哪个链接匹配，而[不看 query](https://router.vuejs.org/guide/essentials/active-links.html)，因此一个仅因 query 不同而与当前页面有别的链接也会被标记为当前页：一组筛选器，或一列 `?edit=<id>` 的行，都会同时播报「当前页」。一组之中只应有一个元素是 current，所以请给这类链接一个属于自己的 `aria-current`。它的优先级高于路由器给出的值，而 `undefined` 会移除该属性：

```vue
<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <NuxtLink
    :to="{ query: { status: 'open' } }"
    :aria-current="route.query.status === 'open' ? 'true' : undefined"
  >Open</NuxtLink>
</template>
```

如果这些链接是在同一个页面的多个面板之间切换，那么[标签页模式（tabs pattern）](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)配合 `role="tab"` 和 `aria-selected` 可能比 `aria-current` 更合适。

指向你 `public/` 目录中文件的链接，或指向同源另一个应用的链接，都不是 Vue Router 所知悉的路由。请把它们标记为 [`external`](/docs/api/components/nuxt-link#handling-static-file-and-cross-app-links)，让浏览器执行一次真正的导航，而不是匹配不到路由。

:read-more{title="NuxtLink" to="/docs/api/components/nuxt-link"}

## 焦点管理

在客户端导航之后，焦点会停留在原来的位置，而那里通常正是用户刚点下的那个链接。Vue Router 不会移动它，Nuxt 也不会，于是使用键盘的用户可能又要 Tab 过整个页头，才能到达刚刚变化了的内容。

把跳过链接（skip link）作为应用的第一个 Tab 停靠点是常规解决办法，它在初始页面加载时同样有帮助：

```vue [app.vue]
<template>
  <a
    class="skip-link"
    href="#main"
  >Skip to main content</a>
  <AppHeader />
  <main id="main">
    <NuxtPage />
  </main>
</template>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  position: static;
}
</style>
```

跟随一个指向 `#main` 的链接会把浏览器的顺序焦点导航起点移动到 `<main>`，即使 `<main>` 本身不可聚焦。因此在当前的浏览器中，下一次按 <kbd>Tab</kbd> 会移动到该起点之后第一个可聚焦元素：如果 `<main>` 内部包含可聚焦元素就落在它里面，否则越过它。

如果你的应用合适，你还可以更进一步，用一个插件在导航改变路径时把焦点移到主内容区。脚本只有在 `<main>` 带有 `tabindex="-1"` 时才能聚焦它。请使用 `-1` 而不是一个正数值，正数值会改变该元素在 Tab 顺序中的位置，让其它人都感到意外：

```vue [app.vue]
<template>
  <!-- ... -->
  <main
    id="main"
    tabindex="-1"
  >
    <NuxtPage />
  </main>
</template>
```

只改变 query 或 hash 的导航，例如筛选链接或跳过链接本身，会把焦点留在原地：

```ts [app/plugins/focus-main.client.ts]
export default defineNuxtPlugin(() => {
  useRouter().afterEach((to, from) => {
    if (to.path === from.path) {
      return
    }
    nextTick(() => document.getElementById('main')?.focus())
  })
})
```

:::note
带有 `tabindex="-1"` 时，在 `<main>` 内点击一个并不位于其它可聚焦元素之中的内容，可能会把焦点交给 `<main>` 本身，因为浏览器会聚焦被点击元素最近的可聚焦祖先。如果你的应用会把焦点交还给先前聚焦的元素（例如关闭对话框时），请把这一点考虑进去。
:::

:::tip
只用键盘在你的应用里四处导航。几次导航之后，从跳过链接一路 Tab 进入 `<main>`，很快就能暴露出大多数焦点问题。
:::

## 滚动行为

Nuxt 会在进入新路由时滚动到顶部，在用户后退时恢复先前的位置，并滚动到 hash 目标。如果你需要别的行为，例如平滑滚动或不同的偏移量，请配置 [`scrollBehaviorType`](/docs/guide/recipes/custom-routing#scroll-behavior-for-hash-links)，或在 [`router.options.ts`](/docs/guide/recipes/custom-routing#router-options) 中编写你自己的 `scrollBehavior`。请注意，平滑滚动应当尊重用户的 `prefers-reduced-motion` 设置。

:read-more{title="自定义路由" to="/docs/guide/recipes/custom-routing"}

## 有用的资源

- [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/)
- [MDN：Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)

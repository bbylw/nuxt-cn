---
title: "useRouter"
description: "useRouter 组合式函数返回 router 实例。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/router.ts
    size: xs
---

```vue [app/pages/index.vue]
<script setup lang="ts">
const router = useRouter()
</script>
```

如果你只需要在模板内使用 router 实例，使用 `$router`：

```vue [app/pages/index.vue]
<template>
  <button @click="$router.back()">
    Back
  </button>
</template>
```

如果你有 `app/pages/` 目录，`useRouter` 的行为与 `vue-router` 提供的相同。

:read-more{icon="i-simple-icons-vuedotjs" to="https://router.vuejs.org/api/interfaces/router#Properties-currentRoute-" target="_blank"}
阅读 `vue-router` 关于 `Router` 接口的文档。
:

## 基础操作

- [`addRoute()`](https://router.vuejs.org/api/interfaces/router#addRoute-)：向 router 实例添加新路由。`parentName` 可用于将新路由作为现有路由的子路由添加。
- [`removeRoute()`](https://router.vuejs.org/api/interfaces/router#removeRoute-)：按名称移除现有路由。
- [`getRoutes()`](https://router.vuejs.org/api/interfaces/router#getRoutes-)：获取所有路由记录的完整列表。
- [`hasRoute()`](https://router.vuejs.org/api/interfaces/router#hasRoute-)：检查是否存在给定名称的路由。
- [`resolve()`](https://router.vuejs.org/api/interfaces/router#resolve-)：返回路由位置的规范化版本。还包括一个包含任何已有 base 的 `href` 属性。

```ts [Example]
const router = useRouter()

router.addRoute({ name: 'home', path: '/home', component: Home })
router.removeRoute('home')
router.getRoutes()
router.hasRoute('home')
router.resolve({ name: 'home' })
```

:note
`router.addRoute()` 将路由详情添加到一个路由数组中，在构建 [Nuxt 插件](/docs/directory-structure/app/plugins) 时很有用；而 `router.push()` 另一方面会立即触发新的导航，在页面、Vue 组件和组合式函数中很有用。
:

## 基于 History API

- [`back()`](https://router.vuejs.org/api/interfaces/router#back-)：如果可能则后退历史，等同于 `router.go(-1)`。
- [`forward()`](https://router.vuejs.org/api/interfaces/router#forward-)：如果可能则前进历史，等同于 `router.go(1)`。
- [`go()`](https://router.vuejs.org/api/interfaces/router#go-)：在 history 中前后移动，不受 `router.back()` 和 `router.forward()` 所施加的层级限制约束。
- [`push()`](https://router.vuejs.org/api/interfaces/router#push-)：通过向 history 栈推入一个条目以编程方式导航到新 URL。**建议使用 [`navigateTo`](/docs/api/utils/navigate-to) 代替。**
- [`replace()`](https://router.vuejs.org/api/interfaces/router#replace-)：通过替换 history 栈中的当前条目以编程方式导航到新 URL。**建议使用 [`navigateTo`](/docs/api/utils/navigate-to) 代替。**

```ts [Example]
const router = useRouter()

router.back()
router.forward()
router.go(3)
router.push({ path: '/home' })
router.replace({ hash: '#bio' })
```

:read-more{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/API/History" target="_blank"}
阅读更多关于浏览器 History API 的内容。
:

## 导航守卫

`useRouter` 组合式函数提供了 `afterEach`、`beforeEach` 和 `beforeResolve` 辅助方法，用作导航守卫。

不过，Nuxt 有**路由中间件**的概念，简化了导航守卫的实现并提供了更好的开发者体验。

:read-more{to="/docs/directory-structure/app/middleware"}

## Promise 与错误处理

- [`isReady()`](https://router.vuejs.org/api/interfaces/router#isReady-)：返回一个在 router 完成初始导航时 resolve 的 Promise。
- [`onError`](https://router.vuejs.org/api/interfaces/router#onError-)：添加一个错误处理程序，在导航期间每次发生未被捕获的错误时调用。

:read-more{icon="i-simple-icons-vuedotjs" to="https://router.vuejs.org/api/interfaces/router#Methods-" title="Vue Router Docs" target="_blank"}

## 通用 Router 实例

如果你没有 `app/pages/` 文件夹，那么 [`useRouter`](/docs/api/composables/use-router) 将返回一个带有类似辅助方法的通用 router 实例，但请注意并非所有功能都受支持或与 `vue-router` 的行为完全一致。

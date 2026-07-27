---
title: 'Module Author Guide'
titleTemplate: '%s'
description: '学习如何创建 Nuxt 模块，以集成、增强或扩展任意 Nuxt 应用。'
navigation: false
surround: false
---

Nuxt 的[配置](/docs/api/nuxt-config)与[钩子](/docs/guide/going-further/hooks)系统使得自定义 Nuxt 的方方面面、并添加你可能需要的任何集成（Vue 插件、CMS、服务端路由、组件、日志等）成为可能。

**Nuxt 模块**是在使用 `nuxt dev` 以开发模式启动 Nuxt，或使用 `nuxt build` 为生产构建项目时，按顺序运行的函数。借助模块，你可以将自定义方案封装、充分测试并作为 npm 包共享，而无需向项目中添加不必要的样板代码，也无需修改 Nuxt 本身。

:::card-group{class="sm:grid-cols-1"}
  ::card{icon="i-lucide-rocket" title="Create Your First Module" to="/docs/guide/modules/getting-started"}
  学习如何使用官方启动模板创建你的第一个 Nuxt 模块。
  ::
  ::card{icon="i-lucide-box" title="Understand Module Structure" to="/docs/guide/modules/module-anatomy"}
  学习 Nuxt 模块是如何构成的，以及如何定义它们。
  ::
  ::card{icon="i-lucide-code" title="Add Plugins, Components & More" to="/docs/guide/modules/recipes-basics"}
  学习如何从你的模块注入插件、组件、组合式函数和服务端路由。
  ::
  ::card{icon="i-lucide-link" title="Depend on Other Modules" to="/docs/guide/modules/module-dependencies"}
  声明对其它模块的依赖，并带有版本约束和配置合并。
  ::
  ::card{icon="i-lucide-layers" title="Use Hooks & Extend Types" to="/docs/guide/modules/recipes-advanced"}
  在你的模块中掌握生命周期钩子、虚拟文件和 TypeScript 声明。
  ::
  ::card{icon="i-lucide-test-tube" title="Test Your Module" to="/docs/guide/modules/testing"}
  学习如何对你的 Nuxt 模块进行单元、集成和 E2E 测试。
  ::
  ::card{icon="i-lucide-medal" title="Follow Best Practices" to="/docs/guide/modules/best-practices"}
  使用这些指南构建高性能且可维护的 Nuxt 模块。
  ::
  ::card{icon="i-lucide-globe" title="Publish & Share Your Module" to="/docs/guide/modules/ecosystem"}
  加入 Nuxt 模块生态，并将你的模块发布到 npm。
  ::
:::

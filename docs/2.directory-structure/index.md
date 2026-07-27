---
title: 'Nuxt 目录结构'
description: '了解 Nuxt 应用的目录结构以及如何使用它。'
navigation: false
---

Nuxt 应用有一套特定的目录结构，用于组织代码。这套结构旨在易于理解，并以一致的方式使用。

## 根目录

Nuxt 应用的根目录是包含 `nuxt.config.ts` 文件的目录。该文件用于配置 Nuxt 应用。

## App 目录

`app/` 目录是 Nuxt 应用的主目录。它包含以下子目录：

- [`assets/`](/docs/directory-structure/app/assets)：网站资源，由构建工具（Vite 或 webpack）处理
- [`components/`](/docs/directory-structure/app/components)：应用的 Vue 组件
- [`composables/`](/docs/directory-structure/app/composables)：添加你的 Vue 组合式函数
- [`layouts/`](/docs/directory-structure/app/layouts)：包裹页面的 Vue 组件，避免在页面间重新渲染
- [`middleware/`](/docs/directory-structure/app/middleware)：在导航到特定路由前运行代码
- [`pages/`](/docs/directory-structure/app/pages)：基于文件的路由，用于在 Web 应用中创建路由
- [`plugins/`](/docs/directory-structure/app/plugins)：在创建 Nuxt 应用时使用 Vue 插件等
- [`utils/`](/docs/directory-structure/app/utils)：添加可在组件、组合式函数和页面中使用的函数

该目录还包含以下特定文件：

- [`app.config.ts`](/docs/directory-structure/app/app-config)：应用内的响应式配置
- [`app.vue`](/docs/directory-structure/app/app)：Nuxt 应用的根组件
- [`error.vue`](/docs/directory-structure/app/error)：Nuxt 应用的错误页面

## Public 目录

[`public/`](/docs/directory-structure/public) 目录包含 Nuxt 应用的公共文件。该目录中的文件会在根路径下提供，且不会被构建流程修改。

这适合那些需要保持文件名不变（如 `robots.txt`）_或_ 不太可能变更（如 `favicon.ico`）的文件。

## Server 目录

[`server/`](/docs/directory-structure/server) 目录包含 Nuxt 应用的服务端代码。它包含以下子目录：

- [`api/`](/docs/directory-structure/server#server-routes)：包含应用的 API 路由
- [`routes/`](/docs/directory-structure/server#server-routes)：包含服务端路由（如动态的 `/sitemap.xml`）
- [`middleware/`](/docs/directory-structure/server#server-middleware)：在服务端路由被处理前运行代码
- [`plugins/`](/docs/directory-structure/server#server-plugins)：在创建 Nuxt 服务端时使用插件等
- [`utils/`](/docs/directory-structure/server#server-utilities)：添加可在服务端代码中使用的函数

## Shared 目录

[`shared/`](/docs/directory-structure/shared) 目录包含 Nuxt 应用与服务端共享的代码。该代码可在 Vue 应用和 Nitro 服务端中同时使用。

## Content 目录

[`content/`](/docs/directory-structure/content) 目录由 [Nuxt Content](https://content.nuxt.com) 模块启用。它使用 Markdown 文件为你的应用创建一个基于文件的 CMS。

## Modules 目录

[`modules/`](/docs/directory-structure/modules) 目录包含 Nuxt 应用的本地模块。模块用于扩展 Nuxt 应用的功能。

## Layers 目录

[`layers/`](/docs/directory-structure/layers) 目录允许你组织和共享可复用的代码、组件、组合式函数和配置。该目录中的 Layers 会在项目中自动注册。

## Nuxt 文件

- [`nuxt.config.ts`](/docs/directory-structure/nuxt-config) 文件是 Nuxt 应用的主配置文件
- [`.nuxtrc`](/docs/directory-structure/nuxtrc) 文件是配置 Nuxt 应用的另一种语法（适合全局配置）
- [`.nuxtignore`](/docs/directory-structure/nuxtignore) 文件用于在构建阶段忽略根目录中的文件

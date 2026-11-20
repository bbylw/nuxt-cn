<a href="https://nuxt.com"><img width="830" height="213" src="https://raw.githubusercontent.com/nuxt/nuxt/main/.github/assets/banner.svg" alt="Nuxt 横幅"></a>

# Nuxt

<p>
  <a href="https://npmx.dev/package/nuxt"><img src="https://npmx.dev/api/registry/badge/version/nuxt" alt="版本"></a>
  <a href="https://npmx.dev/package/nuxt"><img src="https://npmx.dev/api/registry/badge/downloads/nuxt" alt="下载量"></a>
  <a href="https://github.com/nuxt/nuxt/blob/main/LICENSE"><img src="https://img.shields.io/github/license/nuxt/nuxt.svg?style=flat&colorA=18181B&colorB=28CF8D" alt="许可证"></a>
  <a href="https://nuxt.com/modules"><img src="https://img.shields.io/badge/dynamic/json?url=https://nuxt.com/api/v1/modules&query=$.stats.modules&label=Modules&style=flat&colorA=18181B&colorB=28CF8D" alt="模块"></a>
  <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt%20Docs-18181B?logo=nuxt" alt="网站"></a>
  <a href="https://chat.nuxt.dev"><img src="https://img.shields.io/badge/Nuxt%20Discord-18181B?logo=discord" alt="Discord"></a>
  <a href="https://securityscorecards.dev/viewer/?uri=github.com/nuxt/nuxt"><img src="https://api.securityscorecards.dev/projects/github.com/nuxt/nuxt/badge" alt="Nuxt openssf 评分卡分数"></a>
  <a href="https://deepwiki.com/nuxt/nuxt"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

Nuxt 是一个免费且开源的框架，以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。

它提供了一系列特性，让你能够轻松构建快速、对 SEO 友好且可扩展的 Web 应用，包括：
- 服务端渲染、静态站点生成、混合渲染以及边缘端渲染
- 自动路由，并带有代码分割与预取
- 数据获取与状态管理
- 搜索引擎优化与 meta 标签定义
- 组件、组合式函数（composables）和工具函数（utils）的自动导入
- 零配置的 TypeScript 支持
- 通过 `server/` 目录实现全栈能力
- 可通过 [300+ 个模块](https://nuxt.com/modules) 进行扩展
- 可部署到多种[托管平台](https://nuxt.com/deploy)
- ……[以及更多](https://nuxt.com) 🚀

### 目录

- 🚀 [快速开始](#getting-started)
- 💻 [Vue 开发](#vue-development)
- 📖 [文档](#documentation)
- 🧩 [模块](#modules)
- ❤️ [参与贡献](#contribute)
- 🏠 [本地开发](#local-development)
- 🛟 [专业支持](#professional-support)
- 🔗 [关注我们](#follow-us)
- ⚖️ [许可证](#license)

---

## <a name="getting-started">🚀 快速开始</a>

使用以下命令创建一个新的起始项目。该命令会创建一个包含全部必要文件和依赖的起始项目：

```bash
npm create nuxt@latest <my-project>
```

> [!TIP]
> 也可以了解一下 [nuxt.new](https://nuxt.new)：在 CodeSandbox、StackBlitz 或本地打开一个 Nuxt 起始项目，几秒钟即可跑起来。

## <a name="vue-development">💻 Vue 开发</a>

简单、直观且强大，Nuxt 让你以一种合乎直觉的方式编写 Vue 组件。每一个重复性的工作都已自动化，因此你可以安心地专注于编写自己的全栈 Vue 应用。

`app.vue` 示例：

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Meet Nuxt',
  description: 'The Intuitive Vue Framework.',
})
</script>

<template>
  <div id="app">
    <AppHeader />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<style scoped>
#app {
  background-color: #020420;
  color: #00DC82;
}
</style>
```

## <a name="documentation">📖 文档</a>

我们强烈建议你查阅 [Nuxt 文档](https://nuxt.com/docs) 来提升技能。它是学习该框架的绝佳资源，内容涵盖从入门到高级主题的一切。

本仓库是 Nuxt 官方文档的中文翻译站（[nuxt.ndjp.net](https://nuxt.ndjp.net)）：

- `docs/` —— 与上游 [nuxt/nuxt](https://github.com/nuxt/nuxt/tree/main/docs) 保持同步的中文文档（CLI 命令部分同步自 [nuxt/cli](https://github.com/nuxt/cli/tree/main/docs)）
- `site/` —— 基于 [Fumadocs](https://fumadocs.dev)（Next.js）的文档站，静态导出，支持中文全文搜索

本地运行文档站：

```bash
cd site
pnpm install
pnpm dev      # 开发模式 http://localhost:3000
pnpm build    # 静态导出到 site/out/
```

## <a name="modules">🧩 模块</a>

浏览我们的[模块列表](https://nuxt.com/modules)，由 Nuxt 团队与社区打造，为你的 Nuxt 项目注入超能力。

## <a name="contribute">❤️ 参与贡献</a>

我们邀请你参与贡献，共同改进 Nuxt 💚

你可以通过以下几种方式加入我们：
- **报告 Bug：** 如果你遇到任何 bug 或问题，请查阅[报告 Bug 指南](https://nuxt.com/docs/4.x/community/reporting-bugs)，了解如何提交 bug 报告。
- **提出建议：** 有改进 Nuxt 的想法？我们很乐意倾听！查阅[贡献指南](https://nuxt.com/docs/4.x/community/contribution)来分享你的建议。
- **提出问题：** 如果你有疑问或需要帮助，[获取帮助指南](https://nuxt.com/docs/4.x/community/getting-help)提供了相关资源来协助你。

## <a name="local-development">🏠 本地开发</a>

按照文档[搭建本地开发环境](https://nuxt.com/docs/4.x/community/framework-contribution#setup)，为框架和文档做出贡献。

## <a name="professional-support">🛟 专业支持</a>

- 技术审计与咨询：[Nuxt Experts](https://nuxt.com/enterprise/support)
- 定制开发及更多：[Nuxt 代理商合作伙伴](https://nuxt.com/enterprise/agencies)

## <a name="follow-us">🔗 关注我们</a>

<p valign="center">
  <a href="https://go.nuxt.com/discord"><img width="20" src="https://raw.githubusercontent.com/nuxt/nuxt/main/.github/assets/discord.svg" alt="Discord"></a>&nbsp;&nbsp;<a href="https://go.nuxt.com/x"><img width="20" src="https://raw.githubusercontent.com/nuxt/nuxt/main/.github/assets/twitter.svg" alt="Twitter"></a>&nbsp;&nbsp;<a href="https://go.nuxt.com/github"><img width="20" src="https://raw.githubusercontent.com/nuxt/nuxt/main/.github/assets/github.svg" alt="GitHub"></a>&nbsp;&nbsp;<a href="https://go.nuxt.com/bluesky"><img width="20" src="https://raw.githubusercontent.com/nuxt/nuxt/main/.github/assets/bluesky.svg" alt="Bluesky"></a>
</p>

## <a name="license">⚖️ 许可证</a>

[MIT](https://github.com/nuxt/nuxt/blob/main/LICENSE)

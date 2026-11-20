---
navigation.title: 'Nuxt 性能'
title: 'Nuxt 性能'
description: 提升 Nuxt 应用性能的最佳实践。
---

Nuxt 内置了旨在提升应用性能、并有助于改善 [Core Web Vitals](https://web.dev/articles/vitals) 的特性。此外还有多个 Nuxt 核心模块，可协助在特定领域提升性能。本指南概述了优化 Nuxt 应用性能的最佳实践。

## 内置特性

Nuxt 提供了若干内置特性来帮助你优化网站性能。理解这些特性的运作方式，对于获得极速性能至关重要。

### 链接

[`<NuxtLink>`](/docs/api/components/nuxt-link) 是 Vue Router 的 `<RouterLink>` 组件和 HTML `<a>` 标签的即插即用替代品。它会智能判断链接是内部还是外部，并据此渲染，附带可用优化（预取、默认属性等）。

```html
<template>
  <NuxtLink to="/about">关于页</NuxtLink>
</template>

<!-- 结合 Vue Router 与智能预取后，会渲染为 -->
<a href="/about">关于页</a>
```

Nuxt 会自动包含智能预取。这意味着它能检测链接何时可见（默认如此），无论是在视口中还是滚动时，并预取这些页面的 JavaScript，以便在用户点击链接时已准备就绪。

你也可以改为在交互时预取：

```ts
export default defineNuxtConfig({
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
          visibility: false,
        },
      },
    },
  },
})
```

:read-more{title="NuxtLink" to="/docs/api/components/nuxt-link"}

### 资源提示（Resource Hints）

为了加速客户端导航，Nuxt 会为某个请求所解析出的 JavaScript 和 CSS 分块（chunk）添加资源提示。`<link rel="preload">`（或 `modulepreload`）标记页面本身需要的分块，而 `<link rel="prefetch">` 标记入口文件与已渲染组件懒加载导入的分块，这样当用户之后导航到它们时这些资源已经完成预热。

预加载提示在 HTML 被解析后立即生效。预取提示渲染在一个 `<template>` 元素内部，因此浏览器会忽略它们，直到应用准备就绪后 Nuxt 才将其激活（参见 [`onNuxtReady`](/docs/api/utils/on-nuxt-ready)）。它们也不会被包含进 `Link` 响应头和 103 Early Hints 中。这样一来，在页面加载时它们就不会与页面自身的资源争抢带宽。你可以通过 [`experimental.deferPrefetchHints`](/docs/guide/going-further/experimental-features#deferprefetchhints) 关闭这一行为。在开启了流量节省（data saver）的连接上，或者在 2G 连接上，它们根本不会被激活。使用 [`noScripts`](/docs/guide/going-further/features#noscripts) 服务的路由没有客户端去激活它们，因此其非脚本类的预取提示不会被延迟。

在一个大型应用中，被预取的集合可能增长到超出页面实际所需的范围。公开页面和登录后的应用往往共享同一个入口分块，因此预渲染的公开页面可能会去预取只有登录后应用才使用的分块，把带宽花在了访客永远不会加载的分块上。

要阻止某个分块被预取，可以在 [`build:manifest`](/docs/api/advanced/hooks#nuxt-hooks-build-time) 钩子中把该分块 manifest 条目的 `prefetch` 设为 `false`：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  hooks: {
    'build:manifest': (manifest) => {
      for (const chunk of Object.values(manifest)) {
        if (chunk.src?.startsWith('pages/app/')) {
          chunk.prefetch = false
        }
      }
    },
  },
})
```

这会为所有源文件位于 `pages/app/` 之下的分块移除 `rel="prefetch"` 提示，同时把分块保留在包中，并让 `preload` 和 `modulepreload` 提示保持不变。请调整 `startsWith` 前缀，指向你的公开页面不应该预取其分块的目录。

你也可以在自己的代码中使用 [`preloadComponents`](/docs/api/utils/preload-components)、[`preloadRouteComponents`](/docs/api/utils/preload-route-components) 和 [`prefetchComponents`](/docs/api/utils/prefetch-components) 来预加载特定的组件或路由。

### 混合渲染

在更复杂的应用中，我们可能需要完全控制应用的渲染方式，以支持某些页面在构建时生成、而另一些应客户端渲染的情况。

混合渲染允许通过路由规则为每条路由设置不同的缓存规则，并决定服务器应如何响应给定 URL 上的新请求：

```ts
export default defineNuxtConfig({
  routeRules: {
    '/': {
      prerender: true,
    },
    '/products/**': {
      swr: 3600,
    },
    '/blog': {
      isr: 3600,
    },
    '/admin/**': {
      ssr: false,
    },
  },
})
```

Nuxt 服务器会自动注册相应的中间件，并使用 Nitro 缓存层将路由包裹在缓存处理器中。

:read-more{title="混合渲染" to="/docs/guide/concepts/rendering#hybrid-rendering"}

### 懒加载组件

要动态导入一个组件（也称为懒加载组件），你只需在组件名称前加上 `Lazy` 前缀。这在组件并非总是需要时特别有用。

```html
<script setup lang="ts">
const show = ref(false)
</script>

<template>
  <div>
    <h1>Mountains</h1>
    <LazyMountainsList v-if="show" />
    <button v-if="!show" @click="show = true">Show List</button>
  </div>
</template>
```

通过使用 `Lazy` 前缀，你可以将组件代码的加载推迟到合适的时机，这有助于优化你的 JavaScript 包体积。

:read-more{title="懒加载组件" to="/docs/directory-structure/app/components#dynamic-imports"}

### 延迟水合

在首次加载时，并不总需要水合（或使可交互）你网站的所有组件。使用延迟水合，你可以控制组件何时加载其代码，从而改善应用的交互时间指标。Nuxt 允许你通过延迟水合控制组件何时变得可交互（在 Nuxt v3.16 中加入）。

```html
<template>
  <div>
    <LazyMyComponent hydrate-on-visible />
  </div>
</template>
```

为了优化你的应用，你可能希望将某些组件的水合推迟到它们可见时，或者推迟到浏览器完成更重要的任务之后。

:read-more{title="延迟水合" to="/docs/directory-structure/app/components#delayed-or-lazy-hydration"}

对于几乎不需要或完全不需要客户端交互的内容型网站和营销网站，你可以更进一步：结合预渲染、`noScripts` 路由规则、[服务端组件](/docs/guide/concepts/server-components) 以及延迟水合，交付接近零 JavaScript 的页面。

:read-more{title="近乎静态的网站" to="/docs/guide/recipes/mostly-static-sites"}

### 获取数据

为了避免重复获取同一份数据（一次在服务端、一次在客户端），Nuxt 提供了 [`useFetch`](/docs/api/composables/use-fetch) 和 [`useAsyncData`](/docs/api/composables/use-async-data)。它们确保如果 API 调用在服务端发起，数据会通过 payload 转发给客户端，而不是再次获取。

:read-more{title="数据获取" to="/docs/getting-started/data-fetching"}

## Nuxt 核心模块

除了 Nuxt 的内置特性外，Nuxt 团队还维护着一些核心模块，可进一步帮助提升性能。这些模块帮助处理图片、自定义字体或第三方脚本等资源。

### 图片

未经优化的图片会对你的网站性能产生显著的负面影响，尤其是 [Largest Contentful Paint (LCP)](https://web.dev/articles/lcp) 分数。

在 Nuxt 中，我们可以使用 [Nuxt Image](https://image.nuxt.com/) 模块，它是为 Nuxt 应用提供的即插即用图片优化方案。它允许使用内置优化器或你喜欢的图片 CDN 来调整大小并转换你的图片。

:video-accordion{title="观看 LearnVue 关于 Nuxt Image 的视频" videoId="_UBff2eqGY0"}

[`<NuxtImg>`](/docs/api/components/nuxt-img) 是原生 `<img>` 标签的即插即用替代品，带来以下增强：

* 使用内置 provider 优化本地和远程图片
* 使用 WebP 或 Avif 等现代格式将 `src` 转换为 provider 优化过的 URL
* 根据 `width` 和 `height` 自动调整图片尺寸
* 提供 sizes 选项时生成响应式 `sizes`
* 支持原生 `lazy loading` 以及其他 `<img>` 属性

你网站中的图片通常可以按重要性区分：那些需要在初始加载时尽快交付的（即 `Largest Contentful Paint`），以及那些可以稍后或在特定需要时加载的。为此，我们可以使用以下优化：

```html
<template>
  <!-- 🚨 需要尽快加载 -->
  <NuxtImg
    src="/hero-banner.jpg"
    format="webp"
    :preload="{ fetchPriority: 'high' }"
    loading="eager"
    width="200"
    height="100"
  />

  <!-- 🐌 可以稍后加载 -->
  <NuxtImg
    src="/facebook-logo.jpg"
    format="webp"
    loading="lazy"
    fetchpriority="low"
    width="200"
    height="100"
  />
</template>
```

:read-more{title="Nuxt Image" to="https://image.nuxt.com/usage/nuxt-img"}

### 字体

[Nuxt Fonts](https://fonts.nuxt.com/) 会自动优化你的字体（包括自定义字体），并移除外部网络请求，以提升隐私和性能。

它包括对任何字体文件的内置自动自托管，这意味着你可以以最优方式加载 Web 字体，并借助底层包 [fontaine](https://github.com/unjs/fontaine) 减少布局偏移。

:video-accordion{title="观看 Daniel Roe 关于 Nuxt Fonts 背后理念的演讲" videoId="D3F683UViBY"}

Nuxt Fonts 会处理你所有的 CSS，并在遇到 font-family 声明时自动完成以下事情：

1. **解析字体** – 在 public/ 中查找字体文件，然后检查 Google、Bunny、Fontshare 等 Web 提供商。
2. **生成 @font-face 规则** – 注入 CSS 规则以从正确的来源加载字体。
3. **代理并缓存字体** – 将 URL 重写为 `/_fonts`，下载并在本地缓存字体。
4. **创建回退度量** – 调整本地系统字体以匹配 Web 字体，减少布局偏移（[CLS](https://web.dev/articles/cls)）。
5. **将字体包含进构建** – 将字体与你的项目打包在一起，对文件名进行哈希处理并设置长生命周期缓存头。

它支持多个设计为可插拔、可扩展的 provider，因此无论你的设置如何，都应该能使用现有 provider 或编写自己的 provider。

### 脚本

第三方资源（如分析工具、视频嵌入、地图和社交媒体集成）增强了网站功能，但会显著劣化用户体验，并对 [Interaction to Next Paint (INP)](https://web.dev/articles/inp) 和 Largest Contentful Paint (LCP) 分数产生负面影响。

[Nuxt Scripts](https://scripts.nuxt.com/) 让你以更好的性能、隐私、安全性和开发体验来加载第三方脚本。

:video-accordion{title="观看 Alex Lichter 关于 Nuxt Scripts 的视频" videoId="sjMqUUvH9AE"}

Nuxt Scripts 在第三方脚本之上提供了一个抽象层，提供 SSR 支持和类型安全，同时仍让你完全底层控制脚本的加载方式。

```ts
const { onLoaded, proxy } = useScriptGoogleAnalytics(
  {
    id: 'G-1234567',
    scriptOptions: {
      trigger: 'manual',
    },
  },
)
// 在 ga 加载时排队要发送的事件
proxy.gtag('config', 'UA-123456789-1')
// 或等待 ga 加载完成
onLoaded((gtag) => {
  // 脚本已加载
})
```

:read-more{title="Nuxt Scripts" to="https://scripts.nuxt.com/scripts"}

## 性能分析工具

要提升性能，我们首先需要知道如何衡量它，从在开发阶段（本地环境）衡量性能开始，然后转向审计部署在生产环境中的应用。

### Nuxi Analyze

`nuxt` 的 [这个](/docs/api/commands/analyze) 命令允许你分析 Nuxt 应用的生产包。它利用 `vite-bundle-visualizer`（类似于 `webpack-bundle-analyzer`）来生成应用包的视觉化表示，让你更容易识别哪些组件占据了最多空间。

当你在可视化中看到一个大的色块时，往往意味着一个优化机会——无论是将其拆分为更小的部分、实现懒加载，还是用更高效的替代方案替换它，尤其是对第三方库而言。

包含多个元素的大色块通常可以通过只导入必要的组件而非整个模块来减少，而大的独立色块可能更适合懒加载，而不是包含在主包中。

### Nuxt DevTools

[Nuxt DevTools](https://nuxt.com/modules/devtools) 让你洞察并透明了解你的 Nuxt 应用，以识别性能差距并无缝管理应用配置。

![Nuxt DevTools 示例](https://user-images.githubusercontent.com/11247099/217670806-fb39aeff-3881-44e5-b9c8-6c757f5925fc.png)

它带有几个可用于衡量 Nuxt 应用性能的特性：
1. **时间线（Timeline）** – 追踪渲染、更新和初始化组件所花费的时间，以识别性能瓶颈。
2. **资源（Assets）** – 显示文件大小（如图片）而不进行转换。
3. **渲染树（Render Tree）** – 展示 Vue 组件、脚本和样式之间的连接，以优化动态加载。
4. **检查（Inspect）** – 列出 Vue 应用中使用的所有文件及其大小与求值时间。

### Chrome DevTools

Chrome DevTools 带有两个用于衡量性能的有用标签页：`Performance` 和 `Lighthouse`。

当你打开 [Performance](https://developer.chrome.com/docs/devtools/performance/overview) 面板时，它会立即显示你本地的 **Largest Contentful Paint (LCP)** 和 **Cumulative Layout Shift (CLS)** 分数（好、需改进或差）。

如果你与页面交互，它还会捕获 **Interaction to Next Paint (INP)**，根据设备和网络为你提供 Core Web Vitals 的完整视图。

![Chrome DevTools 性能面板](https://developer.chrome.com/static/docs/devtools/performance/image/cpu-throttling_856.png)

[Lighthouse](https://developer.chrome.com/docs/devtools/lighthouse) 会审计性能、无障碍、SEO、渐进式 Web 应用和最佳实践。它会对你的页面运行测试并生成报告。将未通过的审计作为改进你网站的指南。

![Lighthouse](https://developer.chrome.com/static/docs/lighthouse/images/lighthouse-overview_720.png)

每个审计都有一份参考文档，解释为什么该审计很重要，以及如何修复它。

### PageSpeed Insights

[PageSpeed Insights (PSI)](https://developers.google.com/speed/docs/insights/v5/about) 报告了页面在移动和桌面设备上的用户体验，并提供该页面如何改进的的建议。

它提供了关于页面的实验室数据和现场数据。实验室数据对于调试问题很有用，因为它是在受控环境中收集的；而现场数据对于捕获真实、真实的用户体验很有用。

### Web Page Test

[WebPageTest](https://www.webpagetest.org/) 是一个 Web 性能工具，提供关于页面在各种条件下表现如何的深度诊断信息。

每个测试都可以从全球不同地点、在真实浏览器上、通过任意数量的自定义网络条件运行。

## 常见问题

在构建更复杂的 Nuxt 应用时，你可能会遇到下面列出的一些问题。理解并修复这些问题将帮助你提升网站性能。

### 过度使用插件

**问题**：大量插件会导致性能问题，尤其是当它们需要昂贵的计算或初始化时间过长时。由于插件在水合阶段运行，低效的设置会阻塞渲染并劣化用户体验。

**解决方案**：检查你的插件，看看其中一些是否可以改为用组合式函数或工具函数来实现。

### 未使用的代码 / 依赖

**问题**：随着项目的发展，可能会出现一些未使用的代码或依赖。这些额外的功能可能未被使用或不需要，却会增加我们项目的包体积。

**解决方案**：检查你的 `package.json` 中是否有未使用的依赖，并分析你的代码中是否有未使用的 utils/组合式函数/函数。

### 未使用 Vue 性能提示

**问题**：[Vue 文档](https://vuejs.org/guide/best-practices/performance) 列出了我们可以在 Nuxt 项目中使用的若干性能改进，但由于它们属于 Vue 文档，开发者往往忘记它们，只关注 Nuxt 特定的改进——而 Nuxt 应用仍然是一个 Vue 项目。

**解决方案**：使用诸如 `shallowRef`、`v-memo`、`v-once` 等概念来提升性能。

### 未遵循模式

**问题**：当前在项目中工作的人越多，维护稳定代码库就越困难。开发者倾向于引入他们在另一个项目中见过的新概念，这可能导致冲突和性能问题。

**解决方案**：在项目中建立规则和模式，例如 [Vue 组合式函数的良好实践与设计模式](https://dev.to/jacobandrewsky/good-practices-and-design-patterns-for-vue-composables-24lk)。

### 试图同时加载所有内容

**问题**：当一个页面被加载，却没有被正确告知元素的加载顺序时，会导致同时获取所有内容——这可能很慢并导致糟糕的用户体验。

**解决方案**：使用渐进增强（Progressive Enhancement）之类的概念，先设置核心网页内容，然后随着浏览器/互联网连接允许，再叠加更细致、技术上更严谨的呈现和特性层。

## 有用资源

要了解更多关于提升性能的各种技术，请查看以下资源：

1. [使用 PRPL 模式应用即时加载](https://web.dev/articles/apply-instant-loading-with-prpl)
2. [感知性能](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/Perceived_performance)
3. [理解关键渲染路径](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Critical_rendering_path)

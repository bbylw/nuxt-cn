export interface NavLink {
  label: string
  to: string
}

export interface Feature {
  icon: string
  title: string
  desc: string
  span?: 'wide' | 'tall' | 'normal'
}

export interface Step {
  title: string
  desc: string
  code?: { lang: string; content: string }
}

export interface Concept {
  icon: string
  title: string
  desc: string
  href: string
}

export interface DirEntry {
  name: string
  desc: string
  badge?: string
}

export interface ApiItem {
  name: string
  type: string
  desc: string
}

export const siteData = {
  brand: {
    name: 'Nuxt 中文',
    tagline: '直观的 Vue 框架',
    version: 'v4.5',
  },

  nav: [
    { label: '特性', to: '/#features' },
    { label: '快速开始', to: '/#getting-started' },
    { label: '概念', to: '/#concepts' },
    { label: '目录结构', to: '/#directory' },
    { label: 'API', to: '/#api' },
    { label: '文档', to: '/docs' },
  ] as NavLink[],

  hero: {
    badge: 'Nuxt 4.5 已正式发布',
    title: '直观的',
    titleAccent: 'Vue 全栈框架',
    subtitle: '以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用与网站。',
    primaryCta: { label: '快速开始', to: '#getting-started' },
    secondaryCta: { label: '查阅文档', to: 'https://nuxt.com/docs' },
    code: `<span class="text-pink-400">npm</span> create nuxt<span class="text-emerald-400">@latest</span> <span class="text-amber-300">my-app</span>`,
  },

  marquee: [
    '服务端渲染', '静态站点生成', '混合渲染', '边缘端渲染', '自动路由',
    '代码分割', '数据获取', '状态管理', 'SEO 优化', '自动导入',
    'TypeScript', '全栈能力', '300+ 模块', 'Nitro 引擎', '零配置',
  ],

  features: [
    { icon: 'i-lucide-route', title: '基于文件的路由', desc: '根据 app/pages/ 目录结构自动定义路由，组织更清晰，无需手动配置。', span: 'tall' },
    { icon: 'i-lucide-scissors', title: '代码分割', desc: '自动将代码拆分为更小的块，减少应用初始加载时间。' },
    { icon: 'i-lucide-server', title: '服务端渲染', desc: '内置 SSR 能力，无需自己搭建服务器，开箱即用。' },
    { icon: 'i-lucide-sparkles', title: '自动导入', desc: '将 composables 和组件写到对应目录即可直接使用，并享有 tree-shaking 优势。', span: 'wide' },
    { icon: 'i-lucide-database', title: '数据获取工具', desc: '提供 composables 处理兼容 SSR 的数据获取，支持多种策略。' },
    { icon: 'i-lucide-shield-check', title: '零配置 TypeScript', desc: '借助自动生成的类型和 tsconfig.json，无需学习 TypeScript 即可编写类型安全的代码。' },
    { icon: 'i-lucide-zap', title: 'Vite 构建', desc: '默认使用 Vite，开发环境支持热模块替换（HMR），生产环境按最佳实践打包。' },
  ] as Feature[],

  gettingStarted: {
    title: '快速开始',
    subtitle: '几秒钟即可搭建一个 Nuxt 起始项目',
    steps: [
      {
        title: '前置条件',
        desc: '需要 Node.js 22.x 或更新版本（推荐使用活跃 LTS 版本），以及一个文本编辑器与终端。',
      },
      {
        title: '创建新项目',
        desc: '打开终端，使用以下命令创建一个全新的 starter 项目。',
        code: { lang: 'bash', content: 'pnpm create nuxt@latest my-app\ncd my-app' },
      },
      {
        title: '启动开发服务器',
        desc: '以开发模式启动 Nuxt 应用，浏览器会自动打开 http://localhost:3000。',
        code: { lang: 'bash', content: 'pnpm dev -o' },
      },
      {
        title: '构建生产版本',
        desc: '构建用于生产环境的应用，输出到 .output 目录，可部署到任何支持 JavaScript 的系统。',
        code: { lang: 'bash', content: 'pnpm build' },
      },
    ] as Step[],
  },

  concepts: [
    { icon: 'i-lucide-monitor', title: '渲染模式', desc: '支持 SSR、SSG、混合渲染与边缘渲染，灵活应对不同场景。', href: 'rendering' },
    { icon: 'i-lucide-refresh-cw', title: 'Nuxt 生命周期', desc: '从服务端启动到客户端 hydration 的完整生命周期钩子。', href: 'nuxt-lifecycle' },
    { icon: 'i-lucide-package-open', title: '自动导入', desc: 'composables、组件和工具函数按目录约定自动导入，无需手动 import。', href: 'auto-imports' },
    { icon: 'i-lucide-server', title: '服务端引擎 Nitro', desc: '基于 Rollup 与 Node.js workers，生产输出轻量且可部署到任何平台。', href: 'server-engine' },
    { icon: 'i-lucide-puzzle', title: '模块系统', desc: '通过自定义功能与第三方服务集成来扩展 Nuxt 的能力。', href: 'modules' },
    { icon: 'i-lucide-file-code', title: 'TypeScript', desc: '零配置的 TypeScript 支持，自动生成类型，开箱即用。', href: 'typescript' },
    { icon: 'i-lucide-layers', title: 'ESM', desc: '原生 ES Modules 支持，拥抱现代 JavaScript 生态。', href: 'esm' },
    { icon: 'i-lucide-code-2', title: '代码风格', desc: '遵循 Vue 与 Nuxt 社区的最佳实践，编写可维护的代码。', href: 'code-style' },
  ] as Concept[],

  directory: {
    title: '目录结构',
    subtitle: '通过约定和有主见的目录结构自动完成重复性任务',
    entries: [
      { name: 'app/', desc: '应用源代码主目录，包含组件、页面、布局等。', badge: '核心' },
      { name: 'app/pages/', desc: '基于文件的路由：每个 Vue 文件对应一个 URL 路由。', badge: '路由' },
      { name: 'app/components/', desc: '组件目录，组件会被自动导入到整个应用中。', badge: '自动导入' },
      { name: 'app/composables/', desc: '组合式函数目录，自动导入并可跨组件复用。', badge: '自动导入' },
      { name: 'app/layouts/', desc: '页面布局组件，通过 setPageLayout() 动态切换。' },
      { name: 'app/middleware/', desc: '路由中间件，在导航前执行自定义逻辑。' },
      { name: 'app/plugins/', desc: '插件目录，在应用启动时注册自定义功能。' },
      { name: 'app/utils/', desc: '工具函数目录，自动导入到整个应用。', badge: '自动导入' },
      { name: 'app/assets/', desc: '静态资源目录，由构建工具（Vite）处理。' },
      { name: 'app/app.vue', desc: '应用根组件，定义全局 UI 与布局结构。', badge: '入口' },
      { name: 'app/app.config.ts', desc: '运行时应用配置，可在客户端响应式访问。' },
      { name: 'public/', desc: '静态公共资源目录，原样托管到根路径 /。' },
      { name: 'server/', desc: '服务端目录，包含 API 路由、中间件与工具。', badge: '全栈' },
      { name: 'server/api/', desc: '服务端 API 路由，自动生成可调用的接口端点。' },
      { name: 'content/', desc: '内容目录，配合 @nuxt/content 模块实现基于文件的内容管理。' },
      { name: 'modules/', desc: '本地模块目录，自动注册到 Nuxt 模块系统。' },
      { name: 'layers/', desc: 'Layer 层级目录，支持项目组合与复用。' },
      { name: 'nuxt.config.ts', desc: 'Nuxt 配置文件，自定义构建、模块、运行时等行为。', badge: '配置' },
    ] as DirEntry[],
  },

  apiShowcase: {
    title: '核心 API',
    subtitle: '内置强大的 composables、组件与工具函数',
    components: [
      { name: '<NuxtPage>', type: '组件', desc: '渲染当前页面组件，配合 vue-router 渲染 pages/ 中的路由。' },
      { name: '<NuxtLink>', type: '组件', desc: '页面间导航链接，自动预取目标页面，支持过渡动画。' },
      { name: '<NuxtLayout>', type: '组件', desc: '渲染当前页面布局，可动态切换 layout。' },
      { name: '<ClientOnly>', type: '组件', desc: '仅在客户端渲染内容，SSR 时渲染占位符。' },
      { name: '<NuxtImg>', type: '组件', desc: '优化图片加载的组件，支持多种格式与尺寸。' },
      { name: '<NuxtErrorBoundary>', type: '组件', desc: '捕获子组件运行时错误，展示降级 UI。' },
    ] as ApiItem[],
    composables: [
      { name: 'useFetch', type: 'composable', desc: '封装 $fetch，在统一渲染中只获取数据一次，自动处理 SSR。' },
      { name: 'useAsyncData', type: 'composable', desc: '与 useFetch 类似，提供更细粒度的控制。' },
      { name: 'useSeoMeta', type: 'composable', desc: '声明式定义页面 SEO meta 标签，支持响应式更新。' },
      { name: 'useState', type: 'composable', desc: 'SSR 友好的全局状态管理，基于 ref 与唯一 key。' },
      { name: 'useRuntimeConfig', type: 'composable', desc: '访问运行时配置，区分公开与私密环境变量。' },
      { name: 'useCookie', type: 'composable', desc: 'SSR 友好的 Cookie 读写，支持响应式与选项配置。' },
      { name: 'useRoute', type: 'composable', desc: '访问当前路由信息，包含 params、query 等。' },
      { name: 'useRouter', type: 'composable', desc: '访问 vue-router 实例，编程式导航。' },
    ] as ApiItem[],
    utils: [
      { name: '$fetch', type: 'utils', desc: '基于 ofetch 的网络请求工具，最简单的数据获取方式。' },
      { name: 'navigateTo', type: 'utils', desc: '编程式导航到指定路由，支持服务端重定向。' },
      { name: 'definePageMeta', type: 'utils', desc: '为页面定义元信息，如 layout、middleware 等。' },
      { name: 'defineNuxtPlugin', type: 'utils', desc: '定义 Nuxt 插件，在应用启动时注册功能。' },
      { name: 'createError', type: 'utils', desc: '创建错误对象，用于抛出带状态码的应用错误。' },
      { name: 'callOnce', type: 'utils', desc: '确保函数仅在应用生命周期内执行一次。' },
    ] as ApiItem[],
  },

  footer: {
    desc: 'Nuxt 是一个免费且开源的框架，以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异的全栈 Web 应用。',
    columns: [
      {
        title: '资源',
        links: [
          { label: '文档', to: 'https://nuxt.com/docs' },
          { label: '示例', to: 'https://nuxt.com/examples' },
          { label: '模块', to: 'https://nuxt.com/modules' },
          { label: '部署', to: 'https://nuxt.com/deploy' },
        ],
      },
      {
        title: '社区',
        links: [
          { label: 'GitHub', to: 'https://github.com/nuxt/nuxt' },
          { label: 'Discord', to: 'https://chat.nuxt.dev' },
          { label: 'X (Twitter)', to: 'https://go.nuxt.com/x' },
          { label: 'Bluesky', to: 'https://go.nuxt.com/bluesky' },
        ],
      },
      {
        title: '支持',
        links: [
          { label: '专业支持', to: 'https://nuxt.com/enterprise/support' },
          { label: '代理商', to: 'https://nuxt.com/enterprise/agencies' },
          { label: '参与贡献', to: 'https://nuxt.com/docs/community/contribution' },
          { label: '报告 Bug', to: 'https://nuxt.com/docs/community/reporting-bugs' },
        ],
      },
    ],
  },
}

export type SiteData = typeof siteData

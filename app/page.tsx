import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Database,
  FolderTree,
  Github,
  Globe,
  Image,
  Layers,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  Download,
  Users,
  Zap,
} from 'lucide-react'
import { codeToHtml } from 'shiki'
import { DevTerminal } from '@/components/landing/dev-terminal'
import { CodeTabs, type CodeTab } from '@/components/landing/code-tabs'
import { CopyCommand } from '@/components/landing/copy-command'
import { ModuleMarquee } from '@/components/landing/module-marquee'

function NuxtLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden>
      <path
        d="M281.44 397.667h156.88c5.006 0 9.798-1.759 14.133-4.24a28.683 28.683 0 0 0 10.6-10.6c2.481-4.335 4.24-9.127 4.24-14.133 0-5.007-1.759-9.798-4.24-14.134l-105.6-182.4c-2.481-4.334-6.266-8.119-10.6-10.6-4.335-2.481-9.127-4.24-14.133-4.24-5.007 0-9.798 1.759-14.134 4.24-4.334 2.481-8.119 6.266-10.6 10.6l-26.546 45.934-53.067-91.52c-2.481-4.335-6.266-8.12-10.6-10.6-4.335-2.481-9.127-4.24-14.133-4.24-5.007 0-9.798 1.759-14.134 4.24-4.334 2.48-8.119 6.265-10.6 10.6L44.24 354.56c-2.481 4.336-4.24 9.127-4.24 14.134 0 5.006 1.759 9.798 4.24 14.133a28.683 28.683 0 0 0 10.6 10.6c4.335 2.481 9.127 4.24 14.133 4.24h98.56c39.027 0 67.6-17.133 87.467-50.133l48.08-83.067 25.6-44.267 77.12 133.12H302.4l-20.96 44.347Zm-115.84-44.347H96l103.68-179.2 51.68 89.6-34.24 59.067c-13.187 21.467-28.24 30.533-51.52 30.533Z"
        fill="#00DC82"
      />
    </svg>
  )
}

async function fetchJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

/** 构建时抓取真实生态数据，失败时回退到保守估值 */
async function getStats() {
  const [repo, downloads, modules] = await Promise.all([
    fetchJson('https://api.github.com/repos/nuxt/nuxt'),
    fetchJson('https://api.npmjs.org/downloads/point/last-week/nuxt'),
    fetchJson('https://nuxt.com/api/v1/modules'),
  ])
  const stars = typeof repo?.stargazers_count === 'number' ? repo.stargazers_count : 58_000
  const weekly = typeof downloads?.downloads === 'number' ? downloads.downloads : 900_000
  const stats = modules?.stats as { modules?: number } | undefined
  const moduleCount = typeof stats?.modules === 'number' ? stats.modules : 300
  return [
    { icon: Star, value: `${formatCount(stars)}+`, label: 'GitHub Stars' },
    { icon: Download, value: `${formatCount(weekly)}+`, label: '每周 npm 下载' },
    { icon: Boxes, value: `${moduleCount}+`, label: '生态模块' },
    { icon: Users, value: '700+', label: '核心贡献者' },
  ]
}

const CODE_SAMPLES: { label: string; lang: string; note: string; code: string }[] = [
  {
    label: 'app/pages/index.vue',
    lang: 'vue',
    note: '文件即路由 · useFetch 同构数据获取 · 组件与 API 自动导入，无需一行 import',
    code: `<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>

<template>
  <main>
    <h1>{{ data?.message }}</h1>
    <NuxtLink to="/about">关于我们</NuxtLink>
  </main>
</template>`,
  },
  {
    label: 'server/api/hello.ts',
    lang: 'ts',
    note: 'server/ 目录就是后端 · 由 Nitro 驱动，可部署到 Node、Serverless 或边缘节点',
    code: `export default defineEventHandler(() => {
  return {
    message: '你好，Nuxt！',
    time: Date.now(),
  }
})`,
  },
  {
    label: 'nuxt.config.ts',
    lang: 'ts',
    note: '一份配置掌控模块生态与渲染策略：按路由粒度选择预渲染、ISR 或 SSR',
    code: `export default defineConfig({
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxt/content'],
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { isr: 3600 },
    '/api/**': { cors: true },
  },
})`,
  },
]

const FEATURES = [
  {
    icon: FolderTree,
    title: '基于文件的路由',
    desc: 'app/pages/ 目录结构即路由表，动态路由、嵌套布局自动推导，代码分割与预取开箱即用。',
  },
  {
    icon: Sparkles,
    title: '智能自动导入',
    desc: '组件、组合式函数、工具函数按需自动导入并摇树优化，项目再大也保持轻装上阵。',
  },
  {
    icon: Database,
    title: '同构数据获取',
    desc: 'useFetch / useAsyncData 在服务端与客户端无缝衔接，自动去重、缓存与载荷水合。',
  },
  {
    icon: Layers,
    title: '混合渲染引擎',
    desc: 'routeRules 按路由粒度混合 SSR、SSG、ISR 与 CSR，性能与实时性兼得。',
  },
  {
    icon: Server,
    title: '全栈服务端',
    desc: 'server/ 目录编写 API、中间件与定时任务，Nitro 引擎一次构建，处处部署。',
  },
  {
    icon: ShieldCheck,
    title: '端到端类型安全',
    desc: '零配置 TypeScript，从数据库到模板的全链路类型推导，重构不再提心吊胆。',
  },
  {
    icon: Search,
    title: 'SEO 与 Meta',
    desc: 'useSeoMeta 类型安全地管理标题、Open Graph 与结构化数据，服务端渲染直出。',
  },
  {
    icon: Image,
    title: '图片与字体优化',
    desc: '@nuxt/image 与 @nuxt/fonts 自动压缩、懒加载、按需尺寸与本地化字体，Core Web Vitals 满分起步。',
  },
]

const RENDER_MODES = [
  {
    icon: Globe,
    title: '通用渲染',
    tag: 'SSR',
    desc: '服务端直出完整 HTML，首屏即内容，搜索引擎与社交分享开箱友好。',
  },
  {
    icon: Zap,
    title: '静态生成',
    tag: 'SSG',
    desc: '构建时预渲染为纯静态文件，托管到任何 CDN，快如闪电、成本趋零。',
  },
  {
    icon: Rocket,
    title: '增量静态再生',
    tag: 'ISR',
    desc: '静态页面按需后台更新，兼具静态的速度与动态的新鲜度。',
  },
  {
    icon: Server,
    title: '边缘渲染',
    tag: 'Edge',
    desc: '同一份代码部署到全球边缘节点，在离用户最近的地方完成渲染。',
  },
]

const MODULES_ROW_1 = [
  '@nuxt/ui',
  '@nuxt/content',
  '@nuxt/image',
  '@nuxt/fonts',
  '@nuxt/icon',
  '@nuxt/scripts',
  '@nuxt/devtools',
  '@nuxt/eslint',
]
const MODULES_ROW_2 = [
  '@pinia/nuxt',
  '@vueuse/nuxt',
  '@nuxtjs/tailwindcss',
  '@nuxtjs/i18n',
  '@nuxtjs/seo',
  '@nuxt/test-utils',
  'nuxt-auth-utils',
  '@nuxt/hints',
]

export default async function HomePage() {
  const [stats, ...highlighted] = await Promise.all([
    getStats(),
    ...CODE_SAMPLES.map((s) =>
      codeToHtml(s.code, {
        lang: s.lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'light',
      }),
    ),
  ])
  const tabs: CodeTab[] = CODE_SAMPLES.map((s, i) => ({
    label: s.label,
    note: s.note,
    html: highlighted[i],
  }))

  return (
    <main className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-fd-border/60 bg-fd-background/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="flex items-center gap-2 text-lg font-bold">
            <NuxtLogo className="size-6" />
            Nuxt
          </span>
          <nav className="flex items-center gap-4 text-sm text-fd-muted-foreground">
            <Link href="/docs/getting-started/introduction" className="transition-colors hover:text-fd-foreground">
              文档
            </Link>
            <a href="https://nuxt.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-fd-foreground">
              Nuxt 官网
            </a>
            <a
              href="https://github.com/bbylw/nuxt-cn"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="transition-colors hover:text-fd-foreground"
            >
              <Github className="size-5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-fd-primary/15 blur-[120px]"
          aria-hidden
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-2 lg:pb-28 lg:pt-24">
          <div className="fade-up text-center lg:text-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-fd-primary/30 bg-fd-primary/10 px-3 py-1 text-xs font-medium text-fd-primary">
              <NuxtLogo className="size-3.5" />
              Nuxt 4 · 免费开源 · MIT 许可
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
              直观的 Vue
              <br />
              <span className="bg-gradient-to-r from-fd-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                全栈框架
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-fd-muted-foreground lg:mx-0">
              以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈
              Web 应用和网站。
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/docs/getting-started/introduction"
                className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground shadow-lg shadow-fd-primary/25 transition-all hover:-translate-y-0.5 hover:bg-fd-primary/85"
              >
                <BookOpen className="size-4" />
                开始阅读
              </Link>
              <Link
                href="/docs/getting-started/installation"
                className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-6 py-3 font-medium transition-all hover:-translate-y-0.5 hover:bg-fd-accent"
              >
                安装 Nuxt
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <CopyCommand command="npm create nuxt@latest my-project" />
            </div>
          </div>
          <div className="fade-up-delay">
            <DevTerminal />
            <p className="mt-3 text-center text-xs text-fd-muted-foreground">
              毫秒级冷启动 · Vite 驱动的开发体验 · Nitro 驱动的生产服务端
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-fd-border/60 bg-fd-muted/30">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[repeat(2,minmax(0,1fr))] gap-6 px-6 py-10 sm:grid-cols-[repeat(4,minmax(0,1fr))]">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center">
              <s.icon className="mb-1 size-5 text-fd-primary" />
              <span className="text-3xl font-bold tracking-tight">{s.value}</span>
              <span className="text-sm text-fd-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Code showcase */}
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-6 py-20 lg:grid-cols-[1fr_1.2fr] lg:py-28">
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            写得少，
            <span className="text-fd-primary">做得多</span>
          </h2>
          <p className="mt-4 leading-relaxed text-fd-muted-foreground">
            路由、导入、数据获取、服务端 API——那些繁琐的样板代码，Nuxt 全部替你完成。
            你只需专注业务本身，几行代码就是一个全栈应用。
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              '页面放进 app/pages/，路由自动生成',
              'useFetch 一行搞定服务端 + 客户端数据',
              'server/api/ 里的文件就是可部署的接口',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-fd-primary" />
                <span className="text-fd-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <CodeTabs tabs={tabs} />
      </section>

      {/* Features */}
      <section className="cv-auto border-t border-fd-border/60 bg-fd-muted/20">
        <div className="reveal mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">为生产环境而生的每一项能力</h2>
            <p className="mt-4 text-fd-muted-foreground">
              从开发体验到线上性能，Nuxt 把现代 Web 开发的最佳实践内置为默认值。
            </p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:-translate-y-1 hover:border-fd-primary/40 hover:shadow-lg hover:shadow-fd-primary/5"
              >
                <f.icon className="size-6 text-fd-primary" />
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rendering modes */}
      <section className="cv-auto mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <div className="reveal mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            一个框架，<span className="text-fd-primary">四种渲染策略</span>
          </h2>
          <p className="mt-4 text-fd-muted-foreground">
            无需切换框架或重写代码，用 routeRules 为每个路由选择最合适的渲染方式。
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RENDER_MODES.map((m) => (
            <div key={m.tag} className="relative overflow-hidden rounded-xl border border-fd-border bg-fd-card p-5">
              <span className="absolute end-4 top-4 font-mono text-xs font-bold text-fd-primary/60">{m.tag}</span>
              <m.icon className="size-6 text-fd-primary" />
              <h3 className="mt-3 font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="cv-auto border-t border-fd-border/60 bg-fd-muted/20 py-20 lg:py-24">
        <div className="reveal mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">站在繁荣生态的肩膀上</h2>
          <p className="mt-4 text-fd-muted-foreground">
            数百个官方与社区模块，一行配置即可接入 UI、内容、认证、SEO、测试等能力。
          </p>
        </div>
        <div className="mt-12">
          <ModuleMarquee rows={[MODULES_ROW_1, MODULES_ROW_2]} />
        </div>
        <div className="mt-10 text-center">
          <a
            href="https://nuxt.com/modules"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary transition-colors hover:text-fd-primary/80"
          >
            浏览全部模块
            <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="cv-auto mx-auto w-full max-w-6xl px-6 py-20 lg:py-28">
        <div className="reveal relative overflow-hidden rounded-2xl border border-fd-primary/30 bg-gradient-to-br from-fd-primary/10 via-fd-card to-fd-card px-8 py-14 text-center">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-fd-primary/20 blur-[100px]"
            aria-hidden
          />
          <NuxtLogo className="relative mx-auto size-12" />
          <h2 className="relative mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            几分钟内启动你的下一个项目
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-fd-muted-foreground">
            一条命令创建项目，中文文档全程相伴。从入门到部署，每一步都有清晰指引。
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs/getting-started/introduction"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground shadow-lg shadow-fd-primary/25 transition-all hover:-translate-y-0.5 hover:bg-fd-primary/85"
            >
              <BookOpen className="size-4" />
              阅读中文文档
            </Link>
            <CopyCommand command="npm create nuxt@latest" />
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-fd-border py-8 text-center text-sm text-fd-muted-foreground">
        基于 Fumadocs 构建 · 译文与上游{' '}
        <a href="https://github.com/nuxt/nuxt" target="_blank" rel="noreferrer" className="underline">
          nuxt/nuxt
        </a>{' '}
        保持同步
      </footer>
    </main>
  )
}
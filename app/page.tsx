import Link from 'next/link'
import { ArrowRight, BookOpen, Github } from 'lucide-react'

const features = [
  {
    title: '服务端渲染',
    desc: '默认开启 SSR，同时支持静态生成、混合渲染与边缘渲染，开箱即用的 Nitro 服务端引擎。',
  },
  {
    title: '自动导入',
    desc: '组件、组合式函数与工具函数无需手动导入，零配置 TypeScript，类型安全贯穿全栈。',
  },
  {
    title: '基于文件的路由',
    desc: 'app/pages/ 目录即路由，自动代码分割与预取，让应用组织清晰、加载迅速。',
  },
  {
    title: '全栈能力',
    desc: 'server/ 目录编写 API 与服务端逻辑，300+ 模块生态，可部署到任何托管平台。',
  },
]

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 text-lg font-bold">
          <svg viewBox="0 0 512 512" className="size-6" aria-hidden>
            <path
              d="M281.44 397.667h156.88c5.006 0 9.798-1.759 14.133-4.24a28.683 28.683 0 0 0 10.6-10.6c2.481-4.335 4.24-9.127 4.24-14.133 0-5.007-1.759-9.798-4.24-14.134l-105.6-182.4c-2.481-4.334-6.266-8.119-10.6-10.6-4.335-2.481-9.127-4.24-14.133-4.24-5.007 0-9.798 1.759-14.134 4.24-4.334 2.481-8.119 6.266-10.6 10.6l-26.546 45.934-53.067-91.52c-2.481-4.335-6.266-8.12-10.6-10.6-4.335-2.481-9.127-4.24-14.133-4.24-5.007 0-9.798 1.759-14.134 4.24-4.334 2.48-8.119 6.265-10.6 10.6L44.24 354.56c-2.481 4.336-4.24 9.127-4.24 14.134 0 5.006 1.759 9.798 4.24 14.133a28.683 28.683 0 0 0 10.6 10.6c4.335 2.481 9.127 4.24 14.133 4.24h98.56c39.027 0 67.6-17.133 87.467-50.133l48.08-83.067 25.6-44.267 77.12 133.12H302.4l-20.96 44.347Zm-115.84-44.347H96l103.68-179.2 51.68 89.6-34.24 59.067c-13.187 21.467-28.24 30.533-51.52 30.533Z"
              fill="#00DC82"
            />
          </svg>
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
      </header>

      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 pb-16 pt-20 text-center">
        <span className="mb-6 rounded-full border border-fd-border bg-fd-muted px-3 py-1 text-xs text-fd-muted-foreground">
          跟随 Nuxt 4.x 官方文档同步更新
        </span>
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          直观的 Vue
          <span className="text-fd-primary"> 全栈框架</span>
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-fd-muted-foreground">
          Nuxt 是一个免费且开源的框架，以直观且可扩展的方式，借助 Vue.js
          创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/docs/getting-started/introduction"
            className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/85"
          >
            <BookOpen className="size-4" />
            开始阅读
          </Link>
          <Link
            href="/docs/getting-started/installation"
            className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-6 py-3 font-medium transition-colors hover:bg-fd-accent"
          >
            安装 Nuxt
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <code className="mt-8 rounded-lg border border-fd-border bg-fd-muted px-4 py-2 text-sm text-fd-muted-foreground">
          npm create nuxt@latest my-project
        </code>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border border-fd-border bg-fd-card p-5">
            <h2 className="font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{f.desc}</p>
          </div>
        ))}
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
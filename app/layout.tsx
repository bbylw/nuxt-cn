import type { Metadata, Viewport } from 'next'
import { Noto_Sans_SC, JetBrains_Mono } from 'next/font/google'
import { RootProvider } from 'fumadocs-ui/provider'
import ZhSearchDialog from '@/components/search-dialog'
import { ChunkErrorHandler } from '@/components/chunk-error-handler'
import './globals.css'

// 自托管字体：构建时下载并生成度量校正的 fallback（size-adjust/ascent-override），
// 消除第三方渲染阻塞 CSS 与字体交换引起的布局偏移（CLS）
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-sans-sc',
  preload: false,
})

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-mono',
})

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://nuxt.ndjp.net'),
  title: {
    default: 'Nuxt 中文文档 · 直观的 Vue 全栈框架',
    template: '%s · Nuxt 中文文档',
  },
  description:
    'Nuxt 是一个免费且开源的框架，以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。本站为 Nuxt 官方文档的中文翻译。',
  openGraph: {
    type: 'website',
    siteName: 'Nuxt 中文文档',
    locale: 'zh_CN',
    title: 'Nuxt 中文文档 · 直观的 Vue 全栈框架',
    description:
      '以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。',
  },
  twitter: {
    card: 'summary',
    title: 'Nuxt 中文文档 · 直观的 Vue 全栈框架',
    description:
      '以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${notoSansSC.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <ChunkErrorHandler />
        <RootProvider
          search={{ SearchDialog: ZhSearchDialog }}
          i18n={{
            locale: 'zh-CN',
            translations: {
              search: '搜索文档',
              searchNoResult: '没有找到相关结果',
              toc: '本页目录',
              tocNoHeadings: '无标题',
              lastUpdate: '最后更新于',
              chooseTheme: '主题',
              nextPage: '下一页',
              previousPage: '上一页',
              editOnGithub: '在 GitHub 上编辑',
              chooseLanguage: '选择语言',
            },
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
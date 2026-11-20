import type { Metadata } from 'next'
import { RootProvider } from 'fumadocs-ui/provider'
import ZhSearchDialog from '@/components/search-dialog'
import { ChunkErrorHandler } from '@/components/chunk-error-handler'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://nuxt.ndjp.net'),
  title: {
    default: 'Nuxt 中文文档 · 直观的 Vue 全栈框架',
    template: '%s · Nuxt 中文文档',
  },
  description:
    'Nuxt 是一个免费且开源的框架，以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。本站为 Nuxt 官方文档的中文翻译。',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
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
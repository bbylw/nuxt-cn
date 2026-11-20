import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page'
import { source, readDoc, getNeighbours, resolveDocHref } from '@/lib/source'
import { renderMarkdown } from '@/lib/render'

interface Params {
  slug?: string[]
}

/** 静态导出下 redirect() 只生成依赖 JS 的空壳页，用 meta refresh 实现无 JS 也能跳转 */
function RedirectTo({ target }: { target: string }) {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${target}`} />
      <p className="p-8 text-fd-muted-foreground">
        正在跳转到 <a href={target} className="text-fd-primary underline">{target}</a> …
      </p>
    </>
  )
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  if (!slug || slug.length === 0) {
    return <RedirectTo target="/docs/getting-started/introduction" />
  }
  const page = source.getPage(slug)
  if (!page) {
    // 目录路径（如 /docs/guide/concepts）重定向到该目录下第一个页面
    const target = resolveDocHref(`/docs/${slug.join('/')}`)
    if (target) return <RedirectTo target={target} />
    notFound()
  }

  const { content } = readDoc(page.data.filePath as string)
  const { body, toc } = await renderMarkdown(content, page.data.filePath as string)
  const { prev, next } = getNeighbours(page.url)

  return (
    <DocsPage
      toc={toc}
      editOnGithub={{
        owner: 'bbylw',
        repo: 'nuxt-cn',
        path: `docs/${page.data.filePath}`,
      }}
      footer={{
        // fumadocs 16 的 footer 是 props 对象，ReactNode 需放在 component 里
        component: (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={prev.url}
              className="flex flex-1 flex-col gap-1 rounded-lg border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent"
            >
              <span className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground">
                <ArrowLeft className="size-3" />
                上一页
              </span>
              <span className="font-medium text-fd-primary">{prev.name}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={next.url}
              className="flex flex-1 flex-col items-end gap-1 rounded-lg border border-fd-border bg-fd-card p-4 text-end transition-colors hover:bg-fd-accent"
            >
              <span className="inline-flex items-center gap-1 text-xs text-fd-muted-foreground">
                下一页
                <ArrowRight className="size-3" />
              </span>
              <span className="font-medium text-fd-primary">{next.name}</span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </div>
        ),
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>{body}</DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams(): Params[] {
  const params: Params[] = [{ slug: undefined }]
  const seen = new Set<string>()
  for (const page of source.getPages()) {
    params.push({ slug: page.slugs })
    // 同时导出所有目录前缀，生成重定向页，避免直接访问目录 URL 时 404
    for (let i = 1; i < page.slugs.length; i++) {
      const prefix = page.slugs.slice(0, i)
      const key = prefix.join('/')
      if (seen.has(key) || source.getPage(prefix)) continue
      seen.add(key)
      params.push({ slug: prefix })
    }
  }
  return params
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) return {}
  return {
    title: page.data.title,
    description: page.data.description,
  }
}
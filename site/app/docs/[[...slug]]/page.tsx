import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page'
import { source, readDoc, getNeighbours } from '@/lib/source'
import { renderMarkdown } from '@/lib/render'

interface Params {
  slug?: string[]
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  if (!slug || slug.length === 0) {
    redirect('/docs/getting-started/introduction')
  }
  const page = source.getPage(slug)
  if (!page) notFound()

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
      footer={
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
      }
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && <DocsDescription>{page.data.description}</DocsDescription>}
      <DocsBody>{body}</DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams(): Params[] {
  return source.getPages().map((page) => ({ slug: page.slugs }))
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
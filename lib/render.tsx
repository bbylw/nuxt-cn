import { Fragment, type ReactNode } from 'react'
import fs from 'node:fs'
import path from 'node:path'
import { jsx, jsxs } from 'react/jsx-runtime'
import Link from 'next/link'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdc from 'remark-mdc'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import { rehypeCode } from 'fumadocs-core/mdx-plugins'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import { bundledLanguages } from 'shiki'
import { toString as mdastToString } from 'mdast-util-to-string'
import type { Root as MdastRoot, Code, Heading } from 'mdast'
import type { Root as HastRoot, Element, ElementContent } from 'hast'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { resolveDocHref } from './source'
import anchorAliases from './anchor-aliases.json'
import {
  Note,
  Tip,
  Warning,
  Important,
  Caution,
  ReadMore,
  CalloutCard,
  CodeGroup,
  MdcSteps,
  Badge,
  MdcCard,
  CardGroup,
  Collapsible,
  VideoAccordion,
  LinkExample,
  UButton,
  UnknownComponent,
} from './mdc-components'

export interface TocItem {
  title: string
  url: string
  depth: number
}

/** 为标题生成 id，并收集 TOC */
function remarkHeadings(toc: TocItem[]) {
  return function (tree: MdastRoot) {
    const slugger = new GithubSlugger()
    visit(tree, 'heading', (node: Heading) => {
      const text = mdastToString(node)
      const id = slugger.slug(text)
      node.data ??= {}
      node.data.hProperties = { ...(node.data.hProperties as object), id }
      if (node.depth >= 2 && node.depth <= 3) {
        toc.push({ title: text, url: `#${id}`, depth: node.depth })
      }
    })
  }
}

/** 规范化代码块语言，避免 shiki 因未知语言报错 */
function remarkCodeLang() {
  return function (tree: MdastRoot) {
    visit(tree, 'code', (node: Code) => {
      const lang = node.lang?.split(/\s/)[0]
      if (!lang || !(lang in bundledLanguages)) {
        node.lang = 'text'
      }
    })
  }
}

/** 处理 MDC 组件的 hast 结构：代码分组标签、callout 插槽 */
function rehypeMdc() {
  return function (tree: HastRoot) {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'code-group' || node.tagName === 'code-tree') {
        const wrapped: ElementContent[] = []
        // rehypeCode 会把每个 pre 包进 root 片段，先展开
        const flat: ElementContent[] = []
        for (const child of node.children) {
          if ((child as { type: string }).type === 'root') {
            flat.push(...((child as unknown as HastRoot).children as ElementContent[]))
          } else {
            flat.push(child)
          }
        }
        for (const child of flat) {
          if (child.type === 'element' && child.tagName === 'pre') {
            const label =
              (child.properties?.title as string) ??
              (child.properties?.['data-language'] as string) ??
              'code'
            if (child.properties) delete child.properties.title
            wrapped.push({
              type: 'element',
              tagName: 'mdc-tab',
              properties: { label },
              children: [child],
            })
          } else if (child.type === 'element') {
            wrapped.push(child)
          }
        }
        node.children = wrapped
      }
      if (node.tagName === 'callout') {
        for (const child of node.children) {
          if (child.type === 'element' && child.tagName === 'component-slot') {
            const props = child.properties ?? {}
            const name = 'v-slot:title' in props ? 'title' : 'v-slot:description' in props ? 'description' : 'default'
            child.tagName = 'mdc-slot'
            child.properties = { 'data-slot': name }
          }
        }
      }
    })
  }
}

/**
 * 为标题注入上游英文锚点别名：中文标题的 id 是中文，
 * 但全站互链沿用上游英文锚点，按标题顺序对齐后补充 <span id="en-slug">。
 */
function rehypeAnchorAliases(filePath?: string) {
  return function (tree: HastRoot) {
    const aliases = filePath ? (anchorAliases as Record<string, string[]>)[filePath] : undefined
    if (!aliases) return
    const headings: Element[] = []
    visit(tree, 'element', (node: Element) => {
      if (/^h[1-6]$/.test(node.tagName)) headings.push(node)
    })
    if (headings.length !== aliases.length) return
    headings.forEach((node, i) => {
      const en = aliases[i]
      if (en && node.properties?.id !== en) {
        node.children.unshift({
          type: 'element',
          tagName: 'span',
          properties: { id: en },
          children: [],
        })
      }
    })
  }
}

function SmartLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const href = props.href ?? ''
  if (href.startsWith('/docs')) {
    const [path, hash] = href.split('#')
    const resolved = resolveDocHref(path)
    if (resolved) return <Link {...props} href={hash ? `${resolved}#${hash}` : resolved} />
  }
  if (href.startsWith('/')) {
    return <a {...props} href={`https://nuxt.com${href}`} target="_blank" rel="noreferrer" />
  }
  const external = /^https?:/.test(href)
  return <a {...props} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} />
}

const components = {
  a: SmartLink,
  pre: (props: React.ComponentProps<'pre'>) => (
    <CodeBlock {...props}>
      <Pre>{props.children}</Pre>
    </CodeBlock>
  ),
  img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    let src = props.src ?? ''
    if (typeof src === 'string' && src.startsWith('/')) {
      // 本地 public/ 中存在的资源（如 CLI 终端截图）直接用本站路径，其余指向 nuxt.com
      src = fs.existsSync(path.join(process.cwd(), 'public', src)) ? src : `https://nuxt.com${src}`
    }
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} src={src} loading="lazy" className="rounded-lg border border-fd-border" />
  },
  note: Note,
  tip: Tip,
  warning: Warning,
  important: Important,
  caution: Caution,
  callout: CalloutCard,
  'read-more': ReadMore,
  'code-group': CodeGroup,
  'code-tree': CodeGroup,
  steps: MdcSteps,
  badge: Badge,
  card: MdcCard,
  'card-group': CardGroup,
  collapsible: Collapsible,
  'video-accordion': VideoAccordion,
  'link-example': LinkExample,
  'u-button': UButton,
  br: () => <br />,
  'mdc-slot': UnknownComponent,
  'component-slot': UnknownComponent,
}

export async function renderMarkdown(
  content: string,
  filePath?: string,
): Promise<{ body: ReactNode; toc: TocItem[] }> {
  const toc: TocItem[] = []
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdc)
    .use(remarkHeadings, toc)
    .use(remarkCodeLang)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeCode, {
      themes: { light: 'github-light', dark: 'github-dark' },
      filterMetaString: (meta: string) => meta.replace(/\[([^\]]*)\]/, 'title="$1"'),
    })
    .use(rehypeMdc)
    .use(rehypeAnchorAliases, filePath)

  const hast = await processor.run(processor.parse(content))
  const body = toJsxRuntime(hast as HastRoot, {
    Fragment,
    jsx: jsx as never,
    jsxs: jsxs as never,
    components: components as never,
  })
  return { body, toc }
}
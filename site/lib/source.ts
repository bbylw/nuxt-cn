import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { loader, type VirtualFile, type PageData, type MetaData } from 'fumadocs-core/source'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { icons } from 'lucide-react'
import type * as PageTree from 'fumadocs-core/page-tree'

const DOCS_DIR = path.resolve(process.cwd(), '../docs')

export interface DocFrontmatter {
  title?: string
  description?: string
  navigation?: boolean | { title?: string; icon?: string }
}

export interface DocPageData {
  title: string
  description?: string
  icon?: string
  /** path relative to docs/ */
  filePath: string
  [key: string]: unknown
}

/** 各章节的中文标题与图标（对应上游 .navigation.yml） */
const SECTIONS: Record<string, { title: string; icon?: string; defaultOpen?: boolean }> = {
  'getting-started': { title: '快速开始', icon: 'Rocket' },
  'directory-structure': { title: '目录结构', icon: 'Folder' },
  'directory-structure/app': { title: 'app/', icon: 'FolderCode', defaultOpen: true },
  'guide': { title: '指南', icon: 'BookOpen' },
  'guide/concepts': { title: '核心概念', icon: 'Medal' },
  'guide/best-practices': { title: '最佳实践', icon: 'SquareCheck' },
  'guide/ai': { title: '与 AI 协作', icon: 'Bot' },
  'guide/modules': { title: '模块作者指南', icon: 'Box' },
  'guide/recipes': { title: '实用配方', icon: 'CookingPot' },
  'guide/going-further': { title: '进阶', icon: 'Star' },
  'api': { title: 'API', icon: 'CodeXml' },
  'api/components': { title: '组件', icon: 'Box' },
  'api/composables': { title: '组合式函数', icon: 'ArrowLeftRight' },
  'api/utils': { title: '工具函数', icon: 'SquareFunction' },
  'api/commands': { title: 'CLI 命令', icon: 'SquareTerminal' },
  'api/kit': { title: 'Nuxt Kit', icon: 'Package' },
  'api/advanced': { title: '高级', icon: 'Brain' },
  'community': { title: '社区', icon: 'MessagesSquare' },
  'bridge': { title: '迁移到 Nuxt Bridge', icon: 'Ship' },
  'migration': { title: '迁移到 Nuxt 3', icon: 'CircleArrowUp' },
  'errors': { title: '错误码', icon: 'TriangleAlert' },
}

const ROOT_PAGES = [
  'getting-started',
  'directory-structure',
  'guide',
  'api',
  'community',
  'bridge',
  'migration',
]

function stripPrefix(name: string): string {
  return name.replace(/^\d+\./, '')
}

/** 与 Nuxt Content 一致：先按数字前缀，再按原始文件名字符串排序 */
function sortKey(rawName: string): [number, string] {
  const m = rawName.match(/^(\d+)\./)
  return [m ? Number(m[1]) : Number.MAX_SAFE_INTEGER, rawName]
}

function compareEntries(a: string, b: string): number {
  const [na, sa] = sortKey(a)
  const [nb, sb] = sortKey(b)
  return na - nb || (sa < sb ? -1 : sa > sb ? 1 : 0)
}

function mapIcon(icon?: string): string | undefined {
  if (!icon) return undefined
  let name: string
  if (icon.startsWith('i-lucide-')) {
    name = icon
      .slice('i-lucide-'.length)
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('')
  } else if (icon.includes('folder-type-app')) {
    name = 'FolderCode'
  } else if (icon.includes('folder')) {
    name = 'Folder'
  } else {
    return undefined
  }
  return name in icons ? name : undefined
}

interface WalkedFile {
  /** 原始相对路径，如 1.getting-started/01.introduction.md */
  rawPath: string
  /** 去编号后的相对路径，如 getting-started/introduction.md */
  cleanPath: string
  slugs: string[]
  frontmatter: DocFrontmatter
  /** navigation: false 的页面不进入侧边栏，但仍可访问 */
  hidden: boolean
}

function walk(dir: string, rel = ''): WalkedFile[] {
  const out: WalkedFile[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rawRel = rel ? `${rel}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      out.push(...walk(path.join(dir, entry.name), rawRel))
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      const raw = fs.readFileSync(path.join(dir, entry.name), 'utf8')
      const { data } = matter(raw)
      const fm = data as DocFrontmatter
      const rawSegs = rawRel.split('/')
      const cleanSegs = rawSegs.map(stripPrefix)
      const base = cleanSegs[cleanSegs.length - 1].replace(/\.md$/, '')
      const folders = cleanSegs.slice(0, -1)
      const slugs = base === 'index' ? folders : [...folders, base]
      out.push({
        rawPath: rawRel,
        cleanPath: [...folders, `${base}.md`].join('/'),
        slugs,
        frontmatter: fm,
        hidden: fm.navigation === false,
      })
    }
  }
  return out
}

function buildVirtualFiles() {
  const files = walk(DOCS_DIR)
  const virtual: VirtualFile<{ pageData: DocPageData; metaData: MetaData }>[] = []

  for (const f of files) {
    const nav = typeof f.frontmatter.navigation === 'object' ? f.frontmatter.navigation : undefined
    const base = path.basename(f.cleanPath, '.md')
    virtual.push({
      type: 'page',
      path: f.cleanPath,
      slugs: f.slugs,
      data: {
        title: nav?.title ?? f.frontmatter.title ?? base,
        description: f.frontmatter.description,
        icon: mapIcon(nav?.icon),
        filePath: f.rawPath,
      },
    })
  }

  // 为每个目录生成 meta（按上游编号排序，文件夹与文件交错）
  const hiddenPaths = new Set(files.filter((f) => f.hidden).map((f) => f.cleanPath))
  const dirs = new Set<string>([''])
  for (const f of files) {
    const segs = f.rawPath.split('/')
    for (let i = 1; i < segs.length; i++) {
      dirs.add(segs.slice(0, i).join('/'))
    }
  }
  for (const rawDir of dirs) {
    const abs = rawDir ? path.join(DOCS_DIR, rawDir) : DOCS_DIR
    const entries = fs
      .readdirSync(abs, { withFileTypes: true })
      .filter((e) => e.isDirectory() || (e.name.endsWith('.md') && e.name !== 'README.md'))
      .map((e) => e.name)
      .sort(compareEntries)

    const cleanDir = rawDir ? rawDir.split('/').map(stripPrefix).join('/') : ''
    const pages: string[] = []
    for (const name of entries) {
      const clean = stripPrefix(name)
      const base = clean.replace(/\.md$/, '')
      if (base === 'index') continue
      if (!rawDir && !ROOT_PAGES.includes(base)) continue
      const cleanPath = cleanDir ? `${cleanDir}/${clean}` : clean
      if (hiddenPaths.has(cleanPath)) continue
      pages.push(base)
    }

    const section = SECTIONS[cleanDir]
    virtual.push({
      type: 'meta',
      path: cleanDir ? `${cleanDir}/meta.json` : 'meta.json',
      data: {
        title: section?.title ?? (cleanDir ? path.basename(cleanDir) : '文档'),
        icon: section?.icon,
        defaultOpen: section?.defaultOpen,
        pages,
      },
    })
  }
  return virtual
}

export const source = loader({
  baseUrl: '/docs',
  source: { files: buildVirtualFiles() },
  plugins: [lucideIconsPlugin()],
})

export function readDoc(filePath: string): { content: string; frontmatter: DocFrontmatter } {
  const raw = fs.readFileSync(path.join(DOCS_DIR, filePath), 'utf8')
  const { data, content } = matter(raw)
  return { content, frontmatter: data as DocFrontmatter }
}

/**
 * 解析内部 /docs 链接：精确页面优先；若指向目录（如 /docs/guide/concepts），
 * 重定向到该目录下第一个页面；都不存在返回 null。
 */
export function resolveDocHref(pathname: string): string | null {
  const clean = pathname.replace(/\/+$/, '')
  const slugs = clean.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
  if (source.getPage(slugs)) return clean
  const prefix = slugs.join('/') + '/'
  const child = source.getPages().find((p) => p.slugs.join('/').startsWith(prefix))
  return child ? child.url : null
}

export type DocTree = PageTree.Root
export const pageTree: DocTree = source.pageTree

/** 按侧边栏顺序展开的所有页面节点，用于上一页/下一页 */
function flattenTree(nodes: PageTree.Node[]): PageTree.Item[] {
  const out: PageTree.Item[] = []
  for (const node of nodes) {
    if (node.type === 'page') out.push(node)
    else if (node.type === 'folder') {
      if (node.index) out.push(node.index)
      out.push(...flattenTree(node.children))
    }
  }
  return out
}

const flatPages = flattenTree(pageTree.children)

export function getNeighbours(url: string): {
  prev?: PageTree.Item
  next?: PageTree.Item
} {
  const idx = flatPages.findIndex((p) => p.url === url)
  if (idx === -1) return {}
  return { prev: flatPages[idx - 1], next: flatPages[idx + 1] }
}
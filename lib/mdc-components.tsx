import {
  Children,
  isValidElement,
  type ComponentType,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { icons } from 'lucide-react'
import { Callout } from 'fumadocs-ui/components/callout'
import { Tabs } from 'fumadocs-ui/components/tabs'
import { Steps, Step } from 'fumadocs-ui/components/steps'
import { Cards, Card } from 'fumadocs-ui/components/card'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { resolveDocHref } from './source'

type AnyProps = Record<string, unknown> & { children?: ReactNode }

function resolveHref(to: unknown): { href: string; external: boolean } {
  const raw = typeof to === 'string' ? to : ''
  if (raw.startsWith('/docs')) {
    const [path, hash] = raw.split('#')
    const resolved = resolveDocHref(path)
    if (resolved) return { href: hash ? `${resolved}#${hash}` : resolved, external: false }
  }
  if (raw.startsWith('/')) return { href: `https://nuxt.com${raw}`, external: true }
  return { href: raw, external: /^https?:/.test(raw) }
}

function lucideIcon(name: unknown): ReactNode {
  if (typeof name !== 'string') return undefined
  const key = name
    .replace(/^i-lucide-/, '')
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  const Icon = (icons as Record<string, ComponentType>)[key]
  return Icon ? <Icon /> : undefined
}

/* ---------- 提示框 ---------- */

export function Note(props: AnyProps) {
  return <Callout type="info" {...filterCalloutProps(props)} />
}
export function Tip(props: AnyProps) {
  return <Callout type="success" {...filterCalloutProps(props)} />
}
export function Warning(props: AnyProps) {
  return <Callout type="warn" {...filterCalloutProps(props)} />
}
export function Important(props: AnyProps) {
  return <Callout type="warning" {...filterCalloutProps(props)} />
}
export function Caution(props: AnyProps) {
  return <Callout type="error" {...filterCalloutProps(props)} />
}

function filterCalloutProps({ children, icon, ...rest }: AnyProps) {
  return { icon: lucideIcon(icon), children, title: rest.title as ReactNode }
}

/* ---------- 延伸阅读 ---------- */

export function ReadMore(props: AnyProps) {
  const { to, title, children } = props
  if (typeof to === 'string' && to) {
    const { href, external } = resolveHref(to)
    const label = (title as string) || '延伸阅读'
    const cls =
      'not-prose my-4 block rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm transition-colors hover:bg-fd-accent'
    const inner = (
      <>
        <span className="flex items-center justify-between gap-2 font-medium text-fd-card-foreground">
          {label}
          {external ? (
            <ExternalLink className="size-4 shrink-0 text-fd-muted-foreground" />
          ) : (
            <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground" />
          )}
        </span>
        {children != null && (
          <span className="mt-1 block text-fd-muted-foreground [&_p]:my-0">{children}</span>
        )}
      </>
    )
    return external ? (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  }
  return (
    <div className="not-prose my-4 rounded-lg border border-fd-border bg-fd-card px-4 py-3 text-sm">
      <p className="mb-1 font-medium text-fd-muted-foreground">延伸阅读</p>
      <div className="[&_ul]:my-1 [&_ul]:ps-4">{children}</div>
    </div>
  )
}

/* ---------- Callout 卡片（带 #title / #description 插槽） ---------- */

export function CalloutCard(props: AnyProps) {
  const { to, icon, children } = props
  let title: ReactNode = null
  let description: ReactNode = null
  const rest: ReactNode[] = []
  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && (child.props as AnyProps)['data-slot']) {
      const slot = (child.props as AnyProps)['data-slot']
      if (slot === 'title') title = (child.props as AnyProps).children as ReactNode
      else if (slot === 'description')
        description = (child.props as AnyProps).children as ReactNode
      else rest.push(child)
    } else {
      rest.push(child)
    }
  }
  const { href, external } = resolveHref(to)
  const inner = (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-fd-primary">{lucideIcon(icon) ?? <ArrowRight className="size-5" />}</span>
      <div className="min-w-0">
        {title && <div className="font-semibold text-fd-foreground">{title}</div>}
        {description && <div className="mt-1 text-sm text-fd-muted-foreground">{description}</div>}
        {rest.length > 0 && <div className="mt-1 text-sm">{rest}</div>}
      </div>
    </div>
  )
  const cls =
    'not-prose my-4 block rounded-xl border border-fd-border bg-fd-card p-4 transition-colors hover:bg-fd-accent'
  return typeof to === 'string' && to ? (
    external ? (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    )
  ) : (
    <div className={cls}>{inner}</div>
  )
}

/* ---------- 代码分组 / 代码树 ---------- */

export function CodeGroup(props: AnyProps) {
  const tabs: { label: string; node: ReactNode }[] = []
  for (const child of Children.toArray(props.children)) {
    if (isValidElement(child)) {
      const p = child.props as AnyProps
      const label = (p.label as string) ?? `代码 ${tabs.length + 1}`
      tabs.push({ label, node: p.children as ReactNode })
    }
  }
  if (tabs.length === 0) return <>{props.children}</>
  return (
    <Tabs items={tabs.map((t) => t.label)} className="my-4">
      {tabs.map((t, i) => (
        <div key={i} className="[&>figure]:my-0 [&>pre]:my-0">
          {t.node}
        </div>
      ))}
    </Tabs>
  )
}

/* ---------- 步骤 ---------- */

export function MdcSteps(props: AnyProps) {
  const groups: ReactNode[][] = []
  let current: ReactNode[] = []
  for (const child of Children.toArray(props.children)) {
    if (isValidElement(child) && child.type === 'h3') {
      if (current.length > 0) groups.push(current)
      current = [child]
    } else {
      current.push(child)
    }
  }
  if (current.length > 0) groups.push(current)
  return (
    <Steps>
      {groups.map((g, i) => (
        <Step key={i}>{g}</Step>
      ))}
    </Steps>
  )
}

/* ---------- 徽章 / 卡片 ---------- */

export function Badge(props: AnyProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-fd-primary/10 px-1.5 py-0.5 align-middle text-xs font-medium text-fd-primary">
      {props.children}
    </span>
  )
}

export function MdcCard(props: AnyProps) {
  const { title, description, icon, to } = props
  const { href, external } = resolveHref(to)
  return (
    <Card
      title={(title as ReactNode) ?? ''}
      description={description as ReactNode}
      icon={lucideIcon(icon)}
      href={typeof to === 'string' ? href : undefined}
      external={external}
    />
  )
}

export function CardGroup(props: AnyProps) {
  return <Cards>{props.children}</Cards>
}

/* ---------- 折叠面板 / 视频 ---------- */

export function Collapsible(props: AnyProps) {
  const title = (props.name as string) ?? (props.title as string) ?? '展开'
  return (
    <Accordions type="single" collapsible className="not-prose my-4">
      <Accordion title={title} value="content">
        <div className="prose-no-margin text-sm">{props.children}</div>
      </Accordion>
    </Accordions>
  )
}

export function VideoAccordion(props: AnyProps) {
  const title = (props.title as string) ?? '观看视频'
  const videoId = (props.videoId as string) ?? ''
  const src =
    props.platform === 'vimeo'
      ? `https://player.vimeo.com/video/${videoId}`
      : `https://www.youtube-nocookie.com/embed/${videoId}`
  return (
    <Accordions type="single" collapsible className="not-prose my-4">
      <Accordion title={title} value="video">
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            src={src}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
            loading="lazy"
          />
        </div>
      </Accordion>
    </Accordions>
  )
}

/* ---------- 其他 ---------- */

export function LinkExample(props: AnyProps) {
  const to = (props.to as string) ?? ''
  return (
    <a
      href={`https://nuxt.com${to}`}
      target="_blank"
      rel="noreferrer"
      className="not-prose inline-flex items-center gap-1 rounded-md bg-fd-muted px-2 py-0.5 font-mono text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
    >
      {to}
      <ExternalLink className="size-3" />
    </a>
  )
}

export function UButton(props: AnyProps) {
  const { href, external } = resolveHref(props.to)
  const cls =
    'not-prose inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/80'
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {props.children ?? (props.label as ReactNode)}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {props.children ?? (props.label as ReactNode)}
    </Link>
  )
}

export function UnknownComponent(props: AnyProps) {
  return <div>{props.children}</div>
}
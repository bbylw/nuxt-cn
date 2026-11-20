'use client'

import { useState } from 'react'
import { Pause, Play } from 'lucide-react'

function ModuleRow({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="marquee-mask overflow-hidden">
      <div className={`marquee flex w-max gap-3 ${reverse ? 'marquee-reverse' : ''}`}>
        {doubled.map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= items.length ? true : undefined}
            className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-4 py-2 font-mono text-sm text-fd-muted-foreground"
          >
            <span className="size-2 rounded-full bg-fd-primary" />
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}

/** 模块滚动展示：提供可见的暂停/播放控制（WCAG 2.2.2 Pause, Stop, Hide） */
export function ModuleMarquee({ rows }: { rows: string[][] }) {
  const [paused, setPaused] = useState(false)

  return (
    <div className={paused ? 'marquee-paused' : undefined}>
      <div className="space-y-3">
        {rows.map((items, i) => (
          <ModuleRow key={i} items={items} reverse={i % 2 === 1} />
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="inline-flex items-center gap-1.5 rounded-full border border-fd-border bg-fd-card px-3 py-1.5 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          {paused ? '继续滚动' : '暂停滚动'}
        </button>
      </div>
    </div>
  )
}
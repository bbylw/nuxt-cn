'use client'

import { useState } from 'react'

export interface CodeTab {
  label: string
  note: string
  html: string
}

export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-xl shadow-black/5">
      <div className="flex flex-wrap items-center gap-1 border-b border-fd-border bg-fd-muted/50 px-2 pt-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={`rounded-t-lg px-4 py-2 font-mono text-xs transition-colors ${
              i === active
                ? 'border border-b-0 border-fd-border bg-fd-card text-fd-foreground'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="landing-code overflow-x-auto p-4 text-[13px] leading-6 [&_pre]:bg-transparent!"
        dangerouslySetInnerHTML={{ __html: tabs[active].html }}
      />
      <p className="border-t border-fd-border px-4 py-3 text-xs text-fd-muted-foreground">
        {tabs[active].note}
      </p>
    </div>
  )
}
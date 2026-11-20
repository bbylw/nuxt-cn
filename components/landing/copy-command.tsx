'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(command).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
      }}
      className="group inline-flex items-center gap-3 rounded-lg border border-fd-border bg-fd-muted px-4 py-2.5 font-mono text-sm text-fd-muted-foreground transition-colors hover:border-fd-primary/50 hover:text-fd-foreground"
      aria-label="复制命令"
    >
      <span className="text-fd-primary">$</span>
      {command}
      {copied ? (
        <Check className="size-4 text-fd-primary" />
      ) : (
        <Copy className="size-4 opacity-50 transition-opacity group-hover:opacity-100" />
      )}
    </button>
  )
}
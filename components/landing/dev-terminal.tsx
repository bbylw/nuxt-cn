'use client'

import { useEffect, useRef, useState } from 'react'

const LINES: { text: string; className: string; delay: number }[] = [
  { text: '$ npx nuxt dev', className: 'text-zinc-100', delay: 400 },
  { text: 'Nuxt 4.2.0 (with Nitro 2.12.0, Vite 7.1.0 and Vue 3.5.0)', className: 'text-zinc-400', delay: 700 },
  { text: '  ➜ Local:    http://localhost:3000/', className: 'text-emerald-400', delay: 500 },
  { text: '  ➜ Network:  use --host to expose', className: 'text-zinc-500', delay: 250 },
  { text: '✔ Vite client built in 38ms', className: 'text-emerald-400', delay: 600 },
  { text: '✔ Vite server built in 16ms', className: 'text-emerald-400', delay: 350 },
  { text: '✔ Nuxt Nitro server built in 247ms', className: 'text-emerald-400', delay: 800 },
  { text: 'ℹ Vite server warmed up in 12ms', className: 'text-cyan-400', delay: 400 },
]

export function DevTerminal() {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(LINES.length)
      return
    }
    let timer: ReturnType<typeof setTimeout>
    let i = 0
    let started = false
    const step = () => {
      i += 1
      setCount(i)
      if (i < LINES.length) {
        timer = setTimeout(step, LINES[i].delay)
      }
    }
    // 进入视口才开始播放，且只播放一次：避免离屏定时器与持续性自动动画
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true
          timer = setTimeout(step, 500)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-emerald-500/10"
    >
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3">
        <span className="size-3 rounded-full bg-red-500/80" />
        <span className="size-3 rounded-full bg-yellow-500/80" />
        <span className="size-3 rounded-full bg-green-500/80" />
        <span className="ms-3 text-xs text-zinc-500">terminal — nuxt dev</span>
      </div>
      <div className="min-h-[248px] p-4 text-start font-mono text-[13px] leading-6">
        {LINES.slice(0, count).map((line, i) => (
          <div key={i} className={line.className}>
            {line.text}
          </div>
        ))}
        <span
          className={`inline-block h-4 w-2 bg-emerald-400 align-middle ${count < LINES.length ? 'animate-pulse' : ''}`}
        />
      </div>
    </div>
  )
}
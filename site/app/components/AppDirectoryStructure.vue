<script setup lang="ts">
import { siteData } from '~/data/site'

const entries = computed(() => siteData.directory.entries)

const badgeColor = (badge?: string) => {
  const map: Record<string, string> = {
    '核心': 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    '路由': 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300',
    '自动导入': 'border-violet-400/30 bg-violet-400/10 text-violet-300',
    '入口': 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    '全栈': 'border-rose-400/30 bg-rose-400/10 text-rose-300',
    '配置': 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  }
  return map[badge || ''] || 'border-white/10 bg-white/5 text-gray-400'
}
</script>

<template>
  <section id="directory" class="relative py-24 sm:py-32 border-t border-white/5">
    <div class="mx-auto max-w-7xl px-6">
      <div class="reveal max-w-2xl mb-16">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">/ directory structure</span>
        <h2 class="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          {{ siteData.directory.title }}
        </h2>
        <p class="mt-4 text-gray-400 text-lg">{{ siteData.directory.subtitle }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="(e, i) in entries"
          :key="e.name"
          class="reveal group flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/15 hover:bg-white/[0.04] transition-colors"
          :style="{ '--reveal-delay': `${Math.min(i * 30, 400)}ms` }"
        >
          <UIcon name="i-lucide-folder" class="mt-0.5 h-4 w-4 text-emerald-400/70 shrink-0 group-hover:text-emerald-400 transition-colors" />
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <code class="font-mono text-[13px] text-gray-200">{{ e.name }}</code>
              <span
                v-if="e.badge"
                class="rounded-full border px-1.5 py-px text-[9px] font-medium uppercase tracking-wider"
                :class="badgeColor(e.badge)"
              >
                {{ e.badge }}
              </span>
            </div>
            <p class="mt-1 text-xs text-gray-500 leading-relaxed">{{ e.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

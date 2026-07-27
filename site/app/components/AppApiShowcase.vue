<script setup lang="ts">
import { siteData } from '~/data/site'

const tabs = computed(() => [
  { key: 'components', label: '组件', items: siteData.apiShowcase.components, accent: 'emerald' },
  { key: 'composables', label: 'Composables', items: siteData.apiShowcase.composables, accent: 'cyan' },
  { key: 'utils', label: '工具函数', items: siteData.apiShowcase.utils, accent: 'violet' },
])

const active = ref('components')
const accentMap: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  emerald: { text: 'text-emerald-300', border: 'border-emerald-400/30', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  cyan: { text: 'text-cyan-300', border: 'border-cyan-400/30', bg: 'bg-cyan-400/10', dot: 'bg-cyan-400' },
  violet: { text: 'text-violet-300', border: 'border-violet-400/30', bg: 'bg-violet-400/10', dot: 'bg-violet-400' },
}

const current = computed(() => tabs.value.find((t) => t.key === active.value)!)
</script>

<template>
  <section id="api" class="relative py-24 sm:py-32 border-t border-white/5">
    <div class="mx-auto max-w-7xl px-6">
      <div class="reveal max-w-2xl mb-12">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">/ api</span>
        <h2 class="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          {{ siteData.apiShowcase.title }}
        </h2>
        <p class="mt-4 text-gray-400 text-lg">{{ siteData.apiShowcase.subtitle }}</p>
      </div>

      <!-- Tabs -->
      <div class="reveal flex flex-wrap gap-2 mb-8">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="rounded-full px-4 py-2 text-sm font-medium transition-[color,background-color,border-color]"
          :class="active === t.key
            ? `${accentMap[t.accent].bg} ${accentMap[t.accent].border} ${accentMap[t.accent].text} border`
            : 'border border-white/5 text-gray-400 hover:text-white hover:border-white/15'"
          @click="active = t.key"
        >
          {{ t.label }}
          <span class="ml-1.5 text-xs opacity-60">{{ t.items.length }}</span>
        </button>
      </div>

      <!-- 内容 -->
      <Transition mode="out-in"
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div :key="active" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="(item, i) in current.items"
            :key="item.name"
            class="reveal group rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-white/15 hover:bg-white/[0.04] transition-colors"
            :style="{ '--reveal-delay': `${i * 40}ms` }"
          >
            <div class="flex items-center gap-2">
              <span class="inline-flex h-1.5 w-1.5 rounded-full" :class="accentMap[current.accent].dot" />
              <code class="font-mono text-[13px] font-medium text-white">{{ item.name }}</code>
            </div>
            <p class="mt-2 text-xs text-gray-400 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

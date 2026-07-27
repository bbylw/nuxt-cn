<script setup lang="ts">
import { siteData } from '~/data/site'
</script>

<template>
  <section id="concepts" class="relative py-24 sm:py-32 border-t border-white/5">
    <div class="mx-auto max-w-7xl px-6">
      <div class="reveal max-w-2xl mb-16">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">/ concepts</span>
        <h2 class="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          核心概念
        </h2>
        <p class="mt-4 text-gray-400 text-lg leading-relaxed">
          理解 Nuxt 的能力与每个包的职责范围，全面掌握从渲染到部署的完整链路。
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="(c, i) in siteData.concepts"
          :key="c.title"
          :to="`/docs/guide/concepts/${c.href}`"
          class="reveal group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03] transition-[border-color,background-color]"
          :style="{ '--reveal-delay': `${i * 50}ms` }"
        >
          <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-emerald-300 group-hover:bg-emerald-400/10 group-hover:border-emerald-400/30 transition-colors">
            <UIcon :name="c.icon" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 font-display text-base font-semibold text-white">{{ c.title }}</h3>
          <p class="mt-1.5 text-xs text-gray-400 leading-relaxed">{{ c.desc }}</p>
          <UIcon name="i-lucide-arrow-up-right" class="absolute top-5 right-5 h-4 w-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform]" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

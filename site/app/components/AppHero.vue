<script setup lang="ts">
import { siteData } from '~/data/site'

const copied = ref(false)

function copyCommand() {
  navigator.clipboard.writeText('npm create nuxt@latest my-app')
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <section class="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
    <!-- 背景层 -->
    <div class="absolute inset-0 bg-grid opacity-60" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#020420]/40 to-[#020420]" />

    <!-- 光晕 -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <div class="relative h-[480px] w-[480px] sm:h-[640px] sm:w-[640px]">
        <div class="absolute inset-0 rounded-full bg-emerald-500/20 blur-[120px]" />
        <div class="absolute inset-12 rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>
    </div>

    <!-- 旋转光弧 -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
      <div class="animate-spin-slow h-[520px] w-[520px] sm:h-[720px] sm:w-[720px] rounded-full border border-emerald-400/20" />
    </div>

    <div class="relative mx-auto max-w-5xl px-6 text-center">
      <!-- Badge -->
      <div class="reveal flex justify-center mb-8">
        <a
          href="https://nuxt.com/blog"
          target="_blank"
          class="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-300 hover:border-emerald-400/40 hover:bg-emerald-400/5 transition-colors"
        >
          <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {{ siteData.hero.badge }}
          <UIcon name="i-lucide-arrow-right" class="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <!-- 标题 -->
      <h1 class="reveal font-display text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] [text-wrap:balance]" style="--reveal-delay: 80ms">
        <span class="text-white">{{ siteData.hero.title }}</span>
        <span class="text-gradient">{{ siteData.hero.titleAccent }}</span>
      </h1>

      <!-- 副标题 -->
      <p class="reveal mx-auto mt-7 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed" style="--reveal-delay: 160ms">
        {{ siteData.hero.subtitle }}
      </p>

      <!-- CTA -->
      <div class="reveal mt-10 flex flex-wrap items-center justify-center gap-3" style="--reveal-delay: 240ms">
        <UButton
          :to="siteData.hero.primaryCta.to"
          size="xl"
          class="bg-emerald-400 hover:bg-emerald-300 text-[#020420] font-semibold px-7"
          trailing-icon="i-lucide-arrow-right"
        >
          {{ siteData.hero.primaryCta.label }}
        </UButton>
        <UButton
          :to="siteData.hero.secondaryCta.to"
          target="_blank"
          size="xl"
          variant="outline"
          color="neutral"
          class="border-white/15 hover:border-white/30"
          icon="i-lucide-book-open"
        >
          {{ siteData.hero.secondaryCta.label }}
        </UButton>
      </div>

      <!-- 代码块 -->
      <div class="reveal mx-auto mt-14 max-w-xl" style="--reveal-delay: 320ms">
        <div class="relative rounded-2xl border border-white/10 bg-[#0a0a2e]/80 backdrop-blur-sm overflow-hidden glow-green" role="region" aria-label="安装命令">
          <div class="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
            <span class="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400/70" aria-hidden="true" />
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
            <span class="ml-3 text-xs text-gray-500 font-mono">terminal</span>
            <button
              class="ml-auto inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-gray-400 hover:text-emerald-300 hover:bg-white/5 transition-colors"
              :aria-label="copied ? '已复制' : '复制命令'"
              @click="copyCommand"
            >
              <UIcon :name="copied ? 'i-lucide-check' : 'i-lucide-copy'" class="h-3.5 w-3.5" aria-hidden="true" />
              {{ copied ? '已复制' : '复制' }}
            </button>
          </div>
          <div class="px-5 py-4 font-mono text-sm text-left">
            <span class="text-gray-500">$</span>
            <span class="ml-2" v-html="siteData.hero.code" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

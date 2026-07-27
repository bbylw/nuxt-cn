<script setup lang="ts">
import { siteData } from '~/data/site'
</script>

<template>
  <section id="getting-started" class="relative py-24 sm:py-32 border-t border-white/5">
    <div class="mx-auto max-w-7xl px-6">
      <div class="reveal max-w-2xl mb-16">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">/ getting started</span>
        <h2 class="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          {{ siteData.gettingStarted.title }}
        </h2>
        <p class="mt-4 text-gray-400 text-lg">{{ siteData.gettingStarted.subtitle }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          v-for="(step, i) in siteData.gettingStarted.steps"
          :key="i"
          class="reveal gradient-border rounded-2xl p-7"
          :style="{ '--reveal-delay': `${i * 80}ms` }"
        >
          <div class="flex items-start gap-4">
            <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 border border-emerald-400/30 font-mono text-sm text-emerald-300">
              {{ i + 1 }}
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="font-display text-lg font-semibold text-white">{{ step.title }}</h3>
              <p class="mt-1.5 text-sm text-gray-400 leading-relaxed">{{ step.desc }}</p>

              <div v-if="step.code" class="mt-4 rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                <div class="flex items-center justify-between px-3 py-2 border-b border-white/5">
                  <span class="text-[10px] font-mono uppercase tracking-wider text-gray-500">{{ step.code.lang }}</span>
                  <UIcon name="i-lucide-terminal" class="h-3.5 w-3.5 text-gray-600" />
                </div>
                <pre class="px-4 py-3 font-mono text-[13px] text-emerald-200/90 overflow-x-auto leading-relaxed"><code>{{ step.code.content }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

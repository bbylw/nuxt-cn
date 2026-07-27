<script setup lang="ts">
import { siteData } from '~/data/site'

const features = computed(() => siteData.features)

const spanClass = (span?: string) => {
  if (span === 'wide') return 'sm:col-span-2'
  if (span === 'tall') return 'sm:row-span-2'
  return ''
}
</script>

<template>
  <section id="features" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6">
      <!-- 标题 -->
      <div class="reveal max-w-2xl mb-16">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">/ features</span>
        <h2 class="mt-3 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-white">
          自动化与约定
        </h2>
        <p class="mt-4 text-gray-400 text-lg leading-relaxed">
          Nuxt 通过约定和有主见的目录结构自动完成重复性任务，让你专注于功能开发。你仍可通过配置文件自定义和覆盖默认行为。
        </p>
      </div>

      <!-- Bento 网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]">
        <article
          v-for="(f, i) in features"
          :key="f.title"
          class="reveal gradient-border rounded-2xl p-6 group transition-[border-color,background-color] duration-300"
          :class="spanClass(f.span)"
          :style="{ '--reveal-delay': `${i * 60}ms` }"
        >
          <div class="flex flex-col h-full">
            <div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 group-hover:scale-110 group-hover:bg-emerald-400/15 transition-transform">
              <UIcon :name="f.icon" class="h-5 w-5" />
            </div>
            <h3 class="mt-5 font-display text-xl font-semibold text-white">{{ f.title }}</h3>
            <p class="mt-2 text-sm text-gray-400 leading-relaxed">{{ f.desc }}</p>

            <!-- tall 卡片底部装饰 -->
            <template v-if="f.span === 'tall'">
              <div class="mt-auto pt-6">
                <div class="rounded-lg border border-white/5 bg-black/30 p-3 font-mono text-[11px] text-gray-500">
                  <div>app/pages/</div>
                  <div class="pl-3">├─ index.vue &nbsp;<span class="text-emerald-400">→ /</span></div>
                  <div class="pl-3">├─ about.vue &nbsp;<span class="text-emerald-400">→ /about</span></div>
                  <div class="pl-3">└─ posts/[id].vue <span class="text-emerald-400">→ /posts/:id</span></div>
                </div>
              </div>
            </template>

            <!-- wide 卡片底部装饰 -->
            <template v-if="f.span === 'wide'">
              <div class="mt-auto pt-5 flex flex-wrap gap-2">
                <span v-for="t in ['composables', 'components', 'utils']" :key="t"
                  class="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[11px] font-mono text-gray-400">
                  {{ t }}/
                </span>
                <span class="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[11px] font-mono text-emerald-300">
                  auto-imported
                </span>
              </div>
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

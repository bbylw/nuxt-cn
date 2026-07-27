<script setup lang="ts">
import { siteData } from '~/data/site'

const items = computed(() => [...siteData.marquee, ...siteData.marquee])
</script>

<template>
  <section class="relative py-10 border-y border-white/5 bg-white/[0.015]">
    <div class="mask-fade-x overflow-hidden">
      <div class="marquee-track flex items-center gap-8 whitespace-nowrap">
        <div
          v-for="(item, i) in items"
          :key="i"
          class="flex items-center gap-3 text-gray-400"
        >
          <span class="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400/60" />
          <span class="text-sm font-medium tracking-wide">{{ item }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

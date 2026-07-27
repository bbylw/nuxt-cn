<script setup lang="ts">
import { siteData } from '~/data/site'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="relative border-t border-white/5 bg-[#020420]">
    <div class="mx-auto max-w-7xl px-6 py-16">
      <div class="grid grid-cols-2 md:grid-cols-5 gap-10">
        <!-- 品牌 -->
        <div class="col-span-2">
          <div class="flex items-center gap-2.5">
            <svg viewBox="0 0 256 221" class="h-6 w-6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z" fill="#00DC82"/>
            </svg>
            <span class="font-display text-base font-semibold">{{ siteData.brand.name }}</span>
          </div>
          <p class="mt-4 max-w-sm text-sm text-gray-500 leading-relaxed">
            {{ siteData.footer.desc }}
          </p>
          <div class="mt-5 flex items-center gap-2">
            <UButton
              v-for="s in [
                { icon: 'i-simple-icons-github', to: 'https://go.nuxt.com/github', label: 'GitHub' },
                { icon: 'i-simple-icons-discord', to: 'https://go.nuxt.com/discord', label: 'Discord' },
                { icon: 'i-simple-icons-x', to: 'https://go.nuxt.com/x', label: 'X (Twitter)' },
                { icon: 'i-simple-icons-bluesky', to: 'https://go.nuxt.com/bluesky', label: 'Bluesky' },
              ]"
              :key="s.to"
              :to="s.to"
              target="_blank"
              color="neutral"
              variant="ghost"
              size="sm"
              :icon="s.icon"
              :aria-label="s.label"
              class="text-gray-500 hover:text-emerald-300"
            />
          </div>
        </div>

        <!-- 链接列 -->
        <div v-for="col in siteData.footer.columns" :key="col.title">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-gray-400">{{ col.title }}</h4>
          <ul class="mt-4 space-y-2.5">
            <li v-for="link in col.links" :key="link.to">
              <a
                :href="link.to"
                target="_blank"
                class="text-sm text-gray-500 hover:text-emerald-300 transition-colors"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-600">
          MIT License · 基于 <a href="https://nuxt.com/docs" target="_blank" class="text-gray-500 hover:text-emerald-300">Nuxt 官方文档</a> 构建
        </p>
        <p class="text-xs text-gray-600 font-mono">
          Nuxt {{ siteData.brand.version }} · Vue 3.5 · Vite 8
        </p>
      </div>
    </div>
  </footer>
</template>

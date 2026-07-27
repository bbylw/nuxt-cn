<script setup lang="ts">
import { siteData } from '~/data/site'

const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const mobileOpen = ref(false)
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300"
    :class="scrolled ? 'backdrop-blur-xl bg-[#020420]/70 border-b border-white/5' : 'bg-transparent'"
  >
    <div class="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <span class="relative inline-flex h-8 w-8 items-center justify-center">
          <svg viewBox="0 0 256 221" class="h-7 w-7" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36Z" fill="#00DC82"/>
            <path d="M0 0l128 220.8L256 0h-51.2L128 132.48L50.56 0H0Z" fill="#00DC82" opacity="0.55"/>
          </svg>
        </span>
        <span class="font-display text-lg font-semibold tracking-tight">{{ siteData.brand.name }}</span>
        <span class="hidden sm:inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          {{ siteData.brand.version }}
        </span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-1">
        <NuxtLink
          v-for="link in siteData.nav"
          :key="link.to"
          :to="link.to"
          class="px-3.5 py-2 text-sm text-gray-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2">
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/nuxt"
          target="_blank"
          class="hidden sm:inline-flex"
          aria-label="GitHub"
        />
        <UButton
          to="/#getting-started"
          color="primary"
          class="bg-emerald-400 hover:bg-emerald-300 text-[#020420] font-medium"
        >
          开始使用
        </UButton>
        <button
          class="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-white/5"
          @click="mobileOpen = !mobileOpen"
          aria-label="菜单"
        >
          <UIcon :name="mobileOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="h-5 w-5" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="mobileOpen" class="md:hidden border-t border-white/5 bg-[#020420]/95 backdrop-blur-xl">
        <nav class="px-6 py-4 flex flex-col gap-1">
          <NuxtLink
            v-for="link in siteData.nav"
            :key="link.to"
            :to="link.to"
            class="px-3 py-2.5 text-sm text-gray-300 hover:text-white rounded-lg hover:bg-white/5"
            @click="mobileOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>

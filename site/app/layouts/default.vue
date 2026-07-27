<script setup lang="ts">
// 触发滚动揭示动画（基于 IntersectionObserver，遵循 prefers-reduced-motion）
useScrollReveal()
</script>

<template>
  <div class="relative min-h-screen overflow-hidden">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-400 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#020420]"
    >
      跳到主要内容
    </a>
    <AppNavbar />
    <main id="main-content">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

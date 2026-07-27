<script setup lang="ts">
useHead({
  bodyAttrs: { class: 'bg-[#020420] text-gray-200' },
})

useSeoMeta({
  title: 'Nuxt 中文 · 直观的 Vue 全栈框架',
  ogTitle: 'Nuxt 中文 · 直观的 Vue 全栈框架',
  description: 'Nuxt 是一个免费且开源的框架，以直观且可扩展的方式，借助 Vue.js 创建类型安全、性能优异、可用于生产环境的全栈 Web 应用和网站。',
  ogDescription: '服务端渲染、自动路由、数据获取、零配置 TypeScript、300+ 模块生态。',
  ogImage: 'https://nuxt.com/design/0/logo.svg',
})
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

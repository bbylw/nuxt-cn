<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

function handleError() {
  clearError({ redirect: '/' })
}

const is404 = computed(() => props.error?.statusCode === 404)
</script>

<template>
  <div class="min-h-screen bg-[#020420] text-gray-200 flex items-center justify-center px-6">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
    <div class="relative text-center max-w-md">
      <p class="font-mono text-7xl font-semibold text-gradient">{{ error.statusCode }}</p>
      <h1 class="mt-4 font-display text-2xl font-semibold text-white">
        {{ is404 ? '页面未找到' : '出错了' }}
      </h1>
      <p class="mt-3 text-sm text-gray-400">
        {{ is404 ? '你访问的页面不存在或已被移动。' : (error.message || '服务器遇到了意外错误。') }}
      </p>
      <UButton
        class="mt-8 bg-emerald-400 hover:bg-emerald-300 text-[#020420] font-medium"
        icon="i-lucide-home"
        @click="handleError"
      >
        返回首页
      </UButton>
    </div>
  </div>
</template>

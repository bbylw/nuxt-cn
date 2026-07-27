<script setup lang="ts">
// MDC 组件：:::steps
// 步骤容器，用于文档中将内容渲染为有序步骤列表
</script>

<template>
  <ol class="my-5 space-y-4 border-l border-white/10 pl-6">
    <li class="relative">
      <span class="absolute -left-[31px] top-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/30 bg-[#020420] font-mono text-[11px] text-emerald-400">
        <slot name="before" />
      </span>
      <slot />
    </li>
  </ol>
</template>

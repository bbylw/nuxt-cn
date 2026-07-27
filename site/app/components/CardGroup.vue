<script setup lang="ts">
// MDC 组件：:::card-group{class="..."}
// 卡片组容器，用于文档中将多个卡片排列成网格
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="my-5 grid grid-cols-1 gap-4 sm:grid-cols-2" :class="$props.class">
    <slot />
  </div>
</template>

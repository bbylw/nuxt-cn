<script setup lang="ts">
// MDC 容器：:::important
// 映射到 Callout 组件的 warning 类型（高优先级提示）
</script>

<template>
  <Callout type="warning" icon="i-lucide-circle-alert">
    <slot />
  </Callout>
</template>

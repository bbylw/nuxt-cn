<script setup lang="ts">
// MDC 组件：::link-example{to="..." target="..."}
// 示例链接，用于文档中链接到示例代码
const props = withDefaults(defineProps<{
  to?: string
  target?: string
}>(), {
  target: '_blank',
})

const isExternal = computed(() => props.to?.startsWith('http') ?? false)

const resolvedTo = computed(() => {
  if (!props.to) return props.to
  return props.to.replace(/\/docs\/4\.x\//g, '/docs/')
})
</script>

<template>
  <NuxtLink
    v-if="resolvedTo"
    :to="isExternal ? undefined : resolvedTo"
    :href="isExternal ? resolvedTo : undefined"
    :target="isExternal ? target : undefined"
    class="my-3 inline-flex items-center gap-2 rounded-md border border-violet-400/20 bg-violet-400/[0.04] px-3 py-1.5 text-xs text-violet-200/90 transition-colors hover:border-violet-400/40 hover:bg-violet-400/[0.08] no-underline"
  >
    <UIcon name="i-lucide-file-code-2" class="h-3.5 w-3.5 shrink-0 text-violet-400" />
    <span><slot>查看示例</slot></span>
  </NuxtLink>
</template>

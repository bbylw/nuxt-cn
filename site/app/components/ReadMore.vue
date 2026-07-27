<script setup lang="ts">
// MDC 组件：:::read-more{to="..." icon="..." title="..." target="..."}
// 阅读更多链接卡片，用于文档中引导用户阅读相关内容
const props = withDefaults(defineProps<{
  to?: string
  icon?: string
  title?: string
  target?: string
}>(), {
  icon: 'i-lucide-book-open',
  target: '_self',
})

const isExternal = computed(() => props.to?.startsWith('http') ?? false)

// 重写 /docs/4.x/ 链接为本站路径
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
    class="my-4 flex items-center gap-2.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] px-4 py-2.5 text-sm text-emerald-200/90 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/[0.08] no-underline"
  >
    <UIcon :name="icon" class="h-4 w-4 shrink-0 text-emerald-400" />
    <span class="min-w-0 flex-1">
      <span v-if="title" class="font-medium text-white">{{ title }}</span>
      <span v-if="title" class="mx-1.5 text-gray-500">·</span>
      <slot>阅读更多</slot>
    </span>
    <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5 shrink-0 opacity-60" />
  </NuxtLink>
</template>

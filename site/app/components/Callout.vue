<script setup lang="ts">
// MDC 组件：:::callout{icon="..." type="..."}
// 标注/提示框容器，用于文档中突出显示重要信息
const props = withDefaults(defineProps<{
  icon?: string
  type?: 'info' | 'warning' | 'success' | 'error' | string
}>(), {
  icon: 'i-lucide-info',
  type: 'info',
})

const styles = computed(() => {
  const map: Record<string, { border: string; bg: string; text: string; icon: string }> = {
    info: { border: 'border-sky-400/30', bg: 'bg-sky-400/[0.05]', text: 'text-sky-200', icon: 'text-sky-400' },
    warning: { border: 'border-amber-400/30', bg: 'bg-amber-400/[0.05]', text: 'text-amber-200', icon: 'text-amber-400' },
    success: { border: 'border-emerald-400/30', bg: 'bg-emerald-400/[0.05]', text: 'text-emerald-200', icon: 'text-emerald-400' },
    error: { border: 'border-rose-400/30', bg: 'bg-rose-400/[0.05]', text: 'text-rose-200', icon: 'text-rose-400' },
  }
  return map[props.type] || map.info
})
</script>

<template>
  <div class="my-4 flex gap-3 rounded-lg border px-4 py-3" :class="[styles.border, styles.bg]">
    <UIcon :name="icon" class="mt-0.5 h-5 w-5 shrink-0" :class="styles.icon" />
    <div class="min-w-0 flex-1 text-sm leading-relaxed" :class="styles.text">
      <slot />
    </div>
  </div>
</template>

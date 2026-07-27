<script setup lang="ts">
// MDC 容器：:::code-group
// 将多个代码块组织为带标签页的切换面板
const slots = useSlots()

const tabs = computed(() => {
  const children = slots.default?.() || []
  // 从 VNode 中提取 filename / label 信息
  return children.flatMap((node: any) => {
    if (node.type?.tag === 'pre' || node.type?.tag === 'code') {
      return [{ label: node.props?.filename || node.props?.label || 'code', vnode: node }]
    }
    // 嵌套在 fragment 中的情况
    if (Array.isArray(node.children)) {
      return node.children
        .filter((c: any) => c.type?.tag === 'pre' || c.type?.tag === 'code')
        .map((c: any) => ({ label: c.props?.filename || c.props?.label || 'code', vnode: c }))
    }
    return [{ label: node.props?.filename || node.props?.label || 'code', vnode: node }]
  })
})

const active = ref(0)
</script>

<template>
  <div class="my-4 rounded-xl border border-white/8 overflow-hidden">
    <!-- 标签栏 -->
    <div class="flex items-center gap-0.5 border-b border-white/8 bg-white/[0.03] px-2 pt-2 overflow-x-auto">
      <button
        v-for="(tab, i) in tabs"
        :key="i"
        class="px-3 py-1.5 text-xs font-mono rounded-t-md transition-colors"
        :class="active === i
          ? 'bg-[#0a0a2e] text-emerald-300 border border-b-0 border-white/8'
          : 'text-gray-500 hover:text-gray-300'"
        @click="active = i"
      >
        {{ tab.label }}
      </button>
    </div>
    <!-- 内容区 -->
    <div class="bg-[#0a0a2e] [&>pre]:!my-0 [&>pre]:!rounded-none [&>pre]:!border-0">
      <template v-for="(tab, i) in tabs" :key="i">
        <component :is="tab.vnode" v-show="active === i" />
      </template>
    </div>
  </div>
</template>

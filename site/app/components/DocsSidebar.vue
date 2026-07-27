<script setup lang="ts">
interface SidebarItem {
  path: string
  title: string
}
interface SidebarCategory {
  key: string
  label: string
  items: SidebarItem[]
}

const props = defineProps<{
  nav: SidebarCategory[]
  currentPath: string
}>()

const emit = defineEmits<{
  navigate: []
}>()

const categoryIcons: Record<string, string> = {
  'getting-started': 'i-lucide-rocket',
  'directory-structure': 'i-lucide-folder-tree',
  'guide': 'i-lucide-book-open',
  'api': 'i-lucide-code-2',
  'community': 'i-lucide-users',
  'bridge': 'i-lucide-git-merge',
  'migration': 'i-lucide-arrow-right-circle',
  'errors': 'i-lucide-alert-octagon',
}

// 默认展开当前路径所在分类
const expanded = ref<Record<string, boolean>>({})

watchEffect(() => {
  props.nav.forEach((cat) => {
    if (cat.items.some((i) => i.path === props.currentPath)) {
      expanded.value[cat.key] = true
    }
  })
})

function toggle(key: string) {
  expanded.value[key] = !expanded.value[key]
}

function isActive(path: string): boolean {
  return props.currentPath === path
}
</script>

<template>
  <nav class="space-y-1">
    <NuxtLink
      to="/docs"
      class="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-emerald-300 rounded-lg hover:bg-white/5 transition-colors"
    >
      <UIcon name="i-lucide-home" class="h-4 w-4" />
      文档首页
    </NuxtLink>

    <div class="h-px bg-white/5 my-2" />

    <div v-for="cat in nav" :key="cat.key">
      <button
        class="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        :aria-expanded="!!expanded[cat.key]"
        @click="toggle(cat.key)"
      >
        <UIcon :name="categoryIcons[cat.key] || 'i-lucide-file-text'" class="h-4 w-4 text-emerald-400/70" aria-hidden="true" />
        <span class="flex-1 text-left">{{ cat.label }}</span>
        <span class="text-[10px] text-gray-500 font-mono">{{ cat.items.length }}</span>
        <UIcon
          :name="expanded[cat.key] ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="h-3.5 w-3.5 text-gray-500"
          aria-hidden="true"
        />
      </button>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <div v-if="expanded[cat.key]" class="ml-4 mt-0.5 space-y-0.5 border-l border-white/5 pl-2">
          <NuxtLink
            v-for="item in cat.items"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-1.5 text-[13px] rounded-md border transition-colors"
            :class="isActive(item.path)
              ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20'
              : 'text-gray-500 hover:text-gray-200 hover:bg-white/5 border-transparent'"
            @click="emit('navigate')"
          >
            {{ item.title }}
          </NuxtLink>
        </div>
      </Transition>
    </div>
  </nav>
</template>

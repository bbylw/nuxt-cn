<script setup lang="ts">
// 获取所有文档（扁平列表），手动构建分类
const { data: docs } = await useAsyncData('docs-all', () =>
  queryCollection('docs').select('path', 'title', 'description').all(),
)

const categoryMeta: Record<string, { label: string; icon: string; desc: string }> = {
  'getting-started': { label: '快速开始', icon: 'i-lucide-rocket', desc: '从零开始搭建你的第一个 Nuxt 应用，涵盖安装、配置、路由、SEO 等基础主题。' },
  'directory-structure': { label: '目录结构', icon: 'i-lucide-folder-tree', desc: '了解 Nuxt 的约定式目录结构，包括 pages、components、composables、server 等目录。' },
  'guide': { label: '指南', icon: 'i-lucide-book-open', desc: '深入理解 Nuxt 的核心概念、最佳实践、模块系统与进阶技巧。' },
  'api': { label: 'API 参考', icon: 'i-lucide-code-2', desc: '完整的 API 文档，包含组件、composables、工具函数、命令与 Kit 工具集。' },
  'community': { label: '社区', icon: 'i-lucide-users', desc: '获取帮助、报告问题、参与贡献，加入 Nuxt 社区生态。' },
  'bridge': { label: 'Bridge', icon: 'i-lucide-git-merge', desc: '从 Nuxt 2 平滑升级到 Nuxt 3 的桥接方案。' },
  'migration': { label: '迁移', icon: 'i-lucide-arrow-right-circle', desc: '从旧版本迁移到最新 Nuxt 的完整指南。' },
  'errors': { label: '错误码', icon: 'i-lucide-alert-octagon', desc: 'Nuxt 运行时可能出现的错误码说明与排查方法。' },
}

interface DocItem {
  path: string
  title: string
  description?: string
}

const categories = computed(() => {
  if (!docs.value || !Array.isArray(docs.value)) return []
  const map = new Map<string, { key: string; title: string; icon: string; desc: string; items: DocItem[] }>()

  for (const doc of docs.value as DocItem[]) {
    // 路径形如 /docs/getting-started/introduction
    // 至少需要两个段（分类 + 文档名），排除 /docs/readme 这类根级文档
    const segs = doc.path.replace(/^\/docs\//, '').split('/').filter(Boolean)
    if (segs.length < 2) continue
    const rawCat = segs[0]
    const key = rawCat.replace(/^\d+\./, '')

    if (!map.has(key)) {
      const meta = categoryMeta[key] || { label: rawCat, icon: 'i-lucide-file-text', desc: '' }
      map.set(key, { key, title: meta.label, icon: meta.icon, desc: meta.desc, items: [] })
    }
    map.get(key)!.items.push(doc)
  }

  return Array.from(map.values())
    .map((cat) => ({
      ...cat,
      count: cat.items.length,
      // 取前 5 项作为预览
      preview: cat.items.slice(0, 5),
      // 第一个文档的路径作为入口
      firstPath: cat.items[0]?.path || `/docs`,
    }))
    .sort((a, b) => {
      const order = ['getting-started', 'directory-structure', 'guide', 'api', 'community', 'migration', 'bridge', 'errors']
      return order.indexOf(a.key) - order.indexOf(b.key)
    })
})

useSeoMeta({
  title: '文档 · Nuxt 中文',
  description: 'Nuxt 完整中文文档，涵盖快速开始、目录结构、核心概念、API 参考与社区资源。',
})
</script>

<template>
  <div class="relative pt-32 pb-24">
    <!-- 背景 -->
    <div class="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

    <div class="relative mx-auto max-w-7xl px-6">
      <!-- 标题 -->
      <div class="text-center mb-16">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400">/ documentation</span>
        <h1 class="mt-3 font-display text-5xl sm:text-6xl font-semibold tracking-tight text-white">
          Nuxt <span class="text-gradient">文档</span>
        </h1>
        <p class="mx-auto mt-5 max-w-2xl text-gray-400 text-lg leading-relaxed">
          完整的中文文档，涵盖从入门到高级的所有主题。基于官方文档翻译整理。
        </p>
      </div>

      <!-- 分类卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <NuxtLink
          v-for="(cat, i) in categories"
          :key="cat.key"
          :to="cat.firstPath"
          class="reveal group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03] transition-[border-color,background-color]"
          :style="{ '--reveal-delay': `${i * 60}ms` }"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 group-hover:scale-110 transition-transform">
              <UIcon :name="cat.icon" class="h-5 w-5" />
            </div>
            <span class="text-xs font-mono text-gray-600">{{ cat.count }} 篇</span>
          </div>
          <h3 class="font-display text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
            {{ cat.title }}
          </h3>
          <p class="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">{{ cat.desc }}</p>

          <!-- 子项预览 -->
          <ul v-if="cat.preview.length" class="mt-4 space-y-1.5 pt-4 border-t border-white/5">
            <li v-for="item in cat.preview" :key="item.path">
              <span class="flex items-center gap-1.5 text-xs text-gray-500 group-hover:text-gray-400">
                <UIcon name="i-lucide-file-text" class="h-3 w-3 shrink-0" />
                <span class="truncate">{{ item.title }}</span>
              </span>
            </li>
            <li v-if="cat.count > 5" class="text-xs text-emerald-400/70 pt-1">
              + {{ cat.count - 5 }} 篇更多
            </li>
          </ul>

          <UIcon
            name="i-lucide-arrow-up-right"
            class="absolute top-5 right-5 h-4 w-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-[color,transform]"
            aria-hidden="true"
          />
        </NuxtLink>
      </div>

      <!-- 底部提示 -->
      <div class="mt-16 text-center">
        <p class="text-sm text-gray-500">
          想要查阅英文原版文档？
          <a
            href="https://nuxt.com/docs"
            target="_blank"
            class="text-emerald-300 hover:text-emerald-200 underline underline-offset-2"
          >
            访问 nuxt.com/docs
            <UIcon name="i-lucide-external-link" class="inline h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

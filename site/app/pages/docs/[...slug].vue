<script setup lang="ts">
definePageMeta({
  middleware: ['docs-normalize'],
})

const route = useRoute()

// 路径已由 docs-normalize 中间件规范化（去掉数字前缀）
// 此处直接使用 route.path
const path = computed(() => route.path)

// 先获取所有文档扁平列表（用于侧边栏、上下页导航、分类路径重定向）
const { data: allDocs } = await useAsyncData('docs-all-flat', () =>
  queryCollection('docs').select('path', 'title', 'description').all(),
)

// 获取当前文档（首次加载 / SSR）
const { data: doc } = await useAsyncData(`docs-${path.value}`, () =>
  queryCollection('docs').path(path.value).first(),
)

// 文档不存在时的处理：分类路径重定向或 404
if (!doc.value) {
  const segs = path.value.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
  let redirected = false
  if (segs.length === 1 && allDocs.value && Array.isArray(allDocs.value)) {
    const catDocs = (allDocs.value as { path: string }[])
      .filter((d) => d.path.startsWith(`/docs/${segs[0]}/`))
      .sort((a, b) => a.path.localeCompare(b.path))
    if (catDocs.length > 0) {
      await navigateTo(catDocs[0].path, { redirectCode: 301, replace: true })
      redirected = true
    }
  }
  if (!redirected) {
    throw createError({
      statusCode: 404,
      statusMessage: '文档未找到',
      fatal: true,
    })
  }
}

// 客户端导航：路径变化时重新获取文档内容
watch(path, async (newPath) => {
  const result = await queryCollection('docs').path(newPath).first()
  if (result) {
    doc.value = result
  }
})

// 重写文档正文中的内部链接
// 1. 原始 markdown 中使用了 /docs/4.x/xxx 形式的链接（指向 Nuxt 官方文档）
//    本站已集成文档，需重写为本站路径 /docs/xxx
// 2. /blog/xxx 这类指向 Nuxt 官方博客的链接，本站没有对应路由，
//    重写为外部链接 https://nuxt.com/blog/xxx，避免 vue-router 警告
function rewriteDocLinks() {
  nextTick(() => {
    const links = document.querySelectorAll<HTMLAnchorElement>('.docs-content a[href]')
    links.forEach((a) => {
      const href = a.getAttribute('href')
      if (!href) return
      if (href.includes('/docs/4.x/')) {
        a.setAttribute('href', href.replace('/docs/4.x/', '/docs/'))
      } else if (href.startsWith('/blog/')) {
        const external = 'https://nuxt.com' + href
        a.setAttribute('href', external)
        a.setAttribute('target', '_blank')
        a.setAttribute('rel', 'noopener noreferrer')
      }
    })
  })
}

onMounted(rewriteDocLinks)
watch(path, rewriteDocLinks)

useSeoMeta({
  title: () => `${doc.value?.title || '文档'} · Nuxt 中文`,
  description: () => doc.value?.description || '',
})

// 构建分类侧边栏
const sidebar = computed(() => {
  if (!allDocs.value || !Array.isArray(allDocs.value)) return []
  const map = new Map<string, { key: string; label: string; items: { path: string; title: string }[] }>()

  const categoryLabels: Record<string, string> = {
    'getting-started': '快速开始',
    'directory-structure': '目录结构',
    'guide': '指南',
    'api': 'API 参考',
    'community': '社区',
    'bridge': 'Bridge',
    'migration': '迁移',
    'errors': '错误码',
  }

  for (const d of allDocs.value as { path: string; title: string }[]) {
    // 至少需要两个段（分类 + 文档名），排除 /docs/readme 这类根级文档
    const segs = d.path.replace(/^\/docs\//, '').split('/').filter(Boolean)
    if (segs.length < 2) continue
    const rawCat = segs[0]
    const key = rawCat.replace(/^\d+\./, '')
    if (!map.has(key)) {
      map.set(key, { key, label: categoryLabels[key] || rawCat, items: [] })
    }
    map.get(key)!.items.push({ path: d.path, title: d.title })
  }

  const order = ['getting-started', 'directory-structure', 'guide', 'api', 'community', 'migration', 'bridge', 'errors']
  return Array.from(map.values()).sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
})

// 上一页/下一页
const flatList = computed(() => sidebar.value.flatMap((c) => c.items))
const currentIndex = computed(() => flatList.value.findIndex((d) => d.path === path.value))
const prev = computed(() => currentIndex.value > 0 ? flatList.value[currentIndex.value - 1] : null)
const next = computed(() => currentIndex.value >= 0 && currentIndex.value < flatList.value.length - 1 ? flatList.value[currentIndex.value + 1] : null)

const mobileSidebarOpen = ref(false)
</script>

<template>
  <div class="relative pt-16">
    <!-- 移动端侧边栏切换 -->
    <button
      class="lg:hidden fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400 text-[#020420] shadow-lg shadow-emerald-400/30"
      @click="mobileSidebarOpen = !mobileSidebarOpen"
      aria-label="切换目录"
    >
      <UIcon :name="mobileSidebarOpen ? 'i-lucide-x' : 'i-lucide-list'" class="h-5 w-5" />
    </button>

    <div class="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)_240px]">
      <!-- 左侧导航 -->
      <aside class="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-white/5 py-8 pr-4">
        <DocsSidebar :nav="sidebar" :current-path="path" />
      </aside>

      <!-- 移动端抽屉 -->
      <Transition
        enter-active-class="transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="mobileSidebarOpen"
          class="lg:hidden fixed inset-0 z-30 bg-[#020420]/95 backdrop-blur-xl pt-20 overflow-y-auto"
          @click="mobileSidebarOpen = false"
        >
          <div class="px-6 pb-12" @click.stop>
            <DocsSidebar :nav="sidebar" :current-path="path" @navigate="mobileSidebarOpen = false" />
          </div>
        </div>
      </Transition>

      <!-- 主内容 -->
      <main class="min-w-0 px-6 lg:px-12 py-10 lg:py-12">
        <!-- 面包屑 -->
        <nav class="mb-8 flex items-center gap-1.5 text-xs text-gray-500 font-mono">
          <NuxtLink to="/" class="hover:text-emerald-300">首页</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <NuxtLink to="/docs" class="hover:text-emerald-300">文档</NuxtLink>
          <UIcon name="i-lucide-chevron-right" class="h-3 w-3" />
          <span class="text-gray-400 truncate">{{ doc?.title }}</span>
        </nav>

        <!-- 文档标题 -->
        <h1 class="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          {{ doc?.title }}
        </h1>
        <p v-if="doc?.description" class="mt-3 text-gray-400 text-base leading-relaxed">
          {{ doc.description }}
        </p>

        <!-- 正文 -->
        <div class="mt-8">
          <ContentRenderer
            v-if="doc"
            :value="doc"
            class="docs-content"
          />
        </div>

        <!-- 上一页/下一页 -->
        <nav v-if="prev || next" class="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-white/5">
          <NuxtLink
            v-if="prev"
            :to="prev.path"
            class="group rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-emerald-400/30 hover:bg-emerald-400/[0.03] transition-[border-color,background-color]"
          >
            <div class="flex items-center gap-1.5 text-xs text-gray-500">
              <UIcon name="i-lucide-arrow-left" class="h-3.5 w-3.5" aria-hidden="true" />
              上一篇
            </div>
            <div class="mt-1.5 font-medium text-white group-hover:text-emerald-300 transition-colors">
              {{ prev.title }}
            </div>
          </NuxtLink>
          <div v-else />
          <NuxtLink
            v-if="next"
            :to="next.path"
            class="group rounded-xl border border-white/5 bg-white/[0.02] p-4 text-right hover:border-emerald-400/30 hover:bg-emerald-400/[0.03] transition-[border-color,background-color] sm:col-start-2"
          >
            <div class="flex items-center justify-end gap-1.5 text-xs text-gray-500">
              下一篇
              <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
            </div>
            <div class="mt-1.5 font-medium text-white group-hover:text-emerald-300 transition-colors">
              {{ next.title }}
            </div>
          </NuxtLink>
        </nav>
      </main>

      <!-- 右侧 TOC -->
      <aside class="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-12 pl-4">
        <DocsToc v-if="doc?.body?.toc?.links?.length" :links="doc.body.toc.links" />
      </aside>
    </div>
  </div>
</template>

<style>
/* 文档内容样式 */
.docs-content {
  color: #d1d5db;
  font-size: 0.95rem;
  line-height: 1.75;
}
.docs-content h2 {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 600;
  color: #fff;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  scroll-margin-top: 5rem;
}
.docs-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  scroll-margin-top: 5rem;
}
.docs-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
.docs-content p {
  margin-bottom: 1rem;
}
.docs-content a {
  color: #00DC82;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.docs-content a:hover {
  color: #34e89e;
}
.docs-content ul,
.docs-content ol {
  margin: 1rem 0;
  padding-left: 1.5rem;
}
.docs-content ul { list-style: disc; }
.docs-content ol { list-style: decimal; }
.docs-content li { margin: 0.4rem 0; }
.docs-content code:not(pre code) {
  font-family: var(--font-mono);
  font-size: 0.85em;
  background: rgba(0,220,130,0.1);
  color: #6ee7b7;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  border: 1px solid rgba(0,220,130,0.15);
}
.docs-content pre {
  background: #0a0a2e !important;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  overflow-x: auto;
  margin: 1.25rem 0;
  font-size: 0.85rem;
  line-height: 1.6;
}
.docs-content pre code {
  font-family: var(--font-mono);
  background: transparent !important;
  padding: 0;
}
.docs-content blockquote {
  border-left: 3px solid #00DC82;
  background: rgba(0,220,130,0.05);
  padding: 0.75rem 1rem;
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
  color: #d1d5db;
}
.docs-content blockquote p { margin: 0; }
.docs-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.875rem;
}
.docs-content th,
.docs-content td {
  border: 1px solid rgba(255,255,255,0.08);
  padding: 0.6rem 0.9rem;
  text-align: left;
}
.docs-content th {
  background: rgba(255,255,255,0.03);
  color: #fff;
  font-weight: 600;
}
.docs-content tr:hover td {
  background: rgba(0,220,130,0.03);
}
.docs-content hr {
  border: none;
  border-top: 1px solid rgba(255,255,255,0.08);
  margin: 2rem 0;
}
.docs-content img {
  max-width: 100%;
  border-radius: 12px;
  margin: 1rem 0;
}
</style>

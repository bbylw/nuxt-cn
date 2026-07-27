<script setup lang="ts">
interface TocLink {
  id?: string
  text?: string
  depth?: number
  children?: TocLink[]
}

const props = defineProps<{
  links: TocLink[]
}>()

const activeId = ref('')

onMounted(() => {
  const headings = document.querySelectorAll('.docs-content h2, .docs-content h3')
  if (!headings.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          activeId.value = entry.target.id
        }
      })
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 },
  )

  headings.forEach((h) => observer.observe(h))
  onBeforeUnmount(() => observer.disconnect())
})

function flatten(links: TocLink[], depth = 1): { id: string; text: string; depth: number }[] {
  const result: { id: string; text: string; depth: number }[] = []
  for (const link of links) {
    if (link.id && link.text) {
      result.push({ id: link.id, text: link.text, depth })
    }
    if (link.children?.length) {
      result.push(...flatten(link.children, depth + 1))
    }
  }
  return result
}

const flatLinks = computed(() => flatten(props.links))
</script>

<template>
  <nav v-if="flatLinks.length" class="text-sm" aria-label="本页目录">
    <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">本页目录</p>
    <ul class="space-y-1.5 border-l border-white/5">
      <li v-for="link in flatLinks" :key="link.id">
        <a
          :href="`#${link.id}`"
          class="block border-l-2 -ml-px py-0.5 transition-colors"
          :aria-current="activeId === link.id ? 'location' : undefined"
          :class="[
            activeId === link.id
              ? 'text-emerald-300 border-emerald-400'
              : 'text-gray-500 hover:text-gray-300 border-transparent',
            link.depth > 1 ? 'pl-5' : 'pl-3',
          ]"
        >
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

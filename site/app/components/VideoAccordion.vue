<script setup lang="ts">
// MDC 组件：::video-accordion{title="..." videoId="..." platform="..."}
// 视频手风琴，用于文档中嵌入可折叠的视频链接
const props = withDefaults(defineProps<{
  title?: string
  videoId?: string
  platform?: 'youtube' | 'vimeo' | string
}>(), {
  platform: 'youtube',
})

const open = ref(false)

const embedUrl = computed(() => {
  if (!props.videoId) return ''
  if (props.platform === 'vimeo') {
    return `https://player.vimeo.com/video/${props.videoId}`
  }
  return `https://www.youtube.com/embed/${props.videoId}`
})
</script>

<template>
  <div class="my-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
    <button
      class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-white/[0.03]"
      @click="open = !open"
    >
      <UIcon
        :name="open ? 'i-lucide-chevron-down' : 'i-lucide-play-circle'"
        class="h-4 w-4 shrink-0 text-emerald-400"
      />
      <span class="min-w-0 flex-1 truncate">{{ title }}</span>
    </button>
    <div v-if="open && videoId" class="aspect-video border-t border-white/5">
      <iframe
        :src="embedUrl"
        class="h-full w-full"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      />
    </div>
  </div>
</template>

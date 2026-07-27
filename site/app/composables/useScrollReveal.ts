// 滚动揭示 composable：基于 IntersectionObserver
// 遵循 prefers-reduced-motion 设置
// 通过 MutationObserver 监听异步渲染的 .reveal 元素（如文档页内容）
export function useScrollReveal() {
  const io = ref<IntersectionObserver | null>(null)
  const mo = ref<MutationObserver | null>(null)

  onMounted(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'))
      return
    }

    io.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.value?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    )

    // 观察已有的 .reveal 元素
    function observeNew(root: ParentNode) {
      root.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.value?.observe(el))
    }
    observeNew(document)

    // 监听 DOM 变化，捕获异步渲染的 .reveal 元素
    mo.value = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('reveal')) {
              io.value?.observe(node)
            }
            observeNew(node)
          }
        }
      }
    })
    mo.value.observe(document.body, { childList: true, subtree: true })
  })

  onBeforeUnmount(() => {
    io.value?.disconnect()
    mo.value?.disconnect()
  })
}

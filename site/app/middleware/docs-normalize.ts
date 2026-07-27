// 路由中间件：规范化文档路径
// 将带数字前缀的路径（如 /docs/1.getting-started/01.introduction）
// 301 重定向到规范路径（/docs/getting-started/introduction）
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/docs/')) return

  const segs = to.path.replace(/^\/docs\/?/, '').split('/').filter(Boolean)
  const cleaned = segs.map((s) => s.replace(/^\d+\./, ''))
  const normalized = '/docs/' + cleaned.join('/')

  if (to.path !== normalized) {
    return navigateTo(normalized, { redirectCode: 301, replace: true })
  }
})

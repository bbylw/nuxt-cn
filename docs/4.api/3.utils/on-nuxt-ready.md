---
title: "onNuxtReady"
description: onNuxtReady 组合式函数允许在你的应用完成初始化之后运行一个回调。
minimalVersion: "3.1"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/composables/ready.ts
    size: xs
---

:important
`onNuxtReady` 只在客户端运行。:br
它非常适合用来运行那些不应阻塞应用初始渲染的代码。
:

```ts [app/plugins/ready.client.ts]
export default defineNuxtPlugin(() => {
  onNuxtReady(async () => {
    const myAnalyticsLibrary = await import('my-big-analytics-library')
    // 使用 myAnalyticsLibrary 做一些处理
  })
})
```

即使你的应用已经初始化完成，它也是「安全」的。在这种情况下，代码会被注册到下一个空闲回调中运行。

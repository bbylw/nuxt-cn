---
title: 'defineLazyHydrationComponent'
description: '使用特定策略定义一个懒加载 hydration 组件。'
minimalVersion: "3.18"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/components/plugins/lazy-hydration-macro-transform.ts
    size: xs
---

`defineLazyHydrationComponent` 是一个编译器宏，帮助你使用特定的懒加载 hydration 策略创建组件。懒加载 hydration 会推迟 hydration，直到组件进入视口，或直到浏览器完成了更关键的任务。这可以显著降低初始性能开销，对于那些非必要的组件尤为明显。

## 用法

### 可见性策略（Visibility Strategy）

当组件进入视口时进行 hydration。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'visible',
  () => import('./components/MyComponent.vue'),
)
</script>

<template>
  <div>
    <!--
      当元素距离进入视口还有 100px 时
      就会触发 hydration。
    -->
    <LazyHydrationMyComponent :hydrate-on-visible="{ rootMargin: '100px' }" />
  </div>
</template>
```

`hydrateOnVisible` prop 是可选的。你可以传入一个对象来定制底层 `IntersectionObserver` 的行为。

::read-more{to="https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver" title="IntersectionObserver options"}
阅读更多关于 `hydrate-on-visible` 选项的说明。
::

::note
在底层，这使用了 Vue 内置的 [`hydrateOnVisible` 策略](https://vuejs.org/guide/components/async#hydrate-on-visible)。
::

### 空闲策略（Idle Strategy）

当浏览器空闲时进行 hydration。如果你需要组件尽快加载，但又不想阻塞关键的渲染路径，这很合适。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'idle',
  () => import('./components/MyComponent.vue'),
)
</script>

<template>
  <div>
    <!-- 当浏览器空闲或 2000ms 之后触发 hydration。 -->
    <LazyHydrationMyComponent :hydrate-on-idle="2000" />
  </div>
</template>
```

`hydrateOnIdle` prop 是可选的。你可以传入一个正整数来指定最大超时时间。

空闲策略适用于可以在浏览器空闲时进行 hydration 的组件。

::note
在底层，这使用了 Vue 内置的 [`hydrateOnIdle` 策略](https://vuejs.org/guide/components/async#hydrate-on-idle)。
::

### 交互策略（Interaction Strategy）

在指定的交互（例如点击、悬停）之后进行 hydration。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'interaction',
  () => import('./components/MyComponent.vue'),
)
</script>

<template>
  <div>
    <!--
      当元素被指针悬停时
      会触发 hydration。
    -->
    <LazyHydrationMyComponent hydrate-on-interaction="mouseover" />
  </div>
</template>
```

`hydrateOnInteraction` prop 是可选的。如果你不传入事件或事件列表，它默认在 `pointerenter`、`click` 和 `focus` 时触发 hydration。

::note
在底层，这使用了 Vue 内置的 [`hydrateOnInteraction` 策略](https://vuejs.org/guide/components/async#hydrate-on-interaction)。
::

### 媒体查询策略（Media Query Strategy）

当窗口匹配某个媒体查询时进行 hydration。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'mediaQuery',
  () => import('./components/MyComponent.vue'),
)
</script>

<template>
  <div>
    <!--
      当窗口宽度大于等于 768px 时
      会触发 hydration。
    -->
    <LazyHydrationMyComponent hydrate-on-media-query="(min-width: 768px)" />
  </div>
</template>
```

::note
在底层，这使用了 Vue 内置的 [`hydrateOnMediaQuery` 策略](https://vuejs.org/guide/components/async#hydrate-on-media-query)。
::

### 时间策略（Time Strategy）

在指定的延迟（毫秒）之后进行 hydration。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'time',
  () => import('./components/MyComponent.vue'),
)
</script>

<template>
  <div>
    <!-- 1000ms 之后触发 hydration。 -->
    <LazyHydrationMyComponent :hydrate-after="1000" />
  </div>
</template>
```

时间策略适用于可以等待一段特定时间的组件。

### If 策略

基于一个布尔条件进行 hydration。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'if',
  () => import('./components/MyComponent.vue'),
)

const isReady = ref(false)

function myFunction () {
  // 触发自定义 hydration 策略...
  isReady.value = true
}
</script>

<template>
  <div>
    <!-- 当 isReady 变为 true 时触发 hydration。 -->
    <LazyHydrationMyComponent :hydrate-when="isReady" />
  </div>
</template>
```

If 策略最适合那些可能并不总是需要被 hydration 的组件。

### 从不 Hydrate（Never Hydrate）

永远不会对组件进行 hydration。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'never',
  () => import('./components/MyComponent.vue'),
)
</script>

<template>
  <div>
    <!-- 该组件永远不会被 Vue hydration。 -->
    <LazyHydrationMyComponent />
  </div>
</template>
```

### 监听 Hydration 事件

所有延迟 hydration 组件在被 hydration 时都会发出一个 `@hydrated` 事件。

```vue
<script setup lang="ts">
const LazyHydrationMyComponent = defineLazyHydrationComponent(
  'visible',
  () => import('./components/MyComponent.vue'),
)

function onHydrate () {
  console.log('Component has been hydrated!')
}
</script>

<template>
  <div>
    <LazyHydrationMyComponent
      :hydrate-on-visible="{ rootMargin: '100px' }"
      @hydrated="onHydrated"
    />
  </div>
</template>
```

## 参数

::warning
为了确保编译器能正确识别这个宏，请避免使用外部变量。下面的写法会导致宏无法被正确识别：

```vue
<script setup lang="ts">
const strategy = 'visible'
const source = () => import('./components/MyComponent.vue')
const LazyHydrationMyComponent = defineLazyHydrationComponent(strategy, source)
</script>
```

::

### `strategy`

- **类型**：`'visible' | 'idle' | 'interaction' | 'mediaQuery' | 'if' | 'time' | 'never'`
- **必填**：`true`

| 策略         | 描述                                         |
|--------------|----------------------------------------------|
| `visible`    | 当组件进入视口时进行 hydration。             |
| `idle`       | 当浏览器空闲或经过延迟后进行 hydration。     |
| `interaction`| 在用户交互时（例如点击、悬停）进行 hydration。|
| `mediaQuery` | 当满足指定的媒体查询条件时进行 hydration。   |
| `if`         | 当满足指定的布尔条件时进行 hydration。       |
| `time`       | 在指定的时间延迟之后进行 hydration。         |
| `never`      | 阻止 Vue 对该组件进行 hydration。             |

### `source`

- **类型**：`() => Promise<Component>`
- **必填**：`true`

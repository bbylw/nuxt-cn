---
title: "defineNuxtPlugin"
description: defineNuxtPlugin() 是一个用于创建 Nuxt 插件的辅助函数。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/nuxt.ts
    size: xs
---

`defineNuxtPlugin` 是一个用于创建 Nuxt 插件、并具备增强功能和类型安全的辅助函数。该工具将不同格式的插件规范化为一个一致的结构，从而能在 Nuxt 的插件系统中无缝工作。

```ts twoslash [plugins/hello.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // 用 nuxtApp 做一些事情
})
```

:read-more{to="/docs/directory-structure/app/plugins#creating-plugins"}

## 类型

```ts [Signature]
export function defineNuxtPlugin<T extends Record<string, unknown>> (plugin: Plugin<T> | ObjectPlugin<T>): Plugin<T> & ObjectPlugin<T>

type Plugin<T> = (nuxt: NuxtApp) => Promise<void> | Promise<{ provide?: T }> | void | { provide?: T }

interface ObjectPlugin<T> {
  name?: string
  enforce?: 'pre' | 'default' | 'post'
  dependsOn?: string[]
  order?: number
  parallel?: boolean
  setup?: Plugin<T>
  hooks?: Partial<RuntimeNuxtHooks>
  env?: {
    islands?: boolean
  }
}
```

## 参数

**plugin**：插件可以通过两种方式定义：
1. **函数插件**：一个接收 [`NuxtApp`](/docs/guide/going-further/internals#the-nuxtapp-interface) 实例的函数，可以返回一个包含可选 `provide` 属性的 promise（如果你想在 [`NuxtApp`](/docs/guide/going-further/internals#the-nuxtapp-interface) 实例上提供辅助方法时使用）。
2. **对象插件**：一个可以包含各种属性来配置插件行为的对象，例如 `name`、`enforce`、`dependsOn`、`order`、`parallel`、`setup`、`hooks` 和 `env`。

| 属性         | 类型                                   | 必填    | 描述                                                                                          |
|--------------|----------------------------------------|---------|-----------------------------------------------------------------------------------------------|
| `name`       | `string`                               | `false` | 插件的可选名称，用于调试和依赖管理。                                                          |
| `enforce`    | `'pre'` \| `'default'` \| `'post'`     | `false` | 控制插件相对其他插件的执行时机。                                                              |
| `dependsOn`  | `string[]`                             | `false` | 该插件所依赖的插件名称数组。确保正确的执行顺序。                                              |
| `order`      | `number`                               | `false` | 允许对插件顺序进行更细粒度的控制，应仅由高级用户使用。**它会覆盖 `enforce` 的值并用于对插件排序。** |
| `parallel`   | `boolean`                              | `false` | 是否与其他 parallel 插件并行执行。                                                             |
| `setup`      | `Plugin<T>`{lang="ts"}                 | `false` | 主插件函数，等价于一个函数插件。                                                              |
| `hooks`      | `Partial<RuntimeNuxtHooks>`{lang="ts"} | `false` | 直接注册的 Nuxt 应用运行时钩子。                                                              |
| `env`        | `{ islands?: boolean }`{lang="ts"}     | `false` | 如果你不希望该插件在渲染服务端专用或 island 组件时运行，请将此值设为 `false`。                |

:video-accordion{title="观看 Alexander Lichter 关于 Nuxt 插件对象语法的视频" videoId="2aXZyXB1QGQ"}

## 示例

### 基础用法

下面的示例展示了一个添加了全局功能的简单插件：

```ts twoslash [plugins/hello.ts]
export default defineNuxtPlugin((nuxtApp) => {
  // 添加一个全局方法
  return {
    provide: {
      hello: (name: string) => `Hello ${name}!`,
    },
  }
})
```

### 对象语法插件

下面的示例展示了带有高级配置的对象语法：

```ts twoslash [plugins/advanced.ts]
export default defineNuxtPlugin({
  name: 'my-plugin',
  enforce: 'pre',
  async setup (nuxtApp) {
    // 插件 setup 逻辑
    const data = await $fetch('/api/config')

    return {
      provide: {
        config: data,
      },
    }
  },
  hooks: {
    'app:created' () {
      console.log('App created!')
    },
  },
})
```

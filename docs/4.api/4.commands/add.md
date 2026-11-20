---
title: "nuxt add"
description: "向你的 Nuxt 应用添加模块和层。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/add.ts
    size: xs
---

<!--add-cmd-->
```bash [Terminal]
npx nuxt add <MODULENAME...> [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--skipInstall] [--skipConfig] [--dev] [--packageManager=<npm|pnpm|yarn|bun|deno|aube|nub|upm>]
```
<!--/add-cmd-->

`add` 命令会把 [Nuxt 模块](/modules)和[层](/docs/getting-started/layers)安装进你的应用。它与 [`nuxt module add`](/docs/api/commands/module#nuxt-module-add) 是同一个命令，此外还支持层。

## 参数

<!--add-args-->
| 参数            | 描述                                                           |
|-----------------|----------------------------------------------------------------|
| `MODULENAME...` | 指定一个或多个要安装的模块或层，按名称给出，以空格分隔         |
<!--/add-args-->

## 选项

<!--add-opts-->
| 选项                                                            | 默认值 | 描述                             |
|-----------------------------------------------------------------|--------|----------------------------------|
| `--cwd=<directory>`                                             | `.`    | 指定你的 Nuxt 项目的根目录       |
| `--logLevel=<silent\|info\|verbose>`                            |        | 指定构建时的日志级别             |
| `--skipInstall`                                                 |        | 跳过 npm install                 |
| `--skipConfig`                                                  |        | 跳过 nuxt.config.ts 的更新       |
| `--dev`                                                         |        | 将模块作为开发依赖安装           |
| `--packageManager=<npm\|pnpm\|yarn\|bun\|deno\|aube\|nub\|upm>` |        | 用于安装的包管理器               |
<!--/add-opts-->

运行该命令时，它会：

- 使用你的包管理器将该包作为依赖安装，除非你传入 `--skipInstall`
- 将其添加到你的 [`package.json`](/docs/directory-structure/package) 文件中
- 在你的 [`nuxt.config`](/docs/directory-structure/nuxt-config) 文件中注册它：模块写入 `modules`，层写入 `extends`，除非你传入 `--skipConfig`

**示例：**

```bash [Terminal]
npx nuxt add pinia
```

可以一次添加多个包，并且模块会依据你项目所使用的 Nuxt 版本来解析：

```bash [Terminal]
npx nuxt add @nuxt/image @nuxt/fonts
```

不带名称运行它，即可交互式地浏览可用的模块。

:::note
`nuxt add <template> <name>` 已被弃用。请使用 [`nuxt add-template`](/docs/api/commands/add-template) 来搭建文件脚手架。
:::

::read-more{to="/docs/api/commands/module"}
阅读更多关于搜索和移除模块的内容。
::

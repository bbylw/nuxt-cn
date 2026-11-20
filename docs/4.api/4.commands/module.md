---
title: "nuxt module"
description: "在命令行中搜索、添加和移除你 Nuxt 应用里的模块。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/tree/main/packages/nuxt-cli/src/commands/module
    size: xs
---

Nuxt 提供了几个工具，用来无缝地使用 [Nuxt 模块](/modules)。

## `nuxt module add`

<!--module-add-cmd-->
```bash [Terminal]
npx nuxt module add <MODULENAME...> [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--skipInstall] [--skipConfig] [--dev] [--packageManager=<npm|pnpm|yarn|bun|deno|aube|nub|upm>]
```
<!--/module-add-cmd-->

### 参数

<!--module-add-args-->
| 参数            | 描述                                                             |
|-----------------|------------------------------------------------------------------|
| `MODULENAME...` | 指定一个或多个要安装的模块，按名称给出，以空格分隔               |
<!--/module-add-args-->

### 选项

<!--module-add-opts-->
| 选项                                                            | 默认值 | 描述                             |
|-----------------------------------------------------------------|--------|----------------------------------|
| `--cwd=<directory>`                                             | `.`    | 指定你的 Nuxt 项目的根目录       |
| `--logLevel=<silent\|info\|verbose>`                            |        | 指定构建时的日志级别             |
| `--skipInstall`                                                 |        | 跳过 npm install                 |
| `--skipConfig`                                                  |        | 跳过 nuxt.config.ts 的更新       |
| `--dev`                                                         |        | 将模块作为开发依赖安装           |
| `--packageManager=<npm\|pnpm\|yarn\|bun\|deno\|aube\|nub\|upm>` |        | 用于安装的包管理器               |
<!--/module-add-opts-->

该命令让你在无需任何手动操作的情况下，在你的应用中安装 [Nuxt 模块](/modules)。

运行该命令时，它会：

- 使用你的包管理器将该模块作为依赖安装
- 将其添加到你的 [package.json](/docs/directory-structure/package) 文件中
- 更新你的 [`nuxt.config`](/docs/directory-structure/nuxt-config) 文件

**示例：**

安装 [`Pinia`](/modules/pinia) 模块

```bash [Terminal]
npx nuxt module add pinia
```

不指定模块名运行它，即可从与你的 Nuxt 版本兼容的模块中挑选。

:::note
[`nuxt add`](/docs/api/commands/add) 就是同一个命令，并且它还接受层。
:::

## `nuxt module remove`

<!--module-remove-cmd-->
```bash [Terminal]
npx nuxt module remove [MODULENAME...] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--skipInstall] [--skipConfig]
```
<!--/module-remove-cmd-->

### 参数

<!--module-remove-args-->
| 参数            | 描述                                                             |
|-----------------|------------------------------------------------------------------|
| `MODULENAME...` | 指定一个或多个要移除的模块，按名称给出，以空格分隔               |
<!--/module-remove-args-->

### 选项

<!--module-remove-opts-->
| 选项                                 | 默认值 | 描述                             |
|--------------------------------------|--------|----------------------------------|
| `--cwd=<directory>`                  | `.`    | 指定你的 Nuxt 项目的根目录       |
| `--logLevel=<silent\|info\|verbose>` |        | 指定构建时的日志级别             |
| `--skipInstall`                      |        | 跳过卸载依赖                     |
| `--skipConfig`                       |        | 跳过 nuxt.config.ts 的更新       |
<!--/module-remove-opts-->

该命令会卸载该包，并把它从你的 [`nuxt.config`](/docs/directory-structure/nuxt-config) 中的 `modules` 数组里移除。

**示例：**

```bash [Terminal]
npx nuxt module remove pinia
```

不指定模块名运行它，即可从项目当前正在使用的模块中挑选。

## `nuxt module search`

<!--module-search-cmd-->
```bash [Terminal]
npx nuxt module search <QUERY> [--cwd=<directory>] [--nuxtVersion=<3|4|4.2.0>] [--json]
```
<!--/module-search-cmd-->

![nuxt module search](/capture/output/nuxt-module-search.svg)

### 参数

<!--module-search-args-->
| 参数     | 描述               |
|----------|--------------------|
| `QUERY`  | 要搜索的关键词     |
<!--/module-search-args-->

### 选项

<!--module-search-opts-->
| 选项                            | 默认值 | 描述                                                                                 |
|---------------------------------|--------|--------------------------------------------------------------------------------------|
| `--cwd=<directory>`             | `.`    | 指定你的 Nuxt 项目的根目录                                                           |
| `--nuxtVersion=<3\|4\|4.2.0>`   |        | 按 Nuxt 版本过滤，仅列出兼容的模块（默认自动检测）                                   |
| `--json`                        |        | 以 JSON 形式打印输出                                                                 |
<!--/module-search-opts-->

该命令会搜索与你的查询匹配、且与你的 Nuxt 版本兼容的 Nuxt 模块，并展示每个模块的描述，其中命中的文本会被高亮显示。

**示例：**

```bash [Terminal]
npx nuxt module search pinia
```

使用 `--json` 可以获取机器可读的 JSON 结果。

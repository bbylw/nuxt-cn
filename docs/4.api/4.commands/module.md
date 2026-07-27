---
title: "nuxt module"
description: "通过命令行搜索并向你的 Nuxt 应用添加模块。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/tree/main/packages/nuxi/src/commands/module
    size: xs
---

Nuxt 提供了一些工具，用来无缝地使用 [Nuxt 模块](/modules)。

## `nuxt module add`

<!--module-add-cmd-->
```bash [Terminal]
npx nuxt module add <MODULENAME> [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--skipInstall] [--skipConfig] [--dev]
```
<!--/module-add-cmd-->

<!--module-add-args-->
| 参数         | 描述                                           |
|--------------|-----------------------------------------------|
| `MODULENAME` | 指定一个或多个要安装的模块名，以空格分隔       |
<!--/module-add-args-->

<!--module-add-opts-->
| 选项                                 | 默认值  | 描述                       |
|--------------------------------------|---------|----------------------------|
| `--cwd=<directory>`                  | `.`     | 指定工作目录               |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别       |
| `--skipInstall`                      |         | 跳过 npm install           |
| `--skipConfig`                       |         | 跳过 nuxt.config.ts 的更新 |
| `--dev`                              |         | 将模块作为开发依赖安装     |
<!--/module-add-opts-->

该命令让你无需手动操作即可在应用中安装 [Nuxt 模块](/modules)。

运行该命令时，它会：

- 使用你的包管理器将模块作为依赖安装
- 将其添加到你的 [package.json](/docs/directory-structure/package) 文件中
- 更新你的 [`nuxt.config`](/docs/directory-structure/nuxt-config) 文件

**示例：**

安装 [`Pinia`](/modules/pinia) 模块

```bash [Terminal]
npx nuxt module add pinia
```

## `nuxt module search`

<!--module-search-cmd-->
```bash [Terminal]
npx nuxt module search <QUERY> [--cwd=<directory>] [--nuxtVersion=<2|3>]
```
<!--/module-search-cmd-->

### 参数

<!--module-search-args-->
| 参数     | 描述               |
|----------|--------------------|
| `QUERY`  | 要搜索的关键词     |
<!--/module-search-args-->

### 选项

<!--module-search-opts-->
| 选项                 | 默认值  | 描述                                                                              |
|----------------------|---------|----------------------------------------------------------------------------------|
| `--cwd=<directory>`  | `.`     | 指定工作目录                                                                      |
| `--nuxtVersion=<2\|3>` |         | 按 Nuxt 版本过滤，仅列出兼容的模块（默认自动检测）                                |
<!--/module-search-opts-->

该命令会搜索与你的查询匹配、且与你的 Nuxt 版本兼容的 Nuxt 模块。

**示例：**

```bash [Terminal]
npx nuxt module search pinia
```

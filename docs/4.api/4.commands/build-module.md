---
title: 'nuxt build-module'
description: '用于在发布前构建你的 Nuxt 模块的 Nuxt 命令。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/module-builder/blob/main/src/cli.ts
    size: xs
---

<!--build-module-cmd-->
```bash [Terminal]
npx nuxt build-module [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--build] [--stub] [--sourcemap] [--prepare]
```
<!--/build-module-cmd-->

`build-module` 命令会运行 `@nuxt/module-builder`，在你的 `rootDir` 中生成 `dist` 目录，其中包含你的 **nuxt-module** 的完整构建产物。

## 参数

<!--build-module-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/build-module-args-->

## 选项

<!--build-module-opts-->
| 选项                                 | 默认值  | 描述                                                   |
|--------------------------------------|---------|--------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）        |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                  |
| `--build`                            | `false` | 为发布构建模块                                        |
| `--stub`                             | `false` | 为开发环境 stub 化 dist，而不是真正去构建它            |
| `--sourcemap`                        | `false` | 生成 sourcemap                                         |
| `--prepare`                          | `false` | 为本地开发准备模块                                    |
<!--/build-module-opts-->

:read-more{to="https://github.com/nuxt/module-builder" icon="i-simple-icons-github" target="_blank"}
阅读更多关于 `@nuxt/module-builder` 的内容。
:

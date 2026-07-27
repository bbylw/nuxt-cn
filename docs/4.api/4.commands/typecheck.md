---
title: "nuxt typecheck"
description: typecheck 命令运行 vue-tsc 来全量检查你的应用类型。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/typecheck.ts
    size: xs
---

<!--typecheck-cmd-->
```bash [Terminal]
npx nuxt typecheck [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv] [-e, --extends=<layer-name>]
```
<!--/typecheck-cmd-->

`typecheck` 命令运行 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) 来全量检查你的应用类型。

## 参数

<!--typecheck-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/typecheck-args-->

## 选项

<!--typecheck-opts-->
| 选项                                 | 默认值  | 描述                                                       |
|--------------------------------------|---------|-----------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）           |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                      |
| `--dotenv`                           |         | 要加载的 `.env` 文件路径，相对于根目录                    |
| `-e, --extends=<layer-name>`         |         | 从一个 Nuxt 层继承                                        |
<!--/typecheck-opts-->

:note
该命令会将 `process.env.NODE_ENV` 设为 `production`。要覆盖它，请在 [`.env`](/docs/directory-structure/env) 文件中定义 `NODE_ENV`，或作为命令行参数传入。
:

:read-more{to="/docs/guide/concepts/typescript#type-checking"}
阅读更多关于如何在构建或开发时启用类型检查的内容。
:

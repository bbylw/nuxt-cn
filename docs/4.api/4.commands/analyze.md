---
title: "nuxt analyze"
description: "分析生产环境的打包产物或你的 Nuxt 应用。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/analyze.ts
    size: xs
---

<!--analyze-cmd-->
```bash [Terminal]
npx nuxt analyze [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv] [-e, --extends=<layer-name>] [--name=<name>] [--no-serve]
```
<!--/analyze-cmd-->

`analyze` 命令会构建 Nuxt 并分析生产环境的打包产物（实验性）。

## 参数

<!--analyze-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/analyze-args-->

## 选项

<!--analyze-opts-->
| 选项                                 | 默认值    | 描述                                                                           |
|--------------------------------------|-----------|-------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |           | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）                              |
| `--logLevel=<silent\|info\|verbose>` |           | 指定构建时的日志级别                                                          |
| `--dotenv`                           |           | 要加载的 `.env` 文件路径，相对于根目录                                         |
| `-e, --extends=<layer-name>`         |           | 从一个 Nuxt 层继承                                                            |
| `--name=<name>`                      | `default` | 分析的名称                                                                    |
| `--no-serve`                         |           | 跳过提供分析结果服务                                                          |
<!--/analyze-opts-->

:note
该命令会将 `process.env.NODE_ENV` 设为 `production`。
:

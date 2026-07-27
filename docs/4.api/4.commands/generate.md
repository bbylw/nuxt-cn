---
title: "nuxt generate"
description: 预渲染应用的每一个路由，并将结果存储为纯 HTML 文件。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/generate.ts
    size: xs
---

<!--generate-cmd-->
```bash [Terminal]
npx nuxt generate [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--preset] [--dotenv] [--envName] [-e, --extends=<layer-name>] [--profile[=verbose]]
```
<!--/generate-cmd-->

`generate` 命令会预渲染你应用的每一个路由，并将结果存储为纯 HTML 文件，你可以将它们部署到任何静态托管服务上。该命令会触发 `nuxt build` 命令，并将 `prerender` 参数设为 `true`。

## 参数

<!--generate-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/generate-args-->

## 选项

<!--generate-opts-->
| 选项                                 | 默认值  | 描述                                                                                                                                               |
|--------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）                                                                                                   |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                                                                                                              |
| `--preset`                           |         | Nitro 服务器预设                                                                                                                                  |
| `--dotenv`                           |         | 要加载的 `.env` 文件路径，相对于根目录                                                                                                            |
| `--envName`                          |         | 解析配置覆盖时要使用的环境（构建时默认为 `production`，运行开发服务器时默认为 `development`）                                                     |
| `-e, --extends=<layer-name>`         |         | 从一个 Nuxt 层继承                                                                                                                                |
| `--profile` :badge[v4.4]{color="info" size="xs" class="align-middle"} |         | 分析性能。在退出时写入一份 V8 CPU profile 和 JSON 报告。使用 `--profile=verbose` 获取完整的控制台报告。                                          |
<!--/generate-opts-->

:read-more{to="/docs/getting-started/deployment#static-hosting"}
阅读更多关于预渲染和静态托管的内容。
:

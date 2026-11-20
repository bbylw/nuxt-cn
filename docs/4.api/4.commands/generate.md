---
title: "nuxt generate"
description: 预渲染应用的每一个路由，并将结果存储为纯 HTML 文件。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/generate.ts
    size: xs
---

<!--generate-cmd-->
```bash [Terminal]
npx nuxt generate [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--target=<target>] [--dotenv=<path>...] [--envName=<environment>] [-e, --extends=<layer-name>...] [--profile=<verbose>]
```
<!--/generate-cmd-->

`generate` 命令会预渲染你应用的每一个路由，并将结果存储为纯 HTML 文件，你可以把它们部署到任何静态托管服务上。该命令会触发 `nuxt build` 命令，并将 `prerender` 参数设为 `true`。

## 参数

<!--generate-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/generate-args-->

## 选项

<!--generate-opts-->
| 选项                                 | 默认值 | 描述                                                                                                                                             |
|--------------------------------------|--------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |        | 指定你的 Nuxt 项目的根目录                                                                                                                       |
| `--logLevel=<silent\|info\|verbose>` |        | 指定构建时的日志级别                                                                                                                             |
| `--target=<target>`                  |        | 为已配置的服务端构建器指定部署目标（例如 `node-server`、`vercel`、`netlify`）                                                                    |
| `--dotenv=<path>...`                 |        | 要加载的 `.env` 文件路径，相对于根目录。可重复传入，靠后的文件优先级更高。                                                                       |
| `--envName=<environment>`            |        | 解析配置覆盖时要使用的环境（构建时默认为 `production`，运行开发服务器时默认为 `development`）                                                    |
| `-e, --extends=<layer-name>...`      |        | 从一个 Nuxt 层继承                                                                                                                               |
| `--profile=<verbose>`                |        | 分析性能，在退出时写入一份 V8 CPU profile 和一份 JSON 报告。使用 `--profile=verbose` 获取完整的控制台报告。                                      |
<!--/generate-opts-->

::read-more{to="/docs/getting-started/deployment#static-hosting"}
阅读更多关于预渲染与静态托管的内容。
::

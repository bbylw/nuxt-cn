---
title: "nuxt preview"
description: preview 命令会启动一个服务器，用于在运行 build 命令后预览你的应用。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/preview.ts
    size: xs
---

<!--preview-cmd-->
```bash [Terminal]
npx nuxt preview [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--envName] [-e, --extends=<layer-name>] [-p, --port] [--dotenv]
```
<!--/preview-cmd-->

`preview` 命令会启动一个服务器，用于在运行 `build` 命令后预览你的 Nuxt 应用。`start` 命令是 `preview` 的别名。当在生产环境中运行你的应用时，请参考 [部署章节](/docs/getting-started/deployment)。

## 参数

<!--preview-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/preview-args-->

## 选项

<!--preview-opts-->
| 选项                                 | 默认值  | 描述                                                                                                                                               |
|--------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）                                                                                                   |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                                                                                                              |
| `--envName`                          |         | 解析配置覆盖时要使用的环境（构建时默认为 `production`，运行开发服务器时默认为 `development`）                                                     |
| `-e, --extends=<layer-name>`         |         | 从一个 Nuxt 层继承                                                                                                                                |
| `-p, --port`                         |         | 监听的端口（可使用 `PORT` 环境变量覆盖）                                                                                                         |
| `--dotenv`                           |         | 要加载的 `.env` 文件路径，相对于根目录                                                                                                            |
<!--/preview-opts-->

该命令会将 `process.env.NODE_ENV` 设为 `production`。要覆盖它，请在 `.env` 文件中定义 `NODE_ENV`，或作为命令行参数传入。

:note
为方便起见，在预览模式下，你的 [`.env`](/docs/directory-structure/env) 文件会被加载到 `process.env` 中。（然而在生产环境中，你需要自己确保环境变量已被设置。例如，使用 Node.js 20+ 时，你可以通过运行 `NODE_ENV=production node --env-file .env .output/server/index.mjs` 来启动你的服务器。）
:

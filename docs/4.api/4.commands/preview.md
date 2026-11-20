---
title: "nuxt preview"
description: preview 命令会启动一个服务器，用于在运行 build 命令后预览你的应用。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/preview.ts
    size: xs
---

<!--preview-cmd-->
```bash [Terminal]
npx nuxt preview [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--envName=<environment>] [-e, --extends=<layer-name>...] [-p, --port=<port>] [-h, --host=<host>] [--takeover] [--strictPort] [--dotenv=<path>...]
```
<!--/preview-cmd-->

`preview` 命令会启动一个服务器，用于在运行 `build` 命令之后预览你的 Nuxt 应用。`nuxt start` 只是同一命令的另一个名字。在生产环境中运行你的应用时，请参考[部署章节](/docs/getting-started/deployment)。

当所配置的 `server.builder` 根本不产出任何服务器时（例如仅客户端的构建），就没有可运行的东西：此时会直接提供静态产物，未匹配到的路径回退到客户端入口，从而让客户端路由正常工作。

某些 Nitro 预设不会产出可以在本地运行的服务器。对于这些预设，命令会改为运行该预设自带的预览命令，并且会告诉你它正在运行什么。

## 参数

<!--preview-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/preview-args-->

## 选项

<!--preview-opts-->
| 选项                                 | 默认值  | 描述                                                                                                                                             |
|--------------------------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定你的 Nuxt 项目的根目录                                                                                                                       |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                                                                                                             |
| `--envName=<environment>`            |         | 解析配置覆盖时要使用的环境（构建时默认为 `production`，运行开发服务器时默认为 `development`）                                                    |
| `-e, --extends=<layer-name>...`      |         | 从一个 Nuxt 层继承                                                                                                                               |
| `-p, --port=<port>`                  |         | 监听的端口（默认值：`NUXT_PORT \|\| NITRO_PORT \|\| PORT`）                                                                                       |
| `-h, --host=<host>`                  |         | 监听的主机（默认值：`NUXT_HOST \|\| NITRO_HOST \|\| HOST`）                                                                                       |
| `--takeover`                         |         | 停止本项目上已在运行的预览服务器，并在其位置启动                                                                                                 |
| `--no-takeover`                      |         | 从不停止本项目上已在运行的预览服务器                                                                                                             |
| `--strictPort`                       | `false` | 当所请求的端口不可用时直接退出，而不是改用另一个端口                                                                                             |
| `--dotenv=<path>...`                 |         | 要加载的 `.env` 文件路径，相对于根目录。可重复传入，靠后的文件优先级更高。                                                                       |
<!--/preview-opts-->

## 接管正在运行的预览

预览会把自身记录在 `node_modules/.cache/nuxt/preview` 中，因此针对同一个项目的第二个 `nuxt preview` 处理那个已在运行的实例的方式，与 [`nuxt dev`](/docs/api/commands/dev#taking-over-a-running-dev-server) 处理正在运行的开发服务器的方式相同：

| 已在运行的预览启动方式 | 新的预览启动方式 | 会发生什么                       |
|------------------------|------------------|----------------------------------|
| 不带终端               | 不带终端         | 它会被停止，新的预览接管它的端口。 |
| 不带终端               | 在终端中         | 会询问你，默认选择接管。           |
| 在终端中               | 不带终端         | 新的预览会退出，并告知已在运行的预览在哪里。 |
| 在终端中               | 在终端中         | 会询问你，默认选择不要启动。       |

传入 `--takeover` 可始终停止它并在其位置启动，传入 `--no-takeover` 则从不这样做。如果在提示中选择“Start anyway”，或者传入了一个不同的 `--port`，就会在它旁边另外运行一个预览。

当另一个服务器（包括 `nuxt dev`）正在使用所请求的端口时，预览会自动改用另一个空闲端口，而不会停止那个服务器。传入 `--strictPort` 可改为直接退出。所请求的端口来自 `--port`、`NUXT_PORT`、`NITRO_PORT` 或 `PORT`，默认为 `3000`。

端口选择适用于静态预览，以及直接用 Node.js、Bun 或 Deno 运行的预览命令。其他预览命令会自行选择端口。

该命令会将 `process.env.NODE_ENV` 设为 `production`。要覆盖它，请在 `.env` 文件中定义 `NODE_ENV`，或将其作为命令行参数传入。

:::note
为方便起见，在预览模式下，你的 [`.env`](/docs/directory-structure/env) 文件会被加载进 `process.env`。（然而在真正的生产环境中，你需要自行确保环境变量已被设置。例如，使用 Node.js 20+ 时，你可以通过运行 `NODE_ENV=production node --env-file .env .output/server/index.mjs` 来启动你的服务器。）
:::

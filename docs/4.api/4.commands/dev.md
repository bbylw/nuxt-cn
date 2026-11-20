---
title: 'nuxt dev'
description: dev 命令会在 http://localhost:3000 启动一个带有热模块替换的开发服务器。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/dev.ts
    size: xs
---

<!--dev-cmd-->
```bash [Terminal]
npx nuxt dev [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv=<path>...] [--envName=<environment>] [-e, --extends=<layer-name>...] [--inspect] [--inspect-brk] [--tui] [--clear] [-f, --fork] [-p, --port=<port>] [--takeover] [--strictPort] [-h, --host=<host>] [-o, --open] [--open.url=<url|path>] [--clipboard] [--qr] [--tunnel] [--public] [--publicURL=<url>] [--https] [--https.cert=<path>] [--https.key=<path>] [--https.pfx=<path>] [--https.passphrase=<passphrase>] [--https.validityDays=<days>] [--https.domains=<domain>...] [--profile=<verbose>]
```
<!--/dev-cmd-->

`dev` 命令会在 [http://localhost:3000](http://localhost:3000) 启动一个带有热模块替换（HMR）的开发服务器。

![nuxt dev](/capture/output/nuxt-dev-static.svg)

## 参数

<!--dev-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/dev-args-->

## 选项

<!--dev-opts-->
| 选项                                       | 默认值         | 描述                                                                                                                                                 |
|--------------------------------------------|----------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                        |                | 指定你的 Nuxt 项目的根目录                                                                                                                           |
| `--logLevel=<silent\|info\|verbose>`       |                | 指定构建时的日志级别                                                                                                                                 |
| `--dotenv=<path>...`                       |                | 要加载的 `.env` 文件路径，相对于根目录。可重复传入，靠后的文件优先级更高。                                                                           |
| `--envName=<environment>`                  |                | 解析配置覆盖时要使用的环境（构建时默认为 `production`，运行开发服务器时默认为 `development`）                                                        |
| `-e, --extends=<layer-name>...`            |                | 从一个 Nuxt 层继承                                                                                                                                   |
| `--inspect`                                |                | 为服务端代码启用 Node.js inspector（`--inspect=[host:]port`），并在下一个端口上为 CLI 进程启用                                                       |
| `--inspect-brk`                            |                | 与 `--inspect` 类似，并在加载 Nuxt 之前等待调试器附加到 CLI 进程（`--inspect-brk=[host:]port`）                                                      |
| `--tui`                                    | `true`         | 交互式终端 UI（固定的状态面板、折叠的日志以及单键快捷键）                                                                                            |
| `--no-tui`                                 |                | 禁用交互式终端 UI，改为直接流式输出日志                                                                                                              |
| `--clear`                                  | `false`        | 重启时清空控制台                                                                                                                                     |
| `-f, --fork`                               | 取决于运行时   | 在 fork 出的子进程中为应用提供服务（凡运行时支持之处默认开启）                                                                                       |
| `--no-fork`                                |                | 禁用 fork 模式                                                                                                                                       |
| `-p, --port=<port>`                        |                | 监听的端口（默认值：`NUXT_PORT \|\| NITRO_PORT \|\| PORT \|\| nuxtOptions.devServer.port`）                                                          |
| `--takeover`                               |                | 停止本项目上已在运行的开发服务器，并在其位置启动                                                                                                     |
| `--no-takeover`                            |                | 从不停止本项目上已在运行的开发服务器                                                                                                                 |
| `--strictPort`                             | `false`        | 当所请求的端口不可用时直接退出，而不是改用另一个端口                                                                                                 |
| `-h, --host=<host>`                        |                | 监听的主机（默认值：`NUXT_HOST \|\| NITRO_HOST \|\| HOST \|\| nuxtOptions.devServer?.host`）                                                         |
| `-o, --open`                               | `false`        | 在浏览器中打开 URL                                                                                                                                   |
| `--open.url=<url\|path>`                   |                | 要打开的路径或 URL，用以代替开发服务器的根路径                                                                                                       |
| `--clipboard`                              | `false`        | 将 URL 复制到剪贴板                                                                                                                                  |
| `--qr`                                     |                | 打印公共 URL 的二维码（当有可用的公共 URL 时默认启用）                                                                                               |
| `--tunnel`                                 |                | 通过 Cloudflare 快速隧道暴露服务器                                                                                                                   |
| `--public`                                 |                | 监听所有网络接口，并允许任何主机连接                                                                                                                 |
| `--publicURL=<url>`                        |                | 要展示的公共 URL（用于二维码与剪贴板）                                                                                                               |
| `--https`                                  |                | 使用本地可信的开发证书启用 HTTPS                                                                                                                     |
| `--https.cert=<path>`                      |                | TLS 证书的路径                                                                                                                                       |
| `--https.key=<path>`                       |                | TLS 私钥的路径                                                                                                                                       |
| `--https.pfx=<path>`                       |                | PKCS#12（.p12/.pfx）密钥库的路径                                                                                                                     |
| `--https.passphrase=<passphrase>`          |                | TLS 私钥或密钥库的口令                                                                                                                               |
| `--https.validityDays=<days>`              |                | 生成的自签名证书的有效期天数                                                                                                                         |
| `--https.domains=<domain>...`              |                | 生成证书所使用的域名。可重复传入，也可以逗号分隔的列表形式给出。                                                                                     |
| `--profile=<verbose>`                      |                | 分析性能，在退出时写入一份 V8 CPU profile 和一份 JSON 报告。使用 `--profile=verbose` 获取完整的控制台报告。                                          |
<!--/dev-opts-->

端口和主机也可以通过 `NUXT_PORT`、`NITRO_PORT`、`PORT`、`NUXT_HOST`、`NITRO_HOST` 或 `HOST` 环境变量来设置。

该命令会将 `process.env.NODE_ENV` 设为 `development`。

## 交互式终端 UI

在交互式终端中，`nuxt dev` 会渲染一个固定面板：服务器 URL、启动进度、当前状态以及一行快捷键，日志则折叠在它上方。当输出不是终端、处于 CI 环境、已附加调试器，或终端尺寸过小时，它会退回到纯粹的日志流。

| 按键        | 操作                                          |
|-------------|-----------------------------------------------|
| `r`         | 重启开发服务器                                |
| `shift-r`   | 清空缓存后重启                                |
| `o`         | 在浏览器中打开应用                            |
| `y`         | 将服务器 URL 复制到剪贴板                     |
| `i`         | 查看版本、URL、二维码和会话信息               |
| `l`         | 浏览日志历史                                  |
| `e`         | 打开日志并定位到最后一次错误                  |
| `n`         | 浏览已提供服务的请求                          |
| `p`         | 浏览页面和服务端路由                          |
| `c`         | 清除日志、请求和控制台                        |
| `?`         | 显示全部快捷键                                |
| `q`         | 退出                                          |

在某个视图内，`y` 会复制当前选中的那一行，`shift-y` 则会复制经过筛选与搜索后保留下来的每一行；当内容多到无法全部粘贴时，会保留最新的条目。在 info 视图中，`shift-y` 改为复制 [`nuxt info`](/docs/api/commands/info) 表格。

### 追踪一次请求

在网络视图（`n`）中，选中一个请求并按下 `enter`，即可查看它的时间都花在了哪里。追踪会把服务器为该请求所做的全部工作绘制在同一条时间线上：路由中间件、服务端路由处理函数、Nuxt 插件、钩子、数据获取、渲染，以及你的应用向其他服务器发出的请求。在时间线下方，它会列出 Vite 为该请求编译模块花费的时间，按 Vite 插件和最慢模块细分，随后是该请求产生的日志。

追踪基于 Nuxt 与 Nitro 发布的[追踪通道（tracing channels）](https://nodejs.org/api/diagnostics_channel.html#class-tracingchannel)构建，因此它能显示多少内容取决于你所使用的版本。`nuxt dev` 会为你开启 `tracingChannel` 选项；在你的 `nuxt.config` 中设置 `tracingChannel: false` 即可退出。

### 禁用 UI

传入 `--no-tui` 或设置 `NUXT_TUI=plain` 可改为流式输出日志。你也可以通过传入 `NUXT_TUI=1` 强制_开启_ UI（不过当输出被管道传走或被重定向时，这不会产生任何效果）。

![带纯文本输出的 nuxt dev](/capture/output/nuxt-dev-plain-static.svg)

纯文本输出提供一组更小的快捷键：`r` 重启、`o` 打开、`u` 显示 URL、`qr` 显示二维码、`copy` 复制 URL、`c` 清空控制台、`h` 查看帮助以及 `q` 退出。

## 重启

当开发服务器重新加载或重启时，它会说明是什么引起的；而对 `nuxt.config` 的改动还会列出真正存在差异的键，因此由纯粹调整格式的编辑所触发的重启，与确实改变了配置的重启是可以区分的。重新加载是就地发生的；重启则会替换整个进程，而 `nuxt.config` 或已安装依赖的变更需要的正是重启。

## 接管正在运行的开发服务器

开发服务器会把自身记录在你的[构建目录](/docs/directory-structure/nuxt)内的 `nuxt.lock` 中，因此针对同一个项目的第二个 `nuxt dev` 会报告那个已在运行的实例，而不是与它争抢端口。传入 `--takeover` 可以停止它并在其位置启动，或者设置 `NUXT_IGNORE_LOCK=1` 强行运行第二个服务器（不受支持）。

使用 `--open` 时，交互提示还会提供“不停止该服务器而直接在浏览器中打开它”这一选项，当那个服务器是在终端中启动时这就是默认选择。`--open.url` 会相对于正在运行的服务器的 URL 来解析。

同一个锁文件也是 [`nuxt curl`](/docs/api/commands/curl) 与 [`nuxt task`](/docs/api/commands/task) 用来找到要通信的服务器的依据。

## HTTPS

`--https` 会通过 TLS 提供服务：如果安装了 `mkcert`，就用它生成一个本地可信的证书，否则生成一个自签名证书。`--https.cert` 和 `--https.key` 用于指定你已有的证书，而 `--https.pfx` 配合 `--https.passphrase` 用于指定一个 PKCS#12 密钥库。

:::note
Node 不会读取你的系统信任存储，因此从 Node 向使用所生成证书的服务器发起的请求不会信任该证书。请将 `NODE_EXTRA_CA_CERTS` 设置为签发该证书的证书颁发机构。
:::

## 调试

`--inspect` 会为你的服务端代码开启 Node.js inspector：服务端路由、中间件以及服务端渲染，它们运行在一个 Nitro worker 线程中。它接受一个可选的 `[host:]port`，默认为 `127.0.0.1:9229`，因此 Chrome DevTools（`chrome://inspect`）和大多数编辑器无需任何配置就能找到它。当服务器重新加载时，你的调试器会自动重新连接。

### 调试 CLI

而 `nuxt.config`、模块与构建钩子运行在 CLI 进程中，该进程会在下一个端口（默认 `9230`）上拥有自己的 inspector。在 `chrome://inspect` 中把 `localhost:9230` 添加为一个目标（**Configure...**），或者让你的编辑器指向它。

若要调试在 Nuxt 加载过程中就会运行的代码，请使用 `--inspect-brk`。此时 CLI 进程会在加载 Nuxt 之前，等待调试器附加到下一个端口：

```bash
npx nuxt dev --inspect-brk
```

`--profile` 会在进程退出时，把一份 V8 CPU profile 写入你项目中的 `nuxt-dev.cpuprofile`。`--profile=verbose` 还会向控制台输出一份完整的报告。

:::note
构建耗时、`perf-report.json` 和 `perf-trace.json` 来自 Nuxt 自身的构建性能分析，需要 Nuxt v4.4 或更高版本。在更早的版本上，CPU profile 依然会被写入。
:::

## 环境变量

| 变量                                  | 用途                                                                   |
|---------------------------------------|------------------------------------------------------------------------|
| `NUXT_PORT`、`NITRO_PORT`、`PORT`     | 监听的端口，按此优先级顺序                                             |
| `NUXT_HOST`、`NITRO_HOST`、`HOST`     | 监听的主机，按此优先级顺序                                             |
| `NUXT_TUI`                            | `1` 强制开启交互式 UI，`plain` 则不使用它                             |
| `NUXT_TERM_THEME`                     | 当无法检测终端背景时，使用 `light` 或 `dark`                           |
| `NUXT_IGNORE_LOCK`                    | `1` 表示忽略本项目上已在运行的开发服务器                               |
| `NUXT_IGNORE_UPDATE_CHECK`            | `1` 表示让 CLI 不再检查更新的 Nuxt 版本                                |

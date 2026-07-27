---
title: "nuxt dev"
description: dev 命令会在 http://localhost:3000 启动一个带有热模块替换（HMR）的开发服务器。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/dev.ts
    size: xs
---

<!--dev-cmd-->
```bash [Terminal]
npx nuxt dev [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv] [--envName] [-e, --extends=<layer-name>] [--clear] [--no-f, --no-fork] [-p, --port] [-h, --host] [--clipboard] [-o, --open] [--https] [--publicURL] [--qr] [--public] [--tunnel] [--profile[=verbose]] [--sslCert] [--sslKey]
```
<!--/dev-cmd-->

`dev` 命令会在 [http://localhost:3000](https://localhost:3000) 启动一个带有热模块替换（HMR）的开发服务器。

## 参数

<!--dev-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/dev-args-->

## 选项

<!--dev-opts-->
| 选项                                 | 默认值  | 描述                                                                                                                                               |
|--------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）                                                                                                   |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                                                                                                              |
| `--dotenv`                           |         | 要加载的 `.env` 文件路径，相对于根目录                                                                                                            |
| `--envName`                          |         | 解析配置覆盖时要使用的环境（构建时默认为 `production`，运行开发服务器时默认为 `development`）                                                     |
| `-e, --extends=<layer-name>`         |         | 从一个 Nuxt 层继承                                                                                                                                |
| `--clear`                            | `false` | 重启时清空控制台                                                                                                                                |
| `--no-f, --no-fork`                  |         | 禁用 fork 模式                                                                                                                                   |
| `-p, --port`                         |         | 监听的端口（默认值：`NUXT_PORT \| NITRO_PORT \| PORT \| nuxtOptions.devServer.port`）                                                          |
| `-h, --host`                         |         | 监听的主机（默认值：`NUXT_HOST \| NITRO_HOST \| HOST \| nuxtOptions.devServer?.host`）                                                         |
| `--clipboard`                        | `false` | 将 URL 复制到剪贴板                                                                                                                              |
| `-o, --open`                         | `false` | 在浏览器中打开 URL                                                                                                                              |
| `--https`                            |         | 启用 HTTPS                                                                                                                                       |
| `--publicURL`                        |         | 展示用的公共 URL（用于二维码）                                                                                                                  |
| `--qr`                               |         | 当可用时展示公共 URL 的二维码                                                                                                                    |
| `--public`                           |         | 监听所有网络接口                                                                                                                                |
| `--tunnel`                           |         | 使用 https://github.com/unjs/untun 打开一个隧道                                                                                                |
| `--profile` :badge[v4.4]{color="info" size="xs" class="align-middle"} |         | 分析性能。在退出时写入一份 V8 CPU profile 和 JSON 报告。使用 `--profile=verbose` 获取完整的控制台报告。                                          |
| `--sslCert`                          |         | （已弃用）请改用 `--https.cert`。                                                                                                                |
| `--sslKey`                           |         | （已弃用）请改用 `--https.key`。                                                                                                                |
<!--/dev-opts-->

端口和主机也可以通过 NUXT_PORT、PORT、NUXT_HOST 或 HOST 环境变量来设置。

除了上述选项，`@nuxt/cli` 还可以将选项透传给 `listhen`，例如 `--no-qr` 用于关闭开发服务器的二维码。你可以在 [unjs/listhen](https://github.com/unjs/listhen) 文档中找到 `listhen` 的选项列表。

该命令会将 `process.env.NODE_ENV` 设为 `development`。

:note
如果你在开发中使用的是自签名证书，你需要在环境中设置 `NODE_TLS_REJECT_UNAUTHORIZED=0`。
:

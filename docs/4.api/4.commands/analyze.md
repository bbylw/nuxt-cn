---
title: "nuxt analyze"
description: "分析生产构建包或你的 Nuxt 应用。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/analyze.ts
    size: xs
---

<!--analyze-cmd-->
```bash [Terminal]
npx nuxt analyze [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv=<path>...] [-e, --extends=<layer-name>...] [--name=<name>] [--serve] [--prerender] [--json]
```
<!--/analyze-cmd-->

`analyze` 命令会构建 Nuxt 并分析生产构建包（实验性）。构建完成后，结果会由一个本地服务器提供，除非你传入 `--no-serve`，或者环境中设置了 `CI`。

该服务器会链接到每一份报告：客户端构建包与 Nitro 服务端构建包。当只存在一份报告时，服务器会直接展示它。服务器使用 `PORT` 中的端口，或者使用 3000 端口。如果该端口已被占用，它会在 3000 到 3100 之间挑选一个空闲端口。

每一次运行都会被写入 [`analyzeDir`](https://nuxt.com/docs/api/nuxt-config#analyzedir) 下属于它自己的目录，目录名取自 `--name`（省略时为 `default`），因此你可以并列保留多次运行的结果，例如 `--name=before` 和 `--name=after`。使用相同名称再次运行只会替换那一次运行。目录名中除字母、数字、`_` 和 `-` 之外的字符都会被替换为 `_`，因此 `--name=after/fix` 和 `--name=after_fix` 会共用同一个目录。如果你设置了 `build.analyze.filename`，客户端报告将改为写入该路径。在 Nuxt 3 和 4 中，`nitro.analyze.filename` 对 Nitro 报告起到同样的作用。

传入 `--json` 可以把报告写成 JSON 而不是 HTML：即 `client.json` 和 `nitro.json`，采用 `rollup-plugin-visualizer` 的 `raw-data` 格式。它们包含每个模块的体积、该模块最终落入的 chunk，以及它的静态导入与动态导入。这使得它们很容易被脚本或 AI agent 处理。在这种模式下不会提供任何服务。以 `.html` 结尾的自定义报告文件名会被改为以 `.json` 扩展名写入。在使用 webpack 和 rspack 构建器时，`client.json` 是 webpack 的 stats 文件，而不是 `raw-data`。

在 Nuxt 5 中，Nitro 报告需要你的项目中装有 `rollup-plugin-visualizer`。如果缺少它，Nitro 报告会被跳过。使用 Vite 构建器时，Nuxt 还会提出把它作为开发依赖安装。

分析期间不会预渲染路由，因为预渲染会运行已构建好的应用，而它的产物并不是被度量的对象。如果你的分析需要预渲染，请传入 `--prerender`。

## 参数

<!--analyze-args-->
| 参数      | 描述                                                        |
|-----------|-------------------------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）                       |
<!--/analyze-args-->

## 选项

<!--analyze-opts-->
| 选项                                 | 默认值    | 描述                                                                                                                       |
|--------------------------------------|-----------|-----------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |           | 指定你的 Nuxt 项目的根目录                                                                                                 |
| `--logLevel=<silent\|info\|verbose>` |           | 指定构建时的日志级别                                                                                                       |
| `--dotenv=<path>...`                 |           | 要加载的 `.env` 文件路径，相对于根目录。可重复传入，靠后的文件优先级更高。                                                 |
| `-e, --extends=<layer-name>...`      |           | 从一个 Nuxt 层继承                                                                                                         |
| `--name=<name>`                      | `default` | 本次分析的名称                                                                                                             |
| `--serve`                            | `true`    | 为分析结果提供服务                                                                                                         |
| `--no-serve`                         |           | 跳过为分析结果提供服务                                                                                                     |
| `--prerender`                        | `false`   | 在分析时预渲染路由                                                                                                         |
| `--json`                             | `false`   | 将客户端与服务端构建包的分析结果写成 JSON 而不是 HTML（同时隐含 `--no-serve`）                                                 |
<!--/analyze-opts-->

:::note
该命令会将 `process.env.NODE_ENV` 设为 `production`。
:::

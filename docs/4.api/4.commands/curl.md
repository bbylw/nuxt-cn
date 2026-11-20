---
title: "nuxt curl"
description: curl 命令向正在运行的 Nuxt 开发服务器发送一个 HTTP 请求。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/curl.ts
    size: xs
---

<!--curl-cmd-->
```bash [Terminal]
npx nuxt curl <URL> [ROOTDIR] [--cwd=<directory>] [-X, --method=<method>] [-H, --header=<header>...] [-d, --data=<data>] [-i, --include] [-I, --head] [-v, --verbose] [--pretty]
```
<!--/curl-cmd-->

`curl` 命令会向为你的项目而运行的 `nuxt dev` 服务器发送一个 HTTP 请求，并打印响应。路径会相对于该服务器来解析，因此你无需知道它最终落在哪个端口上。

![nuxt curl](/capture/output/nuxt-curl.svg)

## 参数

<!--curl-args-->
| 参数              | 描述                                                              |
|-------------------|-------------------------------------------------------------------|
| `URL=<url\|path>` | 绝对 URL，或一个相对于正在运行的开发服务器解析的路径              |
| `ROOTDIR`         | 你的 Nuxt 项目的根目录（默认值：`.`）                             |
<!--/curl-args-->

## 选项

<!--curl-opts-->
| 选项                       | 默认值 | 描述                                                                                                                                     |
|----------------------------|--------|------------------------------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`        |        | 指定你的 Nuxt 项目的根目录                                                                                                               |
| `-X, --method=<method>`    |        | HTTP 方法（默认值：GET，当提供了请求体时为 POST）                                                                                        |
| `-H, --header=<header>...` |        | 以 `Name: Value` 形式给出的请求头。可重复传入。                                                                                          |
| `-d, --data=<data>`        |        | 请求体。使用 `@-` 从 stdin 读取，使用 `@<file>` 读取文件。                                                                               |
| `-i, --include`            |        | 在输出中包含响应状态行与响应头                                                                                                           |
| `-I, --head`               |        | 发送一个 `HEAD` 请求，仅显示响应头                                                                                                       |
| `-v, --verbose`            |        | 将请求头与响应头打印到 stderr                                                                                                            |
| `--pretty`                 |        | 对输出重新缩进并做语法高亮（默认值：输出为终端时开启，为管道时关闭）。使用 `--pretty`/`--no-pretty` 可强制是否重新缩进。              |
<!--/curl-opts-->

开发服务器是通过它写入你的[构建目录](/docs/directory-structure/nuxt)中的 `nuxt.lock` 文件找到的，因此该命令只在该项目正在运行 `nuxt dev` 时才可用。传入一个绝对 URL 即可与任何其他服务器通信。

**示例：**

```bash [Terminal]
# 请求正在运行的开发服务器上的一个路径
npx nuxt curl /api/hello

# 包含状态行与响应头
npx nuxt curl /api/hello -i

# 发送 JSON
npx nuxt curl /api/todos -X POST -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

# 从文件读取请求体，或使用 `@-` 从 stdin 读取
npx nuxt curl /api/todos -d @todo.json
```

当输出是终端时，JSON、HTML、XML 以及其他文本响应会被重新缩进并做语法高亮；当输出被管道传走时，则逐字节原样透传。使用 `--no-pretty` 可以关闭这一行为，在管道输出时也可以用 `--pretty` 强制开启。

:::note
当服务器返回 HTTP 错误状态时，该命令会以 `22` 退出码结束，与 `curl --fail` 的行为一致。
:::

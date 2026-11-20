---
title: "create nuxt"
description: init 命令用于初始化一个全新的 Nuxt 项目。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/create-nuxt/src/init.ts
    size: xs
---

<!--init-cmd-->
```bash [Terminal]
npm create nuxt@latest [DIR] -- [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [-t, --template=<template-name>] [-f, --force] [--offline] [--preferOffline] [--install] [--gitInit] [--shell] [--packageManager=<npm|pnpm|yarn|bun|deno|aube|nub|upm>] [-M, --modules=<module-names>] [--nightly=<dist-tag>]
```
<!--/init-cmd-->

`create-nuxt` 命令使用 [unjs/giget](https://github.com/unjs/giget) 初始化一个全新的 Nuxt 项目。它会询问要从哪个模板开始、是否安装模块、使用哪个包管理器，随后安装依赖并打印接下来要运行的命令。

![npm create nuxt](/capture/output/nuxt-init.svg)

:::note
`nuxt init` 已从 `@nuxt/cli` 中移除。请使用 `npm create nuxt@latest`，或你所用包管理器对应的等效命令。
:::

## 参数

<!--init-args-->
| 参数     | 描述     |
|----------|----------|
| `DIR=""` | 项目目录 |
<!--/init-args-->

## 选项

<!--init-opts-->
| 选项                                                            | 默认值  | 描述                                                                                 |
|-----------------------------------------------------------------|---------|--------------------------------------------------------------------------------------|
| `--cwd=<directory>`                                             | `.`     | 指定要在其中创建项目的目录                                                           |
| `--logLevel=<silent\|info\|verbose>`                            |         | 指定构建时的日志级别                                                                 |
| `-t, --template=<template-name>`                                |         | 模板名称                                                                             |
| `-f, --force`                                                   |         | 覆盖已存在的目录                                                                     |
| `--offline`                                                     |         | 强制使用离线模式                                                                     |
| `--preferOffline`                                               |         | 优先使用离线模式                                                                     |
| `--install`                                                     | `true`  | 项目脚手架搭建完成后安装依赖                                                         |
| `--no-install`                                                  |         | 跳过安装依赖                                                                         |
| `--gitInit`                                                     |         | 初始化 git 仓库                                                                      |
| `--no-gitInit`                                                  |         | 跳过初始化 git 仓库                                                                  |
| `--shell`                                                       |         | 在项目中安装完成后，于项目目录中启动 shell                                           |
| `--packageManager=<npm\|pnpm\|yarn\|bun\|deno\|aube\|nub\|upm>` |         | 包管理器选择                                                                         |
| `-M, --modules=<module-names>`                                  |         | 要安装的 Nuxt 模块（以逗号分隔且不含空格）                                           |
| `--no-modules`                                                  |         | 跳过模块安装提示                                                                     |
| `--nightly=<dist-tag>`                                          |         | 使用 Nuxt nightly 发布通道（一个 `nuxt-nightly` dist tag，默认为 `latest`）          |
<!--/init-opts-->

## 非交互式使用

当没有可用来提问的终端时，它本来要询问的答案就必须以参数的形式传入：目录、`--template`、`--packageManager` 和 `--gitInit`。任何缺失的项都会连同可用的模板一起被报告出来，并且命令会以 `2` 退出。

```bash [Terminal]
npm create nuxt@latest my-app -- --template minimal --packageManager pnpm --no-gitInit
```

:::note
使用 `npm create` 时必须加上 `--`，因为它会把初始化器之后形似标志的内容读作 npm 自身的配置，只会警告 `Unknown cli config` 而不会把它们继续传下去。其他包管理器会把整条命令行原样转发，所以可以直接向它们传递这些标志：`pnpm create nuxt@latest my-app --template minimal`。
:::

## 环境变量

- `NUXI_INIT_REGISTRY`：设置为自定义的模板 registry。（[了解更多](https://github.com/unjs/giget#custom-registry)）。
  - 默认的 registry 取自 [nuxt/starter/templates](https://github.com/nuxt/starter/tree/templates/templates)

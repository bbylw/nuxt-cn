---
title: "nuxt task"
description: "在你的开发服务器上列出并运行 Nitro 任务。"
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/tree/main/packages/nuxt-cli/src/commands/task
    size: xs
---

`task` 命令借助为你的项目而运行的 `nuxt dev` 服务器，与你的项目所暴露的 [Nitro 任务](https://nitro.build/guide/tasks)通信。传入 `--url` 可以指向另一个服务器。

## `nuxt task list`

<!--task-list-cmd-->
```bash [Terminal]
npx nuxt task list [ROOTDIR] [--cwd=<directory>] [--url=<url>] [--json]
```
<!--/task-list-cmd-->

![nuxt task list](/capture/output/nuxt-task-list.svg)

### 参数

<!--task-list-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/task-list-args-->

### 选项

<!--task-list-opts-->
| 选项                | 默认值 | 描述                                                                     |
|---------------------|--------|--------------------------------------------------------------------------|
| `--cwd=<directory>` |        | 指定你的 Nuxt 项目的根目录                                               |
| `--url=<url>`       |        | 要通信的 Nuxt 服务器的 URL（默认值：正在运行的开发服务器）               |
| `--json`            |        | 以 JSON 形式打印输出                                                     |
<!--/task-list-opts-->

## `nuxt task run`

<!--task-run-cmd-->
```bash [Terminal]
npx nuxt task run <NAME> [ROOTDIR] [--cwd=<directory>] [--url=<url>] [--payload=<json>]
```
<!--/task-run-cmd-->

### 参数

<!--task-run-args-->
| 参数          | 描述                                          |
|---------------|-----------------------------------------------|
| `NAME=<name>` | 要运行的任务的名称                            |
| `ROOTDIR`     | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/task-run-args-->

### 选项

<!--task-run-opts-->
| 选项                | 默认值 | 描述                                                                         |
|---------------------|--------|------------------------------------------------------------------------------|
| `--cwd=<directory>` |        | 指定你的 Nuxt 项目的根目录                                                   |
| `--url=<url>`       |        | 要通信的 Nuxt 服务器的 URL（默认值：正在运行的开发服务器）                   |
| `--payload=<json>`  |        | 任务载荷，可以是一个 JSON 对象，也可以是 `--payload.key=value` 键值对        |
<!--/task-run-opts-->

任务的执行结果会以 JSON 打印。载荷既可以写成单个 JSON 对象，也可以由一个个键逐步拼装而成：

```bash [Terminal]
npx nuxt task run db:seed --payload '{"count":10}'
npx nuxt task run db:seed --payload.count=10
```

:::note
只有在启用任务之后，Nitro 才会扫描你的 `tasks` 目录，因此一个没有暴露任何任务的服务器，可能只是缺少下面这段配置：

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  nitro: {
    experimental: {
      tasks: true,
    },
  },
})
```
:::

::read-more{to="https://nitro.build/guide/tasks" icon="i-simple-icons-nitro" target="\_blank"}
阅读更多关于 Nitro 任务的内容。
::

---
title: "nuxt typecheck"
description: typecheck 命令运行 vue-tsc 或 Golar 来检查整个应用的类型。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/typecheck.ts
    size: xs
---

<!--typecheck-cmd-->
```bash [Terminal]
npx nuxt typecheck [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dotenv=<path>...] [-e, --extends=<layer-name>...] [--checker=<vue-tsc|golar>] [-b, --build] [--incremental]
```
<!--/typecheck-cmd-->

`typecheck` 命令运行 [`vue-tsc`](https://github.com/vuejs/language-tools/tree/master/packages/tsc) 或 [Golar](https://golar.dev/languages/vue/) 来检查整个应用中的类型。如果两者都没有安装，它会给出适用于你的包管理器的安装命令。

## 参数

<!--typecheck-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/typecheck-args-->

## 选项

<!--typecheck-opts-->
| 选项                                 | 默认值  | 描述                                                                                                             |
|--------------------------------------|---------|------------------------------------------------------------------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定你的 Nuxt 项目的根目录                                                                                       |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                                                                             |
| `--dotenv=<path>...`                 |         | 要加载的 `.env` 文件路径，相对于根目录。可重复传入，靠后的文件优先级更高。                                       |
| `-e, --extends=<layer-name>...`      |         | 从一个 Nuxt 层继承                                                                                               |
| `--checker=<vue-tsc\|golar>`         |         | 要使用的类型检查器                                                                                               |
| `-b, --build`                        |         | 以构建模式进行类型检查，使用 TypeScript 项目引用（默认自动检测）                                                 |
| `--no-build`                         |         | 不使用 TypeScript 项目引用进行类型检查                                                                           |
| `--incremental`                      | `true`  | 复用先前运行产生的类型信息                                                                                       |
| `--no-incremental`                   |         | 从零开始进行类型检查，不复用先前运行产生的类型信息                                                               |
<!--/typecheck-opts-->

## 类型检查器

`--checker golar` 会改为运行 [Golar](https://golar.dev/languages/vue/) 而不是 `vue-tsc`，而你项目中的 `golar.config.*` 文件会让它成为默认。如果缺少配置文件，会为你写入一个。

## 构建模式

方案式的 `tsconfig.json`（只列出 `references` 的那一种）会自动以构建模式进行类型检查。`--build` 会强制启用它，`--no-build` 则将其关闭。

## 增量类型检查

在构建模式下，每次运行的类型信息会存储在 `tsconfig.json` 所引用的每个项目的 `tsBuildInfoFile` 中，因此后续运行只需重新检查发生变化的部分。从 Nuxt v4.7 起，Nuxt 生成的项目配置会把该信息存放在 `.nuxt/cache/typecheck` 中，而 `nuxt prepare` 与 `nuxt dev` 会保留这份缓存。当类型检查器或 TypeScript 版本发生变化时缓存会被丢弃；如果任何一个被引用的项目没有 `tsBuildInfoFile`，缓存也不会被使用。传入 `--no-incremental` 会移除已缓存的类型信息，并从零开始进行类型检查。

## 内存

类型检查器运行在它自己的进程中。除非你设置了 `--max-old-space-size`，否则 `vue-tsc` 的堆上限会被提高到你的机器（或它所在的容器）内存的一半，最高 8 GB，且不超过当前可用的内存。它永远不会被设置得比 Node 的默认值更低。Golar 在 JavaScript 堆之外进行类型检查，因此不会改动它的上限。

如果类型检查器被终止，例如因为内存耗尽，`nuxt typecheck` 会报告相应的信号，并以 `128` 加上信号编号作为退出码退出（`SIGABRT` 对应 `134`，`SIGKILL` 对应 `137`）。要自行提高堆上限：

```bash [Terminal]
NODE_OPTIONS=--max-old-space-size=8192 npx nuxt typecheck
```

:::note
该命令会将 `process.env.NODE_ENV` 设为 `production`。要覆盖它，请在 [`.env`](/docs/directory-structure/env) 文件中定义 `NODE_ENV`，或将其作为命令行参数传入。
:::

::read-more{to="/docs/guide/concepts/typescript#type-checking"}
阅读关于如何在构建时或开发时启用类型检查的更多内容。
::

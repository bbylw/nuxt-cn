---
title: "nuxt upgrade"
description: upgrade 命令将 Nuxt 升级到最新版本。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/upgrade.ts
    size: xs
---

<!--upgrade-cmd-->
```bash [Terminal]
npx nuxt upgrade [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dedupe] [-f, --force] [-ch, --channel=<stable|nightly|v4|v4-nightly|v5-nightly>]
```
<!--/upgrade-cmd-->

`upgrade` 命令会将 Nuxt 升级到最新版本。它会更新你 [`package.json`](/docs/directory-structure/package) 中的版本号，用你的包管理器重新安装依赖，并移除构建缓存。

`--channel` 用于选择升级到什么：`stable` 是最新的 release，`v4` 让你留在某一个大版本上，`nightly`、`v4-nightly` 或 `v5-nightly` 则对应 nightly 发布通道。

`--force` 会从零开始重新创建 lockfile 和 `node_modules`，`--dedupe` 则在包管理器支持的情况下，于升级之后对依赖进行去重。

被固定到 pnpm catalog 的依赖（`"nuxt": "catalog:"`）会在 `pnpm-workspace.yaml` 中升级，因为版本号实际存放于那里，而不是在 `package.json` 中。

## 参数

<!--upgrade-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/upgrade-args-->

## 选项

<!--upgrade-opts-->
| 选项                                                           | 默认值   | 描述                                                 |
|----------------------------------------------------------------|----------|------------------------------------------------------|
| `--cwd=<directory>`                                            |          | 指定你的 Nuxt 项目的根目录                           |
| `--logLevel=<silent\|info\|verbose>`                           |          | 指定构建时的日志级别                                 |
| `--dedupe`                                                     |          | 升级后对依赖去重                                     |
| `-f, --force`                                                  |          | 强制升级，重新创建 lockfile 和 node_modules          |
| `-ch, --channel=<stable\|nightly\|v4\|v4-nightly\|v5-nightly>` | `stable` | 指定要从中安装的通道                                 |
<!--/upgrade-opts-->

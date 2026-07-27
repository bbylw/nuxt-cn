---
title: "nuxt test"
description: test 命令使用 @nuxt/test-utils 运行测试。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/test.ts
    size: xs
---

<!--test-cmd-->
```bash [Terminal]
npx nuxt test [ROOTDIR] [--cwd=<directory>] [--logLevel=<silent|info|verbose>] [--dev] [--watch]
```
<!--/test-cmd-->

`test` 命令使用 [`@nuxt/test-utils`](/docs/getting-started/testing) 运行测试。如果该环境变量尚未设置，此命令会将 `process.env.NODE_ENV` 设为 `test`。

## 参数

<!--test-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/test-args-->

## 选项

<!--test-opts-->
| 选项                                 | 默认值  | 描述                                                       |
|--------------------------------------|---------|-----------------------------------------------------------|
| `--cwd=<directory>`                  |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）           |
| `--logLevel=<silent\|info\|verbose>` |         | 指定构建时的日志级别                                      |
| `--dev`                              |         | 在开发模式下运行                                          |
| `--watch`                            |         | 监听模式                                                  |
<!--/test-opts-->

:note
该命令会将 `process.env.NODE_ENV` 设为 `test`。
:

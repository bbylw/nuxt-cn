---
title: "nuxt devtools"
description: devtools 命令允许你基于每个项目启用或禁用 Nuxt DevTools。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/devtools.ts
    size: xs
---

<!--devtools-cmd-->
```bash [Terminal]
npx nuxt devtools <COMMAND> [ROOTDIR] [--cwd=<directory>]
```
<!--/devtools-cmd-->

运行 `nuxt devtools enable` 会在全局安装 Nuxt DevTools，同时也会在你正在使用的特定项目中启用它。它会作为偏好被保存在你用户级别的 `.nuxtrc` 中。如果你想为某个特定项目移除 devtools 支持，可以运行 `nuxt devtools disable`。

## 参数

<!--devtools-args-->
| 参数         | 描述                                        |
|--------------|---------------------------------------------|
| `COMMAND`    | 要运行的命令（可选项：<enable\|disable>）  |
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                 |
<!--/devtools-args-->

## 选项

<!--devtools-opts-->
| 选项              | 默认值  | 描述                                                       |
|-------------------|---------|-----------------------------------------------------------|
| `--cwd=<directory>` |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）           |
<!--/devtools-opts-->

:read-more{icon="i-simple-icons-nuxtdotjs" to="https://devtools.nuxt.com" target="_blank"}
阅读更多关于 **Nuxt DevTools** 的内容。
:

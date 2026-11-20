---
title: "nuxt devtools"
description: devtools 命令允许你按项目启用或禁用 Nuxt DevTools。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/devtools.ts
    size: xs
---

<!--devtools-cmd-->
```bash [Terminal]
npx nuxt devtools <COMMAND> [ROOTDIR] [--cwd=<directory>]
```
<!--/devtools-cmd-->

运行 `nuxt devtools enable` 会全局安装 Nuxt DevTools，并在你当前使用的项目中启用它。该偏好会保存在你的用户级 `.nuxtrc` 中。如果你想移除某个项目的 devtools 支持，可以运行 `nuxt devtools disable`。

## 参数

<!--devtools-args-->
| 参数                        | 描述                                          |
|-----------------------------|-----------------------------------------------|
| `COMMAND=<enable\|disable>` | 要运行的命令                                  |
| `ROOTDIR`                   | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/devtools-args-->

## 选项

<!--devtools-opts-->
| 选项                | 默认值 | 描述                             |
|---------------------|--------|----------------------------------|
| `--cwd=<directory>` |        | 指定你的 Nuxt 项目的根目录       |
<!--/devtools-opts-->

::read-more{icon="i-simple-icons-nuxtdotjs" to="https://devtools.nuxt.com" target="\_blank"}
阅读关于 **Nuxt DevTools** 的更多内容。
::

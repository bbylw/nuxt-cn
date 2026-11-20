---
title: "nuxt info"
description: info 命令会输出当前或指定 Nuxt 项目的相关信息。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/info.ts
    size: xs
---

<!--info-cmd-->
```bash [Terminal]
npx nuxt info [ROOTDIR] [--cwd=<directory>] [--json]
```
<!--/info-cmd-->

`info` 命令会输出当前或指定 Nuxt 项目的相关信息：它所解析出的 Nuxt、Nitro 与 Vite 版本、包管理器、它加载的模块，以及其配置中的构建模块。当你想在脚本中读取这些信息时，请使用 `--json`。

## 参数

<!--info-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/info-args-->

## 选项

<!--info-opts-->
| 选项                | 默认值 | 描述                             |
|---------------------|--------|----------------------------------|
| `--cwd=<directory>` |        | 指定你的 Nuxt 项目的根目录       |
| `--json`            |        | 以 JSON 形式打印项目信息         |
<!--/info-opts-->

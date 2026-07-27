---
title: "nuxt info"
description: info 命令会记录当前或指定 Nuxt 项目的相关信息。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxi/src/commands/info.ts
    size: xs
---

<!--info-cmd-->
```bash [Terminal]
npx nuxt info [ROOTDIR] [--cwd=<directory>]
```
<!--/info-cmd-->

`info` 命令会记录当前或指定 Nuxt 项目的相关信息。

## 参数

<!--info-args-->
| 参数         | 描述                                       |
|--------------|--------------------------------------------|
| `ROOTDIR="."`| 指定工作目录（默认值：`.`）                |
<!--/info-args-->

## 选项

<!--info-opts-->
| 选项              | 默认值  | 描述                                                       |
|-------------------|---------|-----------------------------------------------------------|
| `--cwd=<directory>` |         | 指定工作目录，优先级高于 ROOTDIR（默认值：`.`）           |
<!--/info-opts-->

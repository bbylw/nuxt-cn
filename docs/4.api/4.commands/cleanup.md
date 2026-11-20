---
title: 'nuxt cleanup'
description: '移除常见的 Nuxt 生成文件和缓存。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/cleanup.ts
    size: xs
---

<!--cleanup-cmd-->
```bash [Terminal]
npx nuxt cleanup [ROOTDIR] [--cwd=<directory>]
```
<!--/cleanup-cmd-->

`cleanup` 命令会移除常见的 Nuxt 生成文件和缓存，包括：

- 你的构建目录，即 `.nuxt`，除非 [`buildDir`](/docs/api/nuxt-config#builddir) 另有指定
- `.output`
- `dist`
- `node_modules/.vite`
- `node_modules/.cache`

## 参数

<!--cleanup-args-->
| 参数      | 描述                                          |
|-----------|-----------------------------------------------|
| `ROOTDIR` | 你的 Nuxt 项目的根目录（默认值：`.`）         |
<!--/cleanup-args-->

## 选项

<!--cleanup-opts-->
| 选项                | 默认值 | 描述                                     |
|---------------------|--------|------------------------------------------|
| `--cwd=<directory>` |        | 指定你的 Nuxt 项目的根目录               |
<!--/cleanup-opts-->

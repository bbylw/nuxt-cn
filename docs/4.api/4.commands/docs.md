---
title: "nuxt docs"
description: docs 命令会在你的项目所使用的 Nuxt 版本的文档中进行搜索。
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/cli/blob/main/packages/nuxt-cli/src/commands/docs.ts
    size: xs
---

<!--docs-cmd-->
```bash [Terminal]
npx nuxt docs [QUERY] [--cwd=<directory>] [--open]
```
<!--/docs-cmd-->

`docs` 命令会搜索 Nuxt 文档，并在浏览器中打开最匹配的一项。不带查询词时，它会打开文档首页。

## 参数

<!--docs-args-->
| 参数    | 描述                                 |
|---------|--------------------------------------|
| `QUERY` | 用于在文档中搜索的若干关键词         |
<!--/docs-args-->

## 选项

<!--docs-opts-->
| 选项                | 默认值 | 描述                                             |
|---------------------|--------|--------------------------------------------------|
| `--cwd=<directory>` | `.`    | 指定你的 Nuxt 项目的根目录                       |
| `--open`            | `true` | 在浏览器中打开最匹配的一项                       |
| `--no-open`         |        | 打印匹配的页面，而不在浏览器中打开               |
<!--/docs-opts-->

结果先按页面标题排序，再按小节标题排序，最后按描述排序；在打开最佳匹配之前，会先把匹配到的各项打印出来。当有多个页面命中且终端支持交互时，会询问你要打开哪一个。

```bash [Terminal]
npx nuxt docs "server routes"
```

搜索针对的是项目所依赖的 Nuxt 版本对应的文档，而不是当前线上发布的版本，因此答案与你正在使用的版本相符。当项目中安装了 `@nuxt/docs` 时会使用它，否则将其下载后使用。

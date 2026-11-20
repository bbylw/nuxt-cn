---
navigation.title: 'Dev Containers'
title: Dev Containers
description: 在开发容器中设置或打开 Nuxt 项目，以获得一致开发环境。
---

## 设置开发容器

如果你正在启动一个新 Nuxt 项目，并希望在开发容器内开发，可以自行添加配置。

::read-more{to="https://code.visualstudio.com/docs/devcontainers/containers" target="_blank"}
阅读更多关于开发容器的内容
::

### 前置条件

- 已安装 [Visual Studio Code](https://code.visualstudio.com/) 及 [Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
- 已安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/) 或 [Docker Engine](https://docs.docker.com/engine/)

### 创建配置

在项目根目录创建 `.devcontainer/` 文件夹，并放入以下两个文件：

```json [devcontainer.json]
{
  "name": "nuxt-devcontainer",
  "build": {
    "dockerfile": "Dockerfile",
    "context": "../"
  },
  "forwardPorts": [3000],
  "portsAttributes": {
    "3000": {
      "label": "Application",
      "onAutoForward": "openPreview"
    }
  },
  "mounts": [
    "type=volume,target=${containerWorkspaceFolder}/node_modules"
  ],
  "postStartCommand": "pnpm install && pnpm dev:prepare"
}
```

```dockerfile [Dockerfile]
FROM node:lts

WORKDIR /app

RUN npm i -g corepack && corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml  ./
RUN pnpm install --frozen-lockfile

COPY . .
```

该配置使用 Node.js LTS，并通过 corepack 启用 pnpm。它会转发 3000 端口给 Nuxt 开发服务器，并将 `node_modules` 持久化到 Docker 卷中，以避免容器重启时重新安装。

:::tip
要使用不同的包管理器，请将 `corepack enable` 替换为你偏好的管理器（例如 `npm install -g yarn`），并相应更新 `postStartCommand`。
:::

## 打开已有的开发容器

如果某个项目已经包含开发容器配置，你可以使用以下任意方法打开它：

### 1. VS Code 提示

当你在 VS Code 中打开项目时，应在右下角看到一条通知：

> "Reopen in Dev Containers"（在开发容器中重新打开）

点击此按钮，在开发容器中构建并打开项目。

### 2. 命令面板

如果你关闭了提示，或想手动触发：

1. 打开命令面板（Mac 上是 `Cmd+Shift+P`，Windows/Linux 上是 `Ctrl+Shift+P`）
2. 搜索 **"Dev Containers: Reopen in Container"**
3. 选择它

VS Code 会构建容器并重新打开你的项目。

### 3. Dev Containers CLI

对于高级用户或 CI 流程，你可以直接使用 Dev Containers CLI：

```bash
# 安装 CLI（如果尚未安装）
npm install -g @devcontainers/cli

# 在容器中构建并打开项目
devcontainer up --workspace-folder .

# 修改 .devcontainer 后重新构建
devcontainer build
```

## 后续步骤

容器运行后：

```bash
pnpm dev
```

你的 Nuxt 应用将可在 <http://localhost:3000> 访问。

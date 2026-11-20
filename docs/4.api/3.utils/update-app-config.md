---
title: 'updateAppConfig'
description: '在运行时更新 App Config。'
links:
  - label: Source
    icon: i-simple-icons-github
    to: https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/app/config.ts
    size: xs
---

::note
使用深层赋值来更新 [`app.config`](/docs/directory-structure/app/app-config)。已有的（嵌套）属性会被保留。
::

## 用法

```js
import { updateAppConfig, useAppConfig } from '#imports'

const appConfig = useAppConfig() // { foo: 'bar' }

const newAppConfig = { foo: 'baz' }
updateAppConfig(newAppConfig)

console.log(appConfig) // { foo: 'baz' }
```

:read-more{to="/docs/directory-structure/app/app-config"}

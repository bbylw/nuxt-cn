import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { resolve } from 'node:path'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        prefix: '/docs',
        cwd: resolve('../docs'),
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        navigation: z.any().optional(),
      }),
    }),
  },
})

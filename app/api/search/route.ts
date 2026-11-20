import { createSearchAPI } from 'fumadocs-core/search/server'
import { buildSearchIndexes } from '@/lib/search'
import { createZhTokenizer } from '@/lib/tokenizer'

export const dynamic = 'force-static'
export const revalidate = false

const api = createSearchAPI('simple', {
  indexes: buildSearchIndexes(),
  tokenizer: createZhTokenizer(),
})

export const GET = api.staticGET
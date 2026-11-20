'use client'

import { useEffect, useState } from 'react'
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search'
import { createContentHighlighter, type ReactSortedResult } from 'fumadocs-core/search'
import { create, load, search, type AnyOrama } from '@orama/orama'
import { createZhTokenizer } from '@/lib/tokenizer'

const schema = {
  url: 'string',
  title: 'string',
  breadcrumbs: 'string[]',
  description: 'string',
  content: 'string',
  keywords: 'string',
} as const

// fumadocs-core 15.8.5 的 static 搜索把 {type, db} 包装对象直接传给 orama，
// 导致 "Cannot read properties of undefined (reading 'index')"，这里自行实现静态搜索
let dbPromise: Promise<AnyOrama> | null = null
function loadDB(): Promise<AnyOrama> {
  dbPromise ??= fetch('/api/search')
    .then((res) => {
      if (!res.ok) throw new Error(`failed to load search index: ${res.status}`)
      return res.json()
    })
    .then((data) => {
      const db = create({ schema, components: { tokenizer: createZhTokenizer() } })
      load(db, data)
      return db
    })
  return dbPromise
}

async function searchDocs(term: string): Promise<ReactSortedResult[]> {
  const db = await loadDB()
  const highlighter = createContentHighlighter(term)
  const result = await search(db, { term, tolerance: 1, boost: { title: 2 } })
  return result.hits.map((hit) => {
    const doc = hit.document as unknown as { url: string; title: string; breadcrumbs?: string[] }
    return {
      type: 'page',
      id: doc.url,
      url: doc.url,
      content: doc.title,
      breadcrumbs: doc.breadcrumbs,
      contentWithHighlights: highlighter.highlight(doc.title),
    }
  })
}

function useZhSearch() {
  const [searchText, setSearchText] = useState('')
  const [items, setItems] = useState<ReactSortedResult[] | 'empty'>('empty')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (searchText.length === 0) {
      setItems('empty')
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    const timer = setTimeout(() => {
      searchDocs(searchText)
        .then((res) => {
          if (!cancelled) setItems(res)
        })
        .catch(() => {
          if (!cancelled) setItems([])
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false)
        })
    }, 100)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [searchText])

  return { search: searchText, setSearch: setSearchText, isLoading, items }
}

export default function ZhSearchDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { search: searchText, setSearch, isLoading, items } = useZhSearch()

  return (
    <SearchDialog search={searchText} onSearchChange={setSearch} isLoading={isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="搜索文档…" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={items !== 'empty' ? items : null} />
      </SearchDialogContent>
    </SearchDialog>
  )
}
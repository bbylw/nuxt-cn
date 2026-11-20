'use client'

import { useDocsSearch } from 'fumadocs-core/search/client'
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
import { create } from '@orama/orama'
import { createZhTokenizer } from '@/lib/tokenizer'

const schema = {
  url: 'string',
  title: 'string',
  breadcrumbs: 'string[]',
  description: 'string',
  content: 'string',
  keywords: 'string',
} as const

export default function ZhSearchDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: '/api/search',
    initOrama: () =>
      create({
        schema,
        components: { tokenizer: createZhTokenizer() },
      }),
  })

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput placeholder="搜索文档…" />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  )
}
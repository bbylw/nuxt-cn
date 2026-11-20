import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMdc from 'remark-mdc'
import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Index } from 'fumadocs-core/search/server'
import { source, readDoc } from './source'

/** 提取纯文本（去掉代码块与 HTML），用于搜索索引 */
function extractText(markdown: string): string {
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkMdc)
  const tree = processor.parse(markdown) as Root
  const parts: string[] = []
  visit(tree, (node, index, parent) => {
    if (node.type === 'code' || node.type === 'inlineCode' || node.type === 'html') {
      if (parent && typeof index === 'number') {
        parent.children.splice(index, 1)
        return index
      }
      return
    }
    if (node.type === 'text' || node.type === 'heading') {
      if (node.type === 'text') parts.push(node.value)
    }
  })
  return parts.join('\n')
}

export function buildSearchIndexes(): Index[] {
  return source.getPages().map((page) => {
    const { content } = readDoc(page.data.filePath as string)
    return {
      title: page.data.title,
      description: page.data.description,
      url: page.url,
      content: extractText(content),
    }
  })
}
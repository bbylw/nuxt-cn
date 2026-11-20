/** 基于 Intl.Segmenter 的中文分词器，服务端建索引与客户端查询共用 */
export function createZhTokenizer() {
  const segmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' })
  return {
    language: 'zh',
    tokenize(text: string): string[] {
      const out: string[] = []
      for (const part of segmenter.segment(text)) {
        if (part.isWordLike) out.push(part.segment.toLowerCase())
      }
      return out
    },
  }
}
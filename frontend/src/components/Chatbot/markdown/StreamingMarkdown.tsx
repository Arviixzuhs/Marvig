import React from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { splitBlocks } from './splitBlocks'

// Solo se re-parsea el último bloque (el que está creciendo)
export const StreamingMarkdown = React.memo(({ text }: { text: string }) => {
  const blocks = React.useMemo(() => splitBlocks(text), [text])

  return (
    <>
      {blocks.map((block, i) => (
        <MarkdownRenderer key={i} content={block} />
      ))}
    </>
  )
})

StreamingMarkdown.displayName = 'StreamingMarkdown'

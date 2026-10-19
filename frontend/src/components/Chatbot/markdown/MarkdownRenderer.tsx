import React from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { markdownComponents } from './markdownComponents'

// Referencia estable, no se recrea en cada render
const remarkPlugins = [remarkGfm]

export const MarkdownRenderer = React.memo(({ content }: { content: string }) => (
  <ReactMarkdown remarkPlugins={remarkPlugins} components={markdownComponents}>
    {content}
  </ReactMarkdown>
))

MarkdownRenderer.displayName = 'MarkdownRenderer'

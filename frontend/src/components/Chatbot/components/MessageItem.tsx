import React from 'react'
import { AuthorType } from '@/features/chatbotSlice'
import type { ChatMessage, StreamPhase } from '../types'
import { MessageBubble } from './MessageBubble'
import { MessageActions } from './MessageActions'
import { TypingIndicator } from './TypingIndicator'
import { MarkdownRenderer } from '../markdown/MarkdownRenderer'
import { StreamingMarkdown } from '../markdown/StreamingMarkdown'

interface Props {
  msg: ChatMessage
  phase: StreamPhase
  streamText: string
  onCopy: (text: string) => void
}

export const MessageItem = React.memo(({ msg, phase, streamText, onCopy }: Props) => {
  const isUser = msg.authorType === AuthorType.USER
  const showDots = phase === 'waiting' || (phase === 'idle' && msg.isTyping && !msg.content)
  const showActions = !isUser && phase === 'idle' && !msg.isTyping

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      {showDots ? (
        <TypingIndicator />
      ) : phase === 'streaming' ? (
        <MessageBubble isUser={false}>
          <StreamingMarkdown text={streamText} />
        </MessageBubble>
      ) : (
        <MessageBubble isUser={isUser}>
          <MarkdownRenderer content={msg.content} />
        </MessageBubble>
      )}

      {showActions && <MessageActions content={msg.content} onCopy={onCopy} />}
    </div>
  )
})

MessageItem.displayName = 'MessageItem'

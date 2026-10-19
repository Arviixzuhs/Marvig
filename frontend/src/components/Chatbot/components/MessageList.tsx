import type { ChatMessage, StreamPhase, StreamState } from '../types'
import { MessageItem } from './MessageItem'

interface Props {
  messages: ChatMessage[]
  stream: StreamState | null
  streamText: string
  onCopy: (text: string) => void
}

export const MessageList = ({ messages, stream, streamText, onCopy }: Props) => (
  <div className='space-y-6'>
    {messages.map((msg) => {
      const phase: StreamPhase =
        stream?.id === msg.id ? (stream.started ? 'streaming' : 'waiting') : 'idle'

      return (
        <MessageItem
          key={msg.id}
          msg={msg}
          phase={phase}
          streamText={phase === 'streaming' ? streamText : ''}
          onCopy={onCopy}
        />
      )
    })}
  </div>
)

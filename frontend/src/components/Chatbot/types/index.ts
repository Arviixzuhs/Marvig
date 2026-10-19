import type { AuthorType } from '@/features/chatbotSlice'

export type StreamPhase = 'idle' | 'waiting' | 'streaming'

export interface StreamState {
  id: string
  started: boolean
}

export interface ChatMessage {
  id: string | number
  authorType: AuthorType
  content: string
  isTyping?: boolean
}

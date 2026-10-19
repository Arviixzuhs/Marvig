import React from 'react'
import { cn } from '@heroui/react'

interface Props {
  isUser: boolean
  children: React.ReactNode
}

export const MessageBubble = ({ isUser, children }: Props) => (
  <div
    className={cn(
      'px-4 py-3 rounded-2xl text-sm relative min-w-0 break-words',
      isUser
        ? 'max-w-[80%] bg-blue-600 text-white shadow-md'
        : 'max-w-[92%] bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/5 text-default-800 dark:text-white shadow-sm',
    )}
  >
    {children}
  </div>
)

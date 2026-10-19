import React from 'react'
import { RootState } from '@/store'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { cn } from '@heroui/react'
import { marvigAIService } from '@/services/marvigIA'
import {
  addChat,
  setValue,
  setLoading,
  setMyChats,
  setMessages,
  setPendingMessage,
} from '@/features/chatbotSlice'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { useChatStream } from '../hooks/useChatStream'
import { WelcomeScreen } from './WelcomeScreen'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

export const ChatbotMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = searchParams.get('chatId')

  const dispatch = useDispatch()
  const isNewlyCreatedChat = React.useRef(false)

  const userName = useSelector((state: RootState) => state.user?.data?.name || 'Usuario')
  const {
    value: input,
    messages,
    isLoading,
    pendingMessage,
  } = useSelector((state: RootState) => state.chatbot)

  const { endRef, scrollToBottom } = useAutoScroll()
  const { stream, streamText, sendMessage, cancel } = useChatStream(scrollToBottom)

  const isBusy = isLoading || stream !== null || !!pendingMessage

  const handleCopy = React.useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  // Lista de chats del usuario
  React.useEffect(() => {
    marvigAIService
      .getMyChats()
      .then((res) => dispatch(setMyChats(res.data)))
      .catch(console.error)
  }, [dispatch])

  // Mensaje pendiente tras crear un chat nuevo
  React.useEffect(() => {
    if (chatId && pendingMessage) {
      sendMessage(pendingMessage, chatId)
      dispatch(setPendingMessage(null))
    }
  }, [chatId, pendingMessage, sendMessage, dispatch])

  // Carga el historial al cambiar de chat
  React.useEffect(() => {
    if (!chatId) {
      dispatch(setMessages([]))
      isNewlyCreatedChat.current = false
      return
    }

    if (isNewlyCreatedChat.current) {
      isNewlyCreatedChat.current = false
      return
    }

    dispatch(setLoading(true))

    marvigAIService
      .getMessagesByChatId(chatId, 1, 10)
      .then((res) => {
        dispatch(setMessages(res.data))
        requestAnimationFrame(scrollToBottom)
      })
      .finally(() => dispatch(setLoading(false)))
  }, [chatId, dispatch, scrollToBottom])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isBusy) return

    if (!chatId) {
      dispatch(setPendingMessage(trimmed))
      dispatch(setValue(''))

      try {
        const title = trimmed.split(' ').slice(0, 5).join(' ').substring(0, 40)
        const res = await marvigAIService.createChat(title)

        dispatch(addChat(res.data))
        isNewlyCreatedChat.current = true
        setSearchParams({ chatId: String(res.data.id) })
      } catch (e) {
        console.error(e)
        dispatch(setPendingMessage(null))
      }
      return
    }

    sendMessage(trimmed, chatId)
    dispatch(setValue(''))
  }

  const hasMessages = messages.length > 0

  return (
    <div
      className={cn(
        'flex-1 flex flex-col min-w-0 bg-transparent p-4 md:p-6',
        !hasMessages ? 'justify-center items-center' : 'justify-between',
      )}
    >
      <div
        className={cn(
          'w-full hoverScrollbar',
          hasMessages ? 'flex-1 overflow-y-auto space-y-6 mb-4' : 'flex-initial mb-8',
        )}
      >
        <AnimatePresence mode='wait'>
          {!hasMessages ? (
            <WelcomeScreen key='welcome' userName={userName} />
          ) : (
            <MessageList
              key='messages'
              messages={messages}
              stream={stream}
              streamText={streamText}
              onCopy={handleCopy}
            />
          )}
        </AnimatePresence>

        <div ref={endRef} />
      </div>

      <ChatInput
        value={input}
        isBusy={isBusy}
        isStreaming={stream !== null}
        compact={!hasMessages}
        onChange={(v) => dispatch(setValue(v))}
        onSend={handleSend}
        onStop={cancel}
      />
    </div>
  )
}

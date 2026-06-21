import React from 'react'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { RootState } from '@/store'
import { useSearchParams } from 'react-router-dom'
import { marvigAIService } from '@/services/marvigIA'
import { paramsConstructor } from '@/utils/paramsConstructor'
import { Copy, Send, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Button, cn, Textarea, Tooltip } from '@heroui/react'
import {
  addChat,
  setValue,
  addMessage,
  AuthorType,
  setLoading,
  setMyChats,
  setMessages,
  updateMessage,
  setErrorMessage,
  setPendingMessage,
  finishTypingMessage,
  setShouldScrollToBottom,
} from '@/features/chatbotSlice'

export const ChatbotMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = searchParams.get('chatId')

  const dispatch = useDispatch()
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

  const userName = useSelector((state: any) => state.user?.name || 'Usuario')

  const {
    value: input,
    messages,
    isLoading,
    pendingMessage,
    shouldScrollToBottom,
  } = useSelector((state: RootState) => state.chatbot)

  const isNewlyCreatedChat = React.useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  React.useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom()
      dispatch(setShouldScrollToBottom(false))
    }
  }, [messages, shouldScrollToBottom, dispatch])

  React.useEffect(() => {
    marvigAIService
      .getMyChats()
      .then((res) => {
        dispatch(setMyChats(res.data))
      })
      .catch((err) => console.error('Error al cargar chats:', err))
  }, [dispatch])

  React.useEffect(() => {
    if (chatId && pendingMessage) {
      sendMessage(pendingMessage, chatId)
      dispatch(setPendingMessage(null))
    }
  }, [chatId, pendingMessage])

  React.useEffect(() => {
    if (!chatId) {
      dispatch(setMessages([]))
      isNewlyCreatedChat.current = false
    } else {
      if (isNewlyCreatedChat.current) {
        isNewlyCreatedChat.current = false
        return
      }

      dispatch(setLoading(true))
      marvigAIService
        .getMessagesByChatId(chatId, 1, 10)
        .then((res) => {
          dispatch(setMessages(res.data))
          dispatch(setShouldScrollToBottom(true))
        })
        .catch((err) => console.error('Error cargando mensajes del chat:', err))
        .finally(() => dispatch(setLoading(false)))
    }
  }, [chatId, dispatch])

  const handleSend = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    if (!chatId) {
      const chatTitle = trimmedInput.split(' ').slice(0, 5).join(' ').substring(0, 40)
      dispatch(setPendingMessage(trimmedInput))
      dispatch(setValue(''))

      try {
        const res = await marvigAIService.createChat(chatTitle)
        dispatch(addChat(res.data))
        isNewlyCreatedChat.current = true
        setSearchParams({ chatId: String(res.data.id) })
      } catch (error) {
        console.error('Error al inicializar el chat:', error)
      }
      return
    }

    sendMessage(trimmedInput, chatId)
    dispatch(setValue(''))
  }

  const handleCopyContainer = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const sendMessage = (messageContent: string, activeChatId: string) => {
    const userMsgId = Date.now().toString()
    const aiMsgId = String(Date.now() + 1)

    dispatch(
      addMessage({
        id: userMsgId,
        authorType: AuthorType.USER,
        content: messageContent,
      }),
    )

    dispatch(
      addMessage({
        id: aiMsgId,
        authorType: AuthorType.CHATBOT,
        content: '',
        isTyping: true,
      }),
    )

    dispatch(setLoading(true))
    dispatch(setShouldScrollToBottom(true))

    const chatStreamParams = paramsConstructor([
      { name: 'userMessage', value: encodeURIComponent(messageContent) },
      { name: 'chatId', value: activeChatId },
    ])

    try {
      const eventSource = new EventSource(
        `${import.meta.env['VITE_CHATBOT_API']}/bot-ai/chat-stream?${chatStreamParams}`,
        { withCredentials: true },
      )

      let fullResponse = ''

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data === '[DONE]') {
          eventSource.close()
          dispatch(setLoading(false))
          dispatch(finishTypingMessage({ id: aiMsgId, content: fullResponse }))
          return
        }

        if (data) {
          fullResponse += data
          dispatch(updateMessage({ id: aiMsgId, content: fullResponse }))
          dispatch(setShouldScrollToBottom(true))
        }
      }

      eventSource.onerror = (error) => {
        console.error('EventSource error:', error)
        eventSource.close()
        dispatch(setLoading(false))
        if (!fullResponse) {
          dispatch(setErrorMessage({ id: aiMsgId, error: '❌ Error al obtener respuesta' }))
        }
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error)
      dispatch(setLoading(false))
      dispatch(setErrorMessage({ id: aiMsgId, error: '❌ Error de conexión' }))
    }
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
            <motion.div
              key='welcome-screen'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col items-center text-center max-w-2xl mx-auto'
            >
              <div className='p-4 bg-orange-500/10 rounded-2xl mb-4 text-orange-500'>
                <Sparkles size={40} className='animate-pulse' />
              </div>
              <h2 className='text-3xl md:text-4xl font-semibold tracking-tight text-default-900 dark:text-white leading-normal'>
                Bienvenido,{' '}
                <span className='bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent'>
                  {userName}
                </span>
              </h2>
              <p className='text-default-500 mt-2 max-w-sm text-sm'>¿Qué tienes en mente?</p>
            </motion.div>
          ) : (
            <div className='space-y-6'>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex flex-col ${msg.authorType === AuthorType.USER ? 'items-end' : 'items-start'}`}
                >
                  {msg.isTyping ? (
                    <div className='chat-typing-container px-4 py-3 bg-white/50 dark:bg-white/10 rounded-2xl border border-white/20 dark:border-white/5'>
                      <div className='typing-dot'></div>
                      <div className='typing-dot'></div>
                      <div className='typing-dot'></div>
                    </div>
                  ) : (
                    <div
                      className={cn(
                        'max-w-[80%] px-4 py-3 rounded-2xl text-sm relative',
                        msg.authorType === AuthorType.USER
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/5 text-default-800 dark:text-white shadow-sm',
                      )}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          ul: ({ ...props }) => <ul className='list-disc ml-4 my-2' {...props} />,
                          ol: ({ ...props }) => (
                            <ol className='list-decimal ml-4 my-2' {...props} />
                          ),
                          li: ({ ...props }) => <li className='mb-1' {...props} />,
                          p: ({ ...props }) => <p className='leading-relaxed' {...props} />,
                          strong: ({ ...props }) => <strong className='font-bold' {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  )}

                  {msg.authorType === AuthorType.CHATBOT && !msg.isTyping && (
                    <div className='mt-1 ml-2 flex items-center'>
                      <Tooltip content='Copiar' closeDelay={100}>
                        <Button
                          isIconOnly
                          size='sm'
                          variant='light'
                          className='text-default-400 hover:text-default-600 min-w-7 h-7 w-7'
                          onPress={() => handleCopyContainer(msg.content)}
                        >
                          <Copy size={14} />
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className={cn(
          'w-full transition-all duration-300 mx-auto',
          !hasMessages ? 'max-w-xl' : 'max-w-3xl',
        )}
      >
        <div className='flex items-end gap-2 w-full'>
          <Textarea
            minRows={1}
            maxRows={3}
            value={input}
            onChange={(e) => dispatch(setValue(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder='Pregúntale a la IA sobre reservas o reportes...'
            variant='flat'
            classNames={{
              inputWrapper:
                'bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white/80 transition-all',
              input: 'text-sm',
            }}
          />
          <Button
            isIconOnly
            color='primary'
            radius='full'
            onPress={handleSend}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

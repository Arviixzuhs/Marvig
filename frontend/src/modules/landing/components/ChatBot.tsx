import React from 'react'
import remarkGfm from 'remark-gfm'
import { RootState } from '@/store'
import ReactMarkdown from 'react-markdown'
import { marvigAIService } from '@/services/marvigIA'
import { paramsConstructor } from '@/utils/paramsConstructor'
import { Button, cn, Tooltip } from '@heroui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Bot, Copy, MessageCircle, Send, X } from 'lucide-react'
import {
  addChat,
  setValue,
  addMessage,
  AuthorType,
  setLoading,
  setMessages,
  updateMessage,
  setErrorMessage,
  finishTypingMessage,
  setShouldScrollToBottom,
} from '@/features/chatbotSlice'

export const ChatBot = () => {
  const dispatch = useDispatch()
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null)

  const [isOpen, setIsOpen] = React.useState(false)
  const [activeChatId, setActiveChatId] = React.useState<string | null>(null)

  const {
    value: input,
    messages,
    isLoading,
    shouldScrollToBottom,
  } = useSelector((state: RootState) => state.chatbot)

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
    if (!isOpen) {
      dispatch(setMessages([]))
      setActiveChatId(null)
    }
  }, [isOpen, dispatch])

  const handleSend = async (textToSend?: string) => {
    const targetText = textToSend !== undefined ? textToSend : input
    const trimmedInput = targetText.trim()
    if (!trimmedInput || isLoading) return

    let currentChatId = activeChatId

    if (!currentChatId) {
      const chatTitle = trimmedInput.split(' ').slice(0, 5).join(' ').substring(0, 40)
      dispatch(setValue(''))

      try {
        const res = await marvigAIService.createChat(chatTitle)
        dispatch(addChat(res.data))
        currentChatId = String(res.data.id)
        setActiveChatId(currentChatId)
      } catch (error) {
        console.error('Error al inicializar el chat del cliente:', error)
        return
      }
    }

    sendMessage(trimmedInput, currentChatId)
    dispatch(setValue(''))
  }

  const sendMessage = (messageContent: string, chatIdToUse: string) => {
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
      { name: 'chatId', value: chatIdToUse },
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

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const hasMessages = messages.length > 0

  return (
    <div className='fixed bottom-6 right-6 z-50 flex flex-col items-end'>
      <AnimatePresence mode='wait'>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
            className='w-[320px] h-[400px] rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden flex flex-col mb-3'
          >
            <div className='bg-white dark:bg-zinc-900 flex items-center justify-between px-3.5 py-2.5 border-b border-black/5 dark:border-white/10 select-none'>
              <div className='flex items-center gap-2'>
                <div className='w-6 h-6 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400'>
                  <Bot size={14} />
                </div>
                <div>
                  <div className='text-[11px] font-semibold text-default-900 dark:text-white leading-none mb-0.5'>
                    Asistente Marvig
                  </div>
                  <div className='flex items-center gap-1 text-default-400 text-[9px] leading-none'>
                    <span className='w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse' />
                    En línea
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='text-default-400 hover:text-default-600 dark:hover:text-default-200 transition-colors p-1'
              >
                <X size={14} />
              </button>
            </div>
            <div className='flex-1 overflow-y-auto p-3 space-y-3 hoverScrollbar bg-zinc-50/50 dark:bg-zinc-950/20'>
              {!hasMessages && (
                <div className='text-center py-6 text-[11px] text-default-400 max-w-[85%] mx-auto leading-normal'>
                  ¡Hola! Soy tu asistente virtual. ¿Estás buscando un apartamento para alquilar o
                  tienes alguna duda?
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.authorType === AuthorType.USER ? 'items-end' : 'items-start'}`}
                >
                  {msg.isTyping ? (
                    <div className='px-2.5 py-1.5 bg-white dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 shadow-sm flex gap-1 items-center h-7'>
                      <div className='w-1 h-1 bg-default-400 rounded-full animate-bounce [animation-delay:-0.3s]' />
                      <div className='w-1 h-1 bg-default-400 rounded-full animate-bounce [animation-delay:-0.15s]' />
                      <div className='w-1 h-1 bg-default-400 rounded-full animate-bounce' />
                    </div>
                  ) : (
                    <div className='group relative max-w-[85%] flex flex-col items-start'>
                      <div
                        className={cn(
                          'text-[11px] px-2.5 py-1.5 rounded-xl leading-relaxed shadow-sm border',
                          msg.authorType === AuthorType.USER
                            ? 'bg-blue-600 text-white border-transparent rounded-tr-sm'
                            : 'bg-white dark:bg-white/10 border-black/5 dark:border-white/5 text-default-800 dark:text-zinc-100 rounded-tl-sm',
                        )}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: ({ ...props }) => (
                              <ul className='list-disc ml-3 my-0.5' {...props} />
                            ),
                            ol: ({ ...props }) => (
                              <ol className='list-decimal ml-3 my-0.5' {...props} />
                            ),
                            p: ({ ...props }) => <p className='inline' {...props} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                      {msg.authorType === AuthorType.CHATBOT && (
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 ml-1 flex items-center'>
                          <Tooltip content='Copiar' closeDelay={100} size='sm'>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='light'
                              className='text-default-400 hover:text-default-600 min-w-4 h-4 w-4'
                              onPress={() => handleCopyText(msg.content)}
                            >
                              <Copy size={9} />
                            </Button>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {!hasMessages && (
              <div className='px-3 pt-1.5 pb-1 flex flex-wrap gap-1 bg-zinc-50/50 dark:bg-zinc-950/20'>
                {['Ver apartamentos', 'Reservar ahora', 'Consultar precios'].map((q) => (
                  <button
                    key={q}
                    disabled={isLoading}
                    onClick={() => handleSend(q)}
                    className='text-[9px] border border-black/10 dark:border-white/10 rounded-full px-2 py-0.5 hover:bg-black/5 dark:hover:bg-white/5 transition bg-white dark:bg-zinc-800 text-default-600 dark:text-zinc-300'
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div className='p-2 flex gap-1.5 border-t border-black/5 dark:border-white/10 bg-white dark:bg-zinc-900'>
              <input
                value={input}
                onChange={(e) => dispatch(setValue(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                disabled={isLoading}
                className='flex-1 text-[11px] border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-default-900 dark:text-white outline-none focus:border-blue-500 transition-colors'
                placeholder='Escribe un mensaje...'
              />
              <Button
                isIconOnly
                color='primary'
                size='sm'
                radius='md'
                onPress={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className='min-w-7 h-7'
              >
                <Send size={10} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center shadow-xl text-white transition-all duration-200 hover:scale-105 active:scale-95',
          isOpen ? 'bg-zinc-100 dark:bg-zinc-800 text-default-500' : 'bg-primary text-white',
        )}
      >
        {isOpen ? <X size={18} /> : <MessageCircle size={18} />}
      </button>
    </div>
  )
}

import remarkGfm from 'remark-gfm'
import GeminiLogo from '@/assets/icons/gemini_logo.png'
import { RootState } from '@/store'
import ReactMarkdown from 'react-markdown'
import { marvigAIService } from '@/services/marvigIA'
import { useSearchParams } from 'react-router-dom'
import { paramsConstructor } from '@/utils/paramsConstructor'
import { motion, AnimatePresence } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import {
  MessageSquare,
  MoreVertical,
  Plus,
  Send,
  X,
  Copy,
  Sparkles,
  Edit2,
  Trash2,
} from 'lucide-react'
import {
  cn,
  Modal,
  Button,
  Tooltip,
  Textarea,
  ModalBody,
  ModalHeader,
  ModalContent,
  useDisclosure,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  ModalFooter,
} from '@heroui/react'
import {
  addChat,
  setValue,
  AuthorType,
  setLoading,
  addMessage,
  setMyChats,
  setMessages,
  updateMessage,
  setErrorMessage,
  finishTypingMessage,
  setPendingMessage,
  setShouldScrollToBottom,
} from '@/features/chatbotSlice'
import { inputStyles } from '@/styles'

export const ChatbotModal = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = searchParams.get('chatId')

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const dispatch = useDispatch()
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const userName = useSelector((state: any) => state.user?.name || 'Usuario')

  const {
    value: input,
    messages,
    myChats: chats,
    isLoading,
    pendingMessage,
    shouldScrollToBottom,
  } = useSelector((state: RootState) => state.chatbot)

  const selectedChat = chats.find((c) => String(c.id) === chatId)
  const isNewlyCreatedChat = useRef(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [chatToManage, setChatToManage] = useState<{ id: string; title: string } | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [isActionLoading, setIsActionLoading] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (chatId) {
      onOpen()
    }
  }, [chatId])

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom()
      dispatch(setShouldScrollToBottom(false))
    }
  }, [messages, shouldScrollToBottom, dispatch])

  useEffect(() => {
    marvigAIService
      .getMyChats()
      .then((res) => {
        dispatch(setMyChats(res.data))
      })
      .catch((err) => console.error('Error al cargar chats:', err))
  }, [dispatch])

  useEffect(() => {
    if (chatId && pendingMessage) {
      sendMessage(pendingMessage, chatId)
      dispatch(setPendingMessage(null))
    }
  }, [chatId, pendingMessage])

  useEffect(() => {
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

  const handleNewChat = () => {
    searchParams.delete('chatId')
    setSearchParams(searchParams)
  }

  const handleCloseModal = () => {
    searchParams.delete('chatId')
    setSearchParams(searchParams)
    onClose()
  }

  const handleCopyContainer = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // --- Funciones para Editar y Borrar ---
  const openEditModal = (id: string, currentTitle: string) => {
    setChatToManage({ id, title: currentTitle })
    setNewTitle(currentTitle)
    setIsEditOpen(true)
  }

  const openDeleteModal = (id: string, currentTitle: string) => {
    setChatToManage({ id, title: currentTitle })
    setIsDeleteOpen(true)
  }

  const handleUpdateTitle = async () => {
    if (!chatToManage || !newTitle.trim()) return
    setIsActionLoading(true)
    try {
      await marvigAIService.updateChatTitle(chatToManage.id, newTitle.trim())

      // Actualizar la lista local refrescando desde la API
      const res = await marvigAIService.getMyChats()
      dispatch(setMyChats(res.data))

      setIsEditOpen(false)
      setChatToManage(null)
    } catch (error) {
      console.error('Error al actualizar el título del chat:', error)
    } finally {
      setIsActionLoading(false)
    }
  }

  const handleDeleteChat = async () => {
    if (!chatToManage) return
    setIsActionLoading(true)
    try {
      await marvigAIService.deleteChat(chatToManage.id)

      // Si borramos el chat que actualmente está abierto, limpiamos la URL
      if (chatId === chatToManage.id) {
        searchParams.delete('chatId')
        setSearchParams(searchParams)
      }

      const res = await marvigAIService.getMyChats()
      dispatch(setMyChats(res.data))

      setIsDeleteOpen(false)
      setChatToManage(null)
    } catch (error) {
      console.error('Error al eliminar el chat:', error)
    } finally {
      setIsActionLoading(false)
    }
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
    <>
      <button
        onClick={onOpen}
        className='hover:scale-110 transition-transform cursor-pointer ml-12 lg:ml-0'
      >
        <img src={GeminiLogo} alt='Abrir Chat' className='h-8 w-8' />
      </button>

      <Modal
        size='5xl'
        isOpen={isOpen}
        backdrop='blur'
        scrollBehavior='inside'
        onOpenChange={onOpenChange}
        hideCloseButton
        classNames={{
          body: 'p-0',
          backdrop: 'bg-white/20 dark:bg-black/20 backdrop-blur-sm',
          base: 'rounded-3xl shadow-2xl bg-white/20 dark:bg-black/10 backdrop-blur-sm border border-white/40 dark:border-white/10 overflow-hidden',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className='flex items-center justify-between px-6 py-3 border-b border-black/5 dark:border-white/10'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-500/10 rounded-lg'>
                    <MessageSquare className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='text-sm font-semibold text-default-900 dark:text-white leading-none'>
                      {selectedChat?.title || 'Asistente Virtual Marvig'}
                    </h3>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    isIconOnly
                    size='md'
                    variant='light'
                    className='dark:bg-white/10 text-default-600'
                    onPress={handleCloseModal}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className='flex h-[75vh] w-full overflow-hidden'>
                  {/* Panel Lateral */}
                  <div className='w-[260px] hidden md:flex flex-col dark:bg-white/5 border-r border-black/5 dark:border-white/10 p-4'>
                    <Button
                      variant='flat'
                      className='mb-4 font-medium'
                      onPress={handleNewChat}
                      startContent={<Plus size={18} />}
                    >
                      Nuevo Chat
                    </Button>
                    <div className='flex-1 overflow-y-auto pr-2 space-y-1 hoverScrollbar'>
                      {chats.map((chat) => (
                        <div
                          key={chat.id}
                          className={cn(
                            `group flex items-center justify-between w-full border border-transparent px-3 py-1.5 rounded-xl transition-all ${
                              chatId === String(chat.id)
                                ? 'dark:bg-white/10 border border-black/5 dark:border-white/10 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-black/5 dark:hover:bg-white/5 text-default-600'
                            }`,
                          )}
                        >
                          <button
                            onClick={() => setSearchParams({ chatId: String(chat.id) })}
                            className='flex-1 text-left truncate cursor-pointer py-1'
                          >
                            <div className='truncate text-xs font-semibold'>{chat.title}</div>
                          </button>

                          {/* Dropdown de opciones por chat */}
                          <Dropdown placement='bottom-end'>
                            <DropdownTrigger>
                              <Button
                                isIconOnly
                                size='sm'
                                variant='light'
                                className='opacity-0 group-hover:opacity-100 data-[open=true]:opacity-100 transition-opacity min-w-6 h-6 w-6 text-default-500'
                              >
                                <MoreVertical size={14} />
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label='Acciones de chat' variant='flat'>
                              <DropdownItem
                                key='edit'
                                startContent={<Edit2 size={14} />}
                                onPress={() => openEditModal(String(chat.id), chat.title)}
                              >
                                Renombrar
                              </DropdownItem>
                              <DropdownItem
                                key='delete'
                                className='text-danger'
                                color='danger'
                                startContent={<Trash2 size={14} />}
                                onPress={() => openDeleteModal(String(chat.id), chat.title)}
                              >
                                Eliminar chat
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
                      ))}
                    </div>
                  </div>

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
                            <p className='text-default-500 mt-2 max-w-sm text-sm'>
                              ¿Qué tienes en mente?
                            </p>
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
                                        ul: ({ ...props }) => (
                                          <ul className='list-disc ml-4 my-2' {...props} />
                                        ),
                                        ol: ({ ...props }) => (
                                          <ol className='list-decimal ml-4 my-2' {...props} />
                                        ),
                                        li: ({ ...props }) => <li className='mb-1' {...props} />,
                                        p: ({ ...props }) => (
                                          <p className='leading-relaxed' {...props} />
                                        ),
                                        strong: ({ ...props }) => (
                                          <strong className='font-bold' {...props} />
                                        ),
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
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditOpen} onOpenChange={setIsEditOpen} backdrop='opaque' size='sm'>
        <ModalContent>
          {(onCloseEdit) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-base font-semibold'>
                Renombrar chat
              </ModalHeader>
              <ModalBody className='pb-6'>
                <Input
                  autoFocus
                  label='Título del chat'
                  classNames={inputStyles}
                  placeholder='Ingresa el título del chat'
                  labelPlacement='outside'
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <div className='flex gap-2 justify-end w-full'>
                  <Button
                    variant='flat'
                    onPress={onCloseEdit}
                    isDisabled={isActionLoading}
                    className='w-full'
                  >
                    Cancelar
                  </Button>
                  <Button
                    color='primary'
                    onPress={handleUpdateTitle}
                    isLoading={isActionLoading}
                    isDisabled={!newTitle.trim()}
                    className='w-full'
                  >
                    Guardar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen} backdrop='opaque' size='sm'>
        <ModalContent>
          {(onCloseDelete) => (
            <>
              <ModalHeader className='flex flex-col text-center gap-1 text-base font-semibold'>
                ¿Eliminar chat?
              </ModalHeader>
              <ModalBody className='pb-6'>
                <p className='text-sm text-default-500'>
                  Esta acción eliminará de forma permanente el chat{' '}
                  <strong className='text-default-700'>"{chatToManage?.title}"</strong> y todo su
                  historial.
                </p>
              </ModalBody>
              <ModalFooter>
                <div className='flex gap-2 justify-end w-full'>
                  <Button
                    variant='flat'
                    onPress={onCloseDelete}
                    isDisabled={isActionLoading}
                    className='w-full'
                  >
                    Cancelar
                  </Button>
                  <Button
                    color='danger'
                    onPress={handleDeleteChat}
                    isLoading={isActionLoading}
                    className='w-full'
                  >
                    Eliminar
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

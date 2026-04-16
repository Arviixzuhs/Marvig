import { motion } from 'framer-motion'
import GeminiLogo from '@/assets/icons/gemini_logo.png'
import { useEffect, useRef, useState } from 'react'
import { MessageSquare, MoreVertical, Plus, Send, X } from 'lucide-react'
import {
  cn,
  Modal,
  Button,
  Textarea,
  ModalBody,
  ModalHeader,
  ModalContent,
  useDisclosure,
} from '@heroui/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Chat {
  id: number
  title: string
  messages: Message[]
  createdAt: Date
}

export const ChatbotModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: 'Reporte de ventas',
      createdAt: new Date(),
      messages: [
        {
          role: 'assistant',
          content: 'Hola 👋, puedo ayudarte a generar reportes o métricas.',
        },
      ],
    },
  ])

  const [selectedChatId, setSelectedChatId] = useState<number>(1)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const selectedChat = chats.find((c) => c.id === selectedChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  const handleSend = () => {
    if (!input.trim() || !selectedChat) return
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { role: 'user', content: input },
                { role: 'assistant', content: 'Procesando tu solicitud...' },
              ],
            }
          : chat,
      ),
    )
    setInput('')
  }

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: 'Nuevo chat',
      createdAt: new Date(),
      messages: [{ role: 'assistant', content: '¿En qué puedo ayudarte?' }],
    }
    setChats((prev) => [newChat, ...prev])
    setSelectedChatId(newChat.id)
  }

  return (
    <>
      <button onClick={onOpen} className='hover:scale-110 transition-transform cursor-pointer'>
        <img src={GeminiLogo} alt='Abrir Chat' className='h-8 w-8' />
      </button>
      <Modal
        size='5xl'
        backdrop='transparent'
        isOpen={isOpen}
        scrollBehavior='inside'
        onOpenChange={onOpenChange}
        hideCloseButton
        classNames={{
          body: 'p-0',
          base: 'rounded-3xl shadow-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className=' bg-transparent flex items-center justify-between px-6 py-3   backdrop-blur-xl'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-500/10 rounded-lg'>
                    <MessageSquare className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <h3 className='text-sm font-semibold text-default-900 dark:text-white leading-none'>
                      {selectedChat?.title || 'Asistente Virtual'}
                    </h3>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button isIconOnly size='sm' variant='light' className='text-default-500'>
                    <MoreVertical size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    size='md'
                    variant='light'
                    className='dark:bg-white/10 text-default-600'
                    onPress={onClose}
                  >
                    <X size={18} />
                  </Button>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className='flex h-[75vh] w-full overflow-hidden'>
                  <div className='w-[260px] hidden md:flex flex-col dark:bg-white/5 border-r border-black/5 dark:border-white/10 p-4'>
                    <Button
                      variant='flat'
                      className='mb-4 font-medium'
                      onPress={handleNewChat}
                      startContent={<Plus size={18} />}
                    >
                      Nuevo Chat
                    </Button>
                    <div className='flex-1 overflow-y-auto hoverScrollbar pr-2 space-y-1'>
                      {chats.map((chat) => (
                        <button
                          key={chat.id}
                          onClick={() => setSelectedChatId(chat.id)}
                          className={cn(
                            `cursor-pointer w-full text-left border border-transparent px-3 py-2.5 rounded-xl transition-all ${
                              selectedChatId === chat.id
                                ? 'dark:bg-white/10 border border-black/5 dark:border-white/10 text-blue-600 dark:text-blue-400'
                                : 'hover:bg-black/5 dark:hover:bg-white/5 text-default-600'
                            }`,
                          )}
                        >
                          <div className='truncate text-xs font-semibold'>{chat.title}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className='flex-1 flex flex-col min-w-0 bg-transparent'>
                    <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-6'>
                      {selectedChat?.messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${
                              msg.role === 'user'
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white/50 dark:bg-white/10 border border-white/20 dark:border-white/5 text-default-800 dark:text-white shadow-sm'
                            }`}
                          >
                            {msg.content}
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className='p-4 bg-white/20 dark:bg-transparent backdrop-blur-sm border-t border-black/5 dark:border-white/10'>
                      <div className='max-w-3xl mx-auto flex items-end gap-2'>
                        <Textarea
                          minRows={1}
                          maxRows={3}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder='Escribe aquí...'
                          variant='flat'
                          classNames={{
                            inputWrapper:
                              'bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white/80 transition-all',
                            input: 'text-sm',
                          }}
                        />
                        <Button isIconOnly color='primary' radius='full' onPress={handleSend}>
                          <Send size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

import React from 'react'
import { RootState } from '@/store'
import { setMyChats } from '@/features/chatbotSlice'
import { inputStyles } from '@/styles'
import { marvigAIService } from '@/services/marvigIA'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Edit2, MoreVertical, Plus, Trash2 } from 'lucide-react'
import {
  cn,
  Input,
  Modal,
  Button,
  Dropdown,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react'

export const ChatBotSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const chatId = searchParams.get('chatId')
  const dispatch = useDispatch()
  const { myChats } = useSelector((state: RootState) => state.chatbot)
  const [newTitle, setNewTitle] = React.useState('')
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [chatToManage, setChatToManage] = React.useState<{ id: string; title: string } | null>(null)
  const [isActionLoading, setIsActionLoading] = React.useState(false)

  const handleNewChat = () => {
    searchParams.delete('chatId')
    setSearchParams(searchParams)
  }

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

  return (
    <>
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
          {myChats.map((chat) => (
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

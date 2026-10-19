import React from 'react'
import { RootState } from '@/store'
import GeminiLogo from '@/assets/icons/gemini_logo.png'
import { createPortal } from 'react-dom'
import { ChatbotHeader } from './components/ChatbotHeader'
import { setIsOpenModal } from '@/features/chatbotSlice'
import { ChatBotSidebar } from './components/ChatBotSidebar'
import { useSearchParams } from 'react-router-dom'
import { ChatbotMessages } from './components/ChatbotMessages'
import { MessageCircle, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalHeader, cn } from '@heroui/react'

interface ChatbotModalProps {
  mode?: 'MODAL' | 'POPUP'
}

const headerClass =
  'flex items-center justify-between px-6 py-3 border-b border-black/5 dark:border-white/10'

export const Chatbot = ({ mode = 'MODAL' }: ChatbotModalProps) => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [searchParams, setSearchParams] = useSearchParams()
  const { isOpenModal } = useSelector((state: RootState) => state.chatbot)
  const chatId = searchParams.get('chatId')

  React.useEffect(() => {
    if (chatId) dispatch(setIsOpenModal(true))
  }, [chatId, dispatch])

  const handleCloseModal = React.useCallback(() => {
    searchParams.delete('chatId')
    setSearchParams(searchParams)
    dispatch(setIsOpenModal(false))
  }, [searchParams, setSearchParams, dispatch])

  if (!user.data) return null

  if (mode === 'POPUP') {
    return createPortal(
      <div className='fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3' data-lenis-prevent>
        <AnimatePresence>
          {isOpenModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', duration: 0.3, bounce: 0.1 }}
              style={{ transformOrigin: 'bottom right' }}
              className='flex flex-col w-[380px] max-w-[calc(100vw-3rem)] h-[min(560px,calc(100vh-8rem))] rounded-2xl overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md'
            >
              <div className={headerClass}>
                <ChatbotHeader handleCloseModal={handleCloseModal} />
              </div>
              <div className='flex flex-1 min-h-0 w-full overflow-hidden'>
                <ChatbotMessages />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => (isOpenModal ? handleCloseModal() : dispatch(setIsOpenModal(true)))}
          aria-label={isOpenModal ? 'Cerrar chat' : 'Abrir chat'}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-105 active:scale-95',
            isOpenModal ? 'bg-zinc-100 dark:bg-zinc-800 text-default-500' : 'bg-primary text-white',
          )}
        >
          {isOpenModal ? <X size={18} /> : <MessageCircle size={18} />}
        </button>
      </div>,
      document.body,
    )
  }

  return (
    <>
      <button
        onClick={() => dispatch(setIsOpenModal(true))}
        className='hover:scale-110 transition-transform cursor-pointer ml-12 lg:ml-0'
      >
        <img src={GeminiLogo} alt='Abrir Chat' className='h-8 w-8' />
      </button>

      <Modal
        size='5xl'
        isOpen={isOpenModal}
        backdrop='blur'
        scrollBehavior='inside'
        onOpenChange={handleCloseModal}
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
              <ModalHeader className={headerClass}>
                <ChatbotHeader handleCloseModal={handleCloseModal} />
              </ModalHeader>
              <ModalBody>
                <div className='flex h-[75vh] w-full overflow-hidden'>
                  <ChatBotSidebar />
                  <ChatbotMessages />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

import React from 'react'
import { RootState } from '@/store'
import GeminiLogo from '@/assets/icons/gemini_logo.png'
import { ChatbotHeader } from './components/ChatbotHeader'
import { setIsOpenModal } from '@/features/chatbotSlice'
import { ChatBotSidebar } from './components/ChatBotSidebar'
import { useSearchParams } from 'react-router-dom'
import { ChatbotMessages } from './components/ChatbotMessages'
import { useDispatch, useSelector } from 'react-redux'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'

export const ChatbotModal = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isOpenModal } = useSelector((state: RootState) => state.chatbot)
  const chatId = searchParams.get('chatId')

  React.useEffect(() => {
    if (chatId) {
      dispatch(setIsOpenModal(true))
    }
  }, [chatId])

  const handleCloseModal = () => {
    searchParams.delete('chatId')
    setSearchParams(searchParams)
    dispatch(setIsOpenModal(false))
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
              <ModalHeader className='flex items-center justify-between px-6 py-3 border-b border-black/5 dark:border-white/10'>
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

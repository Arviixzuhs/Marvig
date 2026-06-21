import { Button } from '@heroui/react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { MessageSquare, X } from 'lucide-react'

interface IChatbotHeaderProps {
  handleCloseModal: () => void
}

export const ChatbotHeader = ({ handleCloseModal }: IChatbotHeaderProps) => {
  const [searchParams] = useSearchParams()
  const chatId = searchParams.get('chatId')
  const { myChats } = useSelector((state: RootState) => state.chatbot)
  const selectedChat = myChats.find((c) => String(c.id) === chatId)

  return (
    <>
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
    </>
  )
}

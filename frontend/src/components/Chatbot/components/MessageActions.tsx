import { Copy } from 'lucide-react'
import { Button, Tooltip } from '@heroui/react'

interface Props {
  content: string
  onCopy: (text: string) => void
}

export const MessageActions = ({ content, onCopy }: Props) => (
  <div className='mt-1 ml-2 flex items-center'>
    <Tooltip content='Copiar' closeDelay={100}>
      <Button
        isIconOnly
        size='sm'
        variant='light'
        className='text-default-400 hover:text-default-600 min-w-7 h-7 w-7'
        onPress={() => onCopy(content)}
      >
        <Copy size={14} />
      </Button>
    </Tooltip>
  </div>
)

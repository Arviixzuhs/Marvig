import { Send, Square } from 'lucide-react'
import { Button, cn, Textarea, Tooltip } from '@heroui/react'

interface Props {
  value: string
  isBusy: boolean // hay una respuesta en curso o cargando: no se puede enviar
  isStreaming: boolean // hay una respuesta generándose: se muestra el botón de detener
  compact: boolean
  onChange: (value: string) => void
  onSend: () => void
  onStop: () => void
}

export const ChatInput = ({
  value,
  isBusy,
  isStreaming,
  compact,
  onChange,
  onSend,
  onStop,
}: Props) => (
  <div
    className={cn('w-full transition-all duration-300 mx-auto', compact ? 'max-w-xl' : 'max-w-3xl')}
  >
    <div className='flex items-end gap-2 w-full'>
      <Textarea
        minRows={1}
        maxRows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            // Se puede seguir escribiendo mientras responde, pero no enviar
            if (!isBusy) onSend()
          }
        }}
        placeholder={
          isBusy
            ? 'Espera la respuesta o presiona detener...'
            : 'Pregunta a Marvig'
        }
        variant='flat'
        classNames={{
          inputWrapper:
            'bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:bg-white/80 transition-all',
          input: 'text-sm',
        }}
      />

      {isStreaming ? (
        <Tooltip content='Detener' closeDelay={100}>
          {/* m-1 deja espacio para que el anillo no se corte ni invada al textarea */}
          <div className='relative shrink-0 m-1'>
            <span className='pointer-events-none absolute -inset-1 rounded-full border-2 border-primary/20 border-t-primary animate-spin' />
            <Button
              isIconOnly
              color='primary'
              radius='full'
              onPress={onStop}
              aria-label='Detener respuesta'
            >
              <Square size={14} fill='currentColor' />
            </Button>
          </div>
        </Tooltip>
      ) : (
        <Button
          isIconOnly
          color='primary'
          radius='full'
          onPress={onSend}
          isDisabled={isBusy || !value.trim()}
          aria-label='Enviar mensaje'
        >
          <Send size={18} />
        </Button>
      )}
    </div>
  </div>
)

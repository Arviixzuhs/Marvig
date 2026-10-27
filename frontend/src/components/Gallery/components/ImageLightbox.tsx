import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export interface GalleryImage {
  url: string
  alt?: string
}

interface ImageLightboxProps {
  images: GalleryImage[]
  /** Índice abierto actualmente; null = cerrado */
  index: number | null
  onClose: () => void
  onChange: (index: number) => void
}

export const ImageLightbox = ({ images, index, onClose, onChange }: ImageLightboxProps) => {
  const count = images.length
  const isOpen = index !== null && count > 0

  const prev = useCallback(
    () => onChange(((index ?? 0) - 1 + count) % count),
    [index, count, onChange],
  )
  const next = useCallback(() => onChange(((index ?? 0) + 1) % count), [index, count, onChange])

  useEffect(() => {
    if (!isOpen) return
    const previousOverflow = document.body.style.overflow
   

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (count > 1 && e.key === 'ArrowLeft') prev()
      if (count > 1 && e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, count, onClose, prev, next])

  const current = isOpen ? images[index] : null

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          role='dialog'
          aria-modal='true'
          aria-label={`Foto ${index + 1} de ${count}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className='fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 select-none'
        >
          <button
            type='button'
            onClick={onClose}
            aria-label='Cerrar'
            className='absolute top-[max(1rem,env(safe-area-inset-top))] right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 transition-all hover:bg-black/80 hover:text-white cursor-pointer'
          >
            <X size={22} />
          </button>

          <div
            className='relative flex h-full max-h-[85dvh] w-full max-w-5xl items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            {count > 1 && (
              <button
                type='button'
                onClick={prev}
                aria-label='Foto anterior'
                className='absolute left-2 sm:left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 transition-all hover:bg-black/80 hover:text-white cursor-pointer'
              >
                <ChevronLeft size={26} />
              </button>
            )}

            <AnimatePresence mode='wait'>
              <motion.img
                key={index}
                src={current.url}
                alt={current.alt ?? `Foto ${index + 1}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className='max-h-[85dvh] max-w-full rounded-lg object-contain shadow-2xl'
              />
            </AnimatePresence>

            {count > 1 && (
              <button
                type='button'
                onClick={next}
                aria-label='Foto siguiente'
                className='absolute right-2 sm:right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/80 transition-all hover:bg-black/80 hover:text-white cursor-pointer'
              >
                <ChevronRight size={26} />
              </button>
            )}
          </div>

          {count > 1 && (
            <span className='absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white/85'>
              {index + 1} de {count}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import React from 'react'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from 'lucide-react'

export const ApartmentImagesGrid = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const [isCarouselOpen, setIsCarouselOpen] = React.useState(false)
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    if (isCarouselOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCarouselOpen])

  const images = apartment?.images || []
  const count = images.length

  const secondarySlots = Array.from({ length: 4 }).map((_, index) => {
    const imageIndex = index + 1
    return images[imageIndex] || null
  })

  const openCarousel = (index: number) => {
    if (index < count) {
      setCurrentIndex(index)
      setIsCarouselOpen(true)
    }
  }

  const closeCarousel = () => setIsCarouselOpen(false)

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? count - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === count - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-4 grid-rows-1 sm:grid-rows-2 gap-2 mb-9 h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden'>
        <div
          className={`sm:col-span-2 sm:row-span-2 bg-muted relative overflow-hidden ${
            images[0] ? 'cursor-pointer' : ''
          }`}
          onClick={() => openCarousel(0)}
        >
          {images[0] ? (
            <img
              src={images[0].url}
              alt='Imagen principal'
              className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-muted-2/50 text-muted-foreground/40'>
              <ImageIcon size={40} />
            </div>
          )}
        </div>

        {secondarySlots.map((img, i) => {
          const actualIndex = i + 1
          return (
            <div
              key={i}
              className={`hidden sm:block bg-muted relative overflow-hidden ${
                img ? 'cursor-pointer' : ''
              }`}
              onClick={() => openCarousel(actualIndex)}
            >
              {img ? (
                <img
                  src={img.url}
                  alt={`Imagen ${actualIndex + 1}`}
                  className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center bg-muted-2/50 text-muted-foreground/30'>
                  <ImageIcon size={24} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence>
        {isCarouselOpen && count > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 select-none cursor-pointer'
          >
            {/* Botón de cierre */}
            <button
              onClick={closeCarousel}
              className='absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 cursor-pointer'
              aria-label='Cerrar modal'
            >
              <X size={24} />
            </button>
            <div
              className='relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center cursor-default'
              onClick={(e) => e.stopPropagation()}
            >
              {count > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className='absolute left-2 sm:left-4 text-white/80 hover:text-white p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 transition-all z-10 cursor-pointer'
                  aria-label='Imagen anterior'
                >
                  <ChevronLeft size={28} />
                </button>
              )}
              <AnimatePresence mode='wait'>
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex].url}
                  alt={`Vista ${currentIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className='max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto'
                />
              </AnimatePresence>
              {count > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className='absolute right-2 sm:right-4 text-white/80 hover:text-white p-2 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 transition-all z-10 cursor-pointer'
                  aria-label='Siguiente imagen'
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

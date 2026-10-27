import { useCallback, useState } from 'react'
import { Skeleton } from '@heroui/react'
import { Image as ImageIcon } from 'lucide-react'
import { ImageLightbox, type GalleryImage } from './components/ImageLightbox'

export type { GalleryImage }

interface GalleryProps {
  images: GalleryImage[]
  variant?: 'hero' | 'masonry'
  isLoading?: boolean
  className?: string
}

/* Alturas que se alternan en el mosaico para dar ritmo visual */
const MASONRY_HEIGHTS = ['h-44', 'h-64', 'h-48', 'h-60', 'h-56', 'h-52']

export const Gallery = ({
  images,
  variant = 'masonry',
  isLoading = false,
  className = '',
}: GalleryProps) => {
  const [index, setIndex] = useState<number | null>(null)
  const open = useCallback((i: number) => setIndex(i), [])
  const close = useCallback(() => setIndex(null), [])

  if (isLoading) {
    return variant === 'hero' ? (
      <HeroSkeleton className={className} />
    ) : (
      <MasonrySkeleton className={className} />
    )
  }

  return (
    <>
      {variant === 'hero' ? (
        <HeroGrid images={images} onOpen={open} className={className} />
      ) : (
        <MasonryGrid images={images} onOpen={open} className={className} />
      )}

      <ImageLightbox images={images} index={index} onClose={close} onChange={setIndex} />
    </>
  )
}

interface GridProps {
  images: GalleryImage[]
  onOpen: (index: number) => void
  className: string
}

const HEROGRID_CLASS =
  'relative grid grid-cols-1 sm:grid-cols-4 grid-rows-1 sm:grid-rows-2 gap-2 h-72 sm:h-80 md:h-96 rounded-xl overflow-hidden'

const HeroGrid = ({ images, onOpen, className }: GridProps) => {
  const secondary = Array.from({ length: 4 }, (_, i) => images[i + 1] ?? null)

  return (
    <div className={`${HEROGRID_CLASS} ${className}`}>
      {/* Foto principal */}
      <div className='sm:col-span-2 sm:row-span-2 relative overflow-hidden bg-muted'>
        {images[0] ? (
          <button
            type='button'
            onClick={() => onOpen(0)}
            aria-label='Ampliar foto principal'
            className='block h-full w-full cursor-pointer'
          >
            <img
              src={images[0].url}
              alt={images[0].alt ?? 'Foto principal'}
              className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
            />
          </button>
        ) : (
          <div className='flex h-full w-full items-center justify-center bg-muted-2/50 text-muted-foreground/40'>
            <ImageIcon size={40} />
          </div>
        )}
      </div>

      {/* Fotos secundarias (solo desde sm) */}
      {secondary.map((img, i) => {
        const imageIndex = i + 1
        return (
          <div key={i} className='hidden sm:block relative overflow-hidden bg-muted'>
            {img ? (
              <button
                type='button'
                onClick={() => onOpen(imageIndex)}
                aria-label={`Ampliar foto ${imageIndex + 1}`}
                className='block h-full w-full cursor-pointer'
              >
                <img
                  src={img.url}
                  alt={img.alt ?? `Foto ${imageIndex + 1}`}
                  className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                />
              </button>
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-muted-2/50 text-muted-foreground/30'>
                <ImageIcon size={24} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const MasonryGrid = ({ images, onOpen, className }: GridProps) => (
  <div className={`columns-1 sm:columns-2 lg:columns-3 gap-4 ${className}`}>
    {images.map((img, i) => (
      <button
        key={`${img.url}-${i}`}
        type='button'
        onClick={() => onOpen(i)}
        aria-label={`Ampliar foto ${i + 1}`}
        className='group block w-full mb-4 break-inside-avoid overflow-hidden rounded-2xl cursor-zoom-in animate-appearance-in'
      >
        <div
          className={`${MASONRY_HEIGHTS[i % MASONRY_HEIGHTS.length]} w-full transition-transform duration-700 group-hover:scale-105`}
        >
          <img
            src={img.url}
            alt={img.alt ?? `Foto ${i + 1}`}
            loading='lazy'
            className='h-full w-full object-cover'
          />
        </div>
      </button>
    ))}
  </div>
)

/* Skeletons */
const HeroSkeleton = ({ className }: { className: string }) => (
  <div aria-busy='true' aria-label='Cargando fotos' className={`${HEROGRID_CLASS} ${className}`}>
    <Skeleton className='sm:col-span-2 sm:row-span-2 rounded-none' />
    {Array.from({ length: 4 }, (_, i) => (
      <Skeleton key={i} className='hidden sm:block rounded-none' />
    ))}
  </div>
)

const MasonrySkeleton = ({ className }: { className: string }) => (
  <div
    aria-busy='true'
    aria-label='Cargando fotos'
    className={`columns-1 sm:columns-2 lg:columns-3 gap-4 ${className}`}
  >
    {MASONRY_HEIGHTS.map((height, i) => (
      <Skeleton key={i} className={`${height} w-full mb-4 break-inside-avoid rounded-2xl`} />
    ))}
  </div>
)

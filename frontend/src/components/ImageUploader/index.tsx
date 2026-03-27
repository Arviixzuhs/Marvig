import { cn } from '@heroui/theme'
import { Button, Card } from '@heroui/react'
import { useImageUpload } from './providers/ImageUploaderProvider'
import { X, Upload, ChevronLeft, ChevronRight, ImageIcon, Plus } from 'lucide-react'

export const ImageUploader = () => {
  const {
    images,
    isDragging,
    fileInputRef,
    currentIndex,
    nextImage,
    handleDrop,
    removeImage,
    previousImage,
    handleDragOver,
    handleDragLeave,
    handleFileInput,
    setCurrentIndex,
  } = useImageUpload()

  return (
    <div
      className='space-y-6'
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {images.length === 0 && (
        <Card
          shadow='none'
          className={cn(
            'relative overflow-hidden border-2 border-dashed transition-all duration-200',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-card hover:border-primary/50',
          )}
        >
          <div className='flex flex-col items-center justify-center p-12'>
            <div
              className={cn(
                'mb-4 rounded-full p-4 transition-colors',
                isDragging ? 'bg-primary/20' : 'bg-muted',
              )}
            >
              <Upload
                className={cn(
                  'h-10 w-10 transition-colors',
                  isDragging ? 'text-primary' : 'text-muted-foreground',
                )}
              />
            </div>
            <h3 className='mb-2 text-xl font-semibold text-foreground'>
              {isDragging ? 'Suelta las imágenes aquí' : 'Arrastra y suelta tus imágenes'}
            </h3>
            <p className='mb-4 text-sm text-muted-foreground'>
              Solo se permiten archivos de imagen (JPG, PNG, GIF, etc.)
            </p>
            <Button
              size='lg'
              onPress={() => fileInputRef.current?.click()}
              variant='flat'
              startContent={<ImageIcon className='mr-2 h-5 w-5' />}
            >
              Seleccionar Imágenes
            </Button>
          </div>
        </Card>
      )}
      {images.length > 0 && (
        <Card className='overflow-hidden bg-card' shadow='none'>
          <div className='relative'>
            <div className='relative aspect-[30/10] bg-muted'>
              <img
                src={images[currentIndex].imageURL}
                alt={`Imagen ${currentIndex + 1}`}
                className='h-full w-full object-contain'
              />
              <Button
                onPress={() => removeImage(images[currentIndex].id)}
                className='absolute right-4 top-4'
                isIconOnly
              >
                <X className='h-5 w-5' />
              </Button>
              {images.length > 1 && (
                <>
                  <Button
                    color='primary'
                    onPress={previousImage}
                    isIconOnly
                    className='absolute left-4 top-1/2 -translate-y-1/2'
                  >
                    <ChevronLeft className='h-6 w-6' />
                  </Button>
                  <Button
                    color='primary'
                    onPress={nextImage}
                    isIconOnly
                    className='absolute right-4 top-1/2 -translate-y-1/2'
                  >
                    <ChevronRight className='h-6 w-6' />
                  </Button>
                </>
              )}
              <div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white'>
                {currentIndex + 1} / {images.length}
              </div>
            </div>
            <div className='border-t border-border bg-muted/30 p-4'>
              <div className='flex gap-3 overflow-x-auto pb-2'>
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type='button'
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                      currentIndex === index
                        ? 'border-primary'
                        : 'border-transparent opacity-60 hover:opacity-100',
                    )}
                  >
                    <img
                      src={image.imageURL}
                      alt={`Miniatura ${index + 1}`}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
                <button
                  type='button'
                  onClick={() => fileInputRef.current?.click()}
                  className='flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-all hover:border-primary hover:bg-primary/5'
                >
                  <Plus className='h-8 w-8 text-muted-foreground' />
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        multiple
        onChange={handleFileInput}
        className='hidden'
      />
    </div>
  )
}

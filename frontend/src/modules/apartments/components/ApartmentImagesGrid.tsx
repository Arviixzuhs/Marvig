import { Gallery } from '@/components/Gallery'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const ApartmentImagesGrid = () => {
  const images = useSelector((state: RootState) => state.apartment?.images) ?? []

  return <Gallery images={images} variant='hero' className='mb-9' />
}

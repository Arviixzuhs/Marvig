import { Gallery } from '@/components/Gallery'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const ApartmentImagesGrid = () => {
  const { data, isLoading } = useSelector((state: RootState) => state.apartment)

  return <Gallery images={data?.images ?? []} isLoading={isLoading} variant='hero' className='mb-9' />
}
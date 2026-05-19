import { RootState } from '@/store'
import { useSelector } from 'react-redux'

export const ApartmentImagesGrid = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  if (!apartment) return

  return (
    <div>
      {apartment.images && apartment.images.length > 0 && (
        <div className='grid grid-cols-4 grid-rows-2 gap-2 mb-9 h-72 rounded-xl overflow-hidden'>
          <div className='col-span-2 row-span-2 bg-muted'>
            <img src={apartment.images[0].url} className='w-full h-full object-cover' />
          </div>
          {apartment.images.slice(1).map((p, i) => (
            <div key={i} className='bg-muted'>
              <img src={p.url} alt='' className='w-full h-full object-cover' />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

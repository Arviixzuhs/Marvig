import React from 'react'
import { RootState } from '@/store'
import { MapPin, Star } from 'lucide-react'
import { clearCheckout } from '@/features/checkoutSlice'
import { ApartmentDetails } from '@/modules/apartments/components/ApartmentDetails'
import { useCalendarContext } from '@/context/calendarContext'
import { ApartmentImagesGrid } from '@/modules/apartments/components/ApartmentImagesGrid'
import { ApartmentCalendarRange } from '@/modules/apartments/components/ApartmentCalendarRange'
import { useDispatch, useSelector } from 'react-redux'

export const ApartmentPage = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const dispatch = useDispatch()
  const { setDate } = useCalendarContext()

  React.useEffect(() => {
    setDate(null)
    dispatch(clearCheckout())
  }, [])

  if (!apartment) return null

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <h1 className='text-3xl font-extrabold mb-2 tracking-tight'>
          Apartamento #{apartment.number}
        </h1>
        <div className='flex items-center gap-5 text-sm text-muted-foreground mb-7'>
          <span className='flex items-center gap-1.5'>
            <Star size={13} className='fill-yellow-400 text-yellow-400' />{' '}
            <strong className='text-foreground'>4</strong> (5 reseñas)
          </span>
          <span className='flex items-center gap-1.5'>
            <MapPin size={13} /> testing, testing
          </span>
        </div>
        <ApartmentImagesGrid />
        <div className='flex flex-col md:flex-row w-full gap-5'>
          <ApartmentDetails />
          <ApartmentCalendarRange />
        </div>
      </div>
    </div>
  )
}

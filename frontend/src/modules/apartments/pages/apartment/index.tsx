import React from 'react'
import { RootState } from '@/store'
import { clearCheckout } from '@/features/checkoutSlice'
import { UserPageLayout } from '@/layout/UserPageLayout'
import { ApartmentDetails } from '@/modules/apartments/components/ApartmentDetails'
import { ApartmentImagesGrid } from '@/modules/apartments/components/ApartmentImagesGrid'
import { ApartmentCalendarRange } from '@/modules/apartments/components/ApartmentCalendarRange'
import { useDispatch, useSelector } from 'react-redux'

export const ApartmentPage = () => {
  const apartment = useSelector((state: RootState) => state.apartment)
  const dispatch = useDispatch()

  React.useEffect(() => {
    return () => {
      dispatch(clearCheckout())
    }
  }, [dispatch])

  if (!apartment) return null

  return (
    <UserPageLayout>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl font-serif text-3xl font-semibold mb-2 tracking-tight'>
          Apartamento #{apartment.number}
        </h1>
        <ApartmentImagesGrid />
        <div className='flex flex-col md:flex-row w-full gap-5'>
          <ApartmentDetails />
          <ApartmentCalendarRange />
        </div>
      </div>
    </UserPageLayout>
  )
}

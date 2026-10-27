import React from 'react'
import { Skeleton } from '@heroui/react'
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

  return (
    <UserPageLayout>
      <div className='flex flex-col gap-4'>
        {apartment.isLoading ? (
          <Skeleton className='h-9 w-64 max-w-full rounded-lg mb-2' />
        ) : (
          <h1 className='text-3xl font-serif font-semibold mb-2 tracking-tight'>
            Apartamento #{apartment.data?.number}
          </h1>
        )}
        <ApartmentImagesGrid />
        <div className='flex flex-col md:flex-row w-full gap-5'>
          <ApartmentDetails />
          {apartment.isLoading ? (
            <Skeleton aria-busy='true' className='h-96 w-full rounded-2xl' />
          ) : (
            <ApartmentCalendarRange />
          )}
        </div>
      </div>
    </UserPageLayout>
  )
}

import React from 'react'
import { ApartmentCard } from '@/modules/apartments/components/ApartmentCard'
import { ApartmentModel, ApartmentStatus } from '@/models/ApartmentModel'
import { apartmentService } from '@/services/apartment'

export const ApartmentsGrid = () => {
  const [apartments, setApartments] = React.useState<ApartmentModel[]>([])

  const loadData = async () => {
    const response = await apartmentService.getAll({
      page: 0,
      status: [ApartmentStatus.AVAILABLE, ApartmentStatus.OCCUPIED, ApartmentStatus.RESERVED],
      pageSize: 20,
    })

    if (response) {
      setApartments(response.content)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8'>
      {apartments.map((apartment, index) => (
        <ApartmentCard apartment={apartment} index={index} key={apartment.id} />
      ))}
    </div>
  )
}

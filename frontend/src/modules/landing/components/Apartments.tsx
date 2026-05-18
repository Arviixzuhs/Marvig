import React from 'react'
import { ApartmentCard } from '@/modules/apartments/components/ApartmentCard'
import { ApartmentModel } from '@/models/ApartmentModel'
import { apartmentService } from '@/services/apartment'

export const ApartmentsGrid = () => {
  const [apartments, setApartments] = React.useState<ApartmentModel[]>([])

  const loadData = async () => {
    const response = await apartmentService.getAll({
      page: 0,
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
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
      {apartments.map((apartment, index) => (
        <ApartmentCard apartment={apartment} index={index} key={index} />
      ))}
    </div>
  )
}

import React from 'react'
import { RootState } from '@/store'
import { setApartment } from '@/features/apartmentSlice'
import { apartmentService } from '@/services/apartment'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

export const LoadCurrentApartmentMiddleware = () => {
  const params = useParams<{ apartmentId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const apartment = useSelector((state: RootState) => state.apartment)

  const loadData = async () => {
    if (!params.apartmentId || isNaN(Number(params.apartmentId))) {
      navigate('/')
      return
    }

    const response = await apartmentService.get(Number(params.apartmentId))
    dispatch(setApartment(response))
  }

  React.useEffect(() => {
    loadData()
  }, [])

  if (!apartment) return null

  return <Outlet />
}

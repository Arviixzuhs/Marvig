import React from 'react'
import { useDispatch } from 'react-redux'
import { apartmentService } from '@/services/apartment'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { setApartment, setIsApartmentLoading } from '@/features/apartmentSlice'

export const LoadCurrentApartmentMiddleware = () => {
  const params = useParams<{ apartmentId: string }>()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loadData = async () => {
    if (!params.apartmentId || isNaN(Number(params.apartmentId))) {
      navigate('/')
      return
    }
    dispatch(setIsApartmentLoading(true))
    try {
      const response = await apartmentService.get(Number(params.apartmentId))
      dispatch(setApartment(response))
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setIsApartmentLoading(false))
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  return <Outlet />
}

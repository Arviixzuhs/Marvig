import { RootState } from '@/store'
import { LoginModal } from '@/modules/auth/components/LoginModal'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/formatCurrency'
import { setIsLoginModal } from '@/modules/auth/slice/authSlice'
import { useCalendarContext } from '@/context/calendarContext'
import { useDispatch, useSelector } from 'react-redux'
import { ApartmentCalendarDateRange } from '@/components/ApartmentCalendarDateRange'
import { Card, Button, Divider, CardBody, CardFooter, CardHeader } from '@heroui/react'

export const ApartmentCalendarRange = () => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user.data)
  const apartment = useSelector((state: RootState) => state.apartment)
  const checkout = useSelector((state: RootState) => state.checkout)

  const { nights } = useCalendarContext()
  const dispatch = useDispatch()
  if (!apartment) return null

  const onSubmit = () => {
    if (!user) {
      dispatch(setIsLoginModal(true))
    } else {
      navigate(`/checkout/national/${apartment.id}`)
    }
  }

  return (
    <div>
      <LoginModal title='Inicia sesión para continuar' />
      <Card className='w-full md:w-fit'>
        <CardHeader className='flex gap-3'>
          <div className='flex items-baseline gap-1'>
            <span className='text-2xl font-extrabold'>{formatCurrency(apartment.pricePerDay)}</span>
            <span className='text-muted-foreground text-sm'>/noche</span>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='flex w-full justify-center items-center'>
          <ApartmentCalendarDateRange />
        </CardBody>
        <CardFooter className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2 w-full'>
            <span className='text-muted-foreground text-sm'>{nights} noches seleccionadas</span>
            <Divider />
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>{formatCurrency(checkout.totalPrice)}</span>
            </div>
          </div>
          <Button color='primary' className='w-full' isDisabled={nights === 0} onPress={onSubmit}>
            {nights === 0 ? 'Selecciona una fecha' : 'Reservar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

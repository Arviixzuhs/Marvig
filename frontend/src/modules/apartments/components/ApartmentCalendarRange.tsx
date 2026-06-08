import { RootState } from '@/store'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/formatCurrency'
import { ApartmentCalendarDateRange } from '@/components/ApartmentCalendarDateRange'
import { calcTotalByApartmentAndNights } from '@/utils/calcTotalByApartmentAndNights'
import { Card, Button, Divider, CardBody, CardFooter, CardHeader } from '@heroui/react'

export const ApartmentCalendarRange = () => {
  const navigate = useNavigate()
  const checkout = useSelector((state: RootState) => state.checkout)
  const apartment = useSelector((state: RootState) => state.apartment)

  if (!apartment) return null

  return (
    <div>
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
            <span className='text-muted-foreground text-sm'>
              {checkout.nights} noches seleccionadas
            </span>
            <Divider />
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>
                {formatCurrency(
                  calcTotalByApartmentAndNights({
                    nights: checkout.nights,
                    pricePerDay: apartment.pricePerDay,
                    ...(apartment.promotion && {
                      promotion: {
                        type: apartment.promotion.type,
                        value: apartment.promotion.value,
                      },
                    }),
                  }),
                )}
              </span>
            </div>
          </div>
          <Button
            color='primary'
            className='w-full'
            isDisabled={checkout.nights === 0}
            onPress={() => navigate(`/checkout/national/${apartment.id}`)}
          >
            {checkout.nights === 0 ? 'Selecciona una fecha' : 'Reservar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

import React from 'react'
import toast from 'react-hot-toast'
import Confetti from 'react-confetti'
import { Success } from './components/Success'
import { Summary } from './components/Summary'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { PaymentInfo } from './components/PaymentInfo'
import { useNavigate } from 'react-router-dom'
import { Stepper, StepItem } from '@/components/Stepper'
import { reservationService } from '@/services/reservation'
import { PersonalInformation } from './components/PersonalInformation'
import { useCalendarContext } from '@/context/calendarContext'

export const NationalCheckoutPage = () => {
  const [step, setStep] = React.useState<number>(1)
  const navigate = useNavigate()
  const checkout = useSelector((state: RootState) => state.checkout)
  const apartment = useSelector((state: RootState) => state.apartment)
  const [isLoading, setLoading] = React.useState(false)
  const [showConfetti, setShowConfetti] = React.useState(false)
  const { date, refreshCalendar } = useCalendarContext()
  const [windowDimension, setWindowDimension] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const detectSize = () => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
  }

  React.useEffect(() => {
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [])

  if (!apartment) return

  React.useEffect(() => {
    if (!date?.end || !date?.start) {
      navigate(`/apartment/${apartment.id}`)
      return
    }
  }, [])

  const checkoutSteps: StepItem[] = [
    {
      label: 'Contacto',
      component: <PersonalInformation />,
    },
    {
      label: 'Pago',
      component: <PaymentInfo />,
    },
    {
      label: 'Confirmación',
      component: <Success />,
    },
  ]

  const isFinalStep = step === checkoutSteps.length

  const getPayload = () => {
    const {
      apartments,
      paymentDate,
      paymentMethod,
      clientLastname,
      paymentReference,
      paymentDescription,
      ...rest
    } = checkout.formData
    return {
      ...rest,
      endDate: date?.end.toString(),
      startDate: date?.start.toString(),
      clientName: rest.clientName + ' ' + clientLastname,
      totalPrice: apartment.pricePerDay * checkout.nights,
      apartmentIds: [apartment.id],
      payment: {
        date: paymentDate,
        method: paymentMethod,
        reference: paymentReference,
        description: paymentDescription,
      },
    }
  }

  const handleFinalSubmit = async () => {
    try {
      setLoading(true)
      await reservationService.create(getPayload())
      setStep(checkoutSteps.length)
      window.scrollTo(0, 0)
      setShowConfetti(true)
    } catch (error: any) {
      refreshCalendar()
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='relative flex items-center justify-center'>
      {showConfetti && (
        <div className='absolute inset-0 z-10 overflow-hidden'>
          <Confetti
            width={windowDimension.width}
            height={windowDimension.height}
            recycle={false}
            numberOfPieces={400}
          />
        </div>
      )}
      <div className='w-full max-w-5xl px-4 sm:px-6 py-6 md:py-10 z-20'>
        <div
          className={`grid gap-8 items-start w-full ${isFinalStep ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 lg:grid-cols-5'}`}
        >
          <div className='col-span-3 w-full order-1'>
            <Stepper
              items={checkoutSteps}
              currentStep={step}
              onStepChange={setStep}
              isLoading={isLoading}
              submitButtonText={isLoading ? 'Procesando...' : 'Enviar'}
              onFinalSubmit={handleFinalSubmit}
              showSecondaryButton={step > 1}
            />
          </div>
          {!isFinalStep && (
            <div className='lg:col-span-2 max-w-2xl w-fit order-2 lg:sticky lg:top-34'>
              <Summary />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

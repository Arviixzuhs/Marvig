import React from 'react'
import toast from 'react-hot-toast'
import { Success } from './components/Success'
import { Summary } from './components/Summary'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { PaymentInfo } from './components/PaymentInfo'
import { useNavigate } from 'react-router-dom'
import { Stepper, StepItem } from '@/components/Stepper'
import { reservationService } from '@/services/reservation'
import { PersonalInformation } from './components/PersonalInformation'

export const NationalCheckoutPage = () => {
  const [step, setStep] = React.useState<number>(1)
  const navigate = useNavigate()
  const checkout = useSelector((state: RootState) => state.checkout)
  const apartment = useSelector((state: RootState) => state.apartment)
  if (!apartment) return

  React.useEffect(() => {
    if (!checkout.date.end || !checkout.date.start) {
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
      endDate: new Date(String(checkout.date?.end)),
      startDate: new Date(String(checkout.date?.start)),
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
      await reservationService.create(getPayload())
      setStep(checkoutSteps.length)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className=' flex items-center justify-center'>
      <div className='w-full max-w-5xl  px-4 sm:px-6 py-6 md:py-10'>
        <div
          className={`grid gap-8 items-start w-full ${isFinalStep ? 'grid-cols-1 max-w-xl mx-auto' : 'grid-cols-1 lg:grid-cols-5'}`}
        >
          <div className={` col-span-3 w-full order-1`}>
            <Stepper
              items={checkoutSteps}
              currentStep={step}
              onStepChange={setStep}
              submitButtonText='Confirmar y pagar'
              onFinalSubmit={handleFinalSubmit}
              showSecondaryButton={step > 1}
            />
          </div>
          {!isFinalStep && (
            <div className='lg:col-span-2 w-full order-2 lg:sticky lg:top-10'>
              <Summary />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

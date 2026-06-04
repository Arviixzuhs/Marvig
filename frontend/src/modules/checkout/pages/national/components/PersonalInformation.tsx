import { Input } from '@heroui/input'
import { RootState } from '@/store'
import { NumberInput } from '@heroui/react'
import { setCheckoutFormData } from '@/features/checkoutSlice'
import { useDispatch, useSelector } from 'react-redux'

export const PersonalInformation = () => {
  const dispatch = useDispatch()
  const checkout = useSelector((state: RootState) => state.checkout)

  const handleChange = (name: string, value: string | number) => {
    dispatch(setCheckoutFormData({ name, value }))
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Nombre'
            labelPlacement='outside'
            placeholder='Victor'
            variant='underlined'
            value={String(checkout.formData?.['clientName'] || '')}
            isRequired
            minLength={2}
            onValueChange={(value) => handleChange('clientName', value)}
          />
          <Input
            label='Apellido'
            labelPlacement='outside'
            placeholder='Pandolfi'
            variant='underlined'
            value={String(checkout.formData?.['clientLastname'] || '')}
            isRequired
            minLength={2}
            onValueChange={(value) => handleChange('clientLastname', value)}
          />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Correo electrónico'
            labelPlacement='outside'
            placeholder='ejemplo@correo.com'
            type='email'
            variant='underlined'
            value={String(checkout.formData?.['clientEmail'] || '')}
            isRequired
            onValueChange={(value) => handleChange('clientEmail', value)}
          />
          <Input
            label='Teléfono'
            labelPlacement='outside'
            placeholder='+58 000 000 0000'
            type='tel'
            variant='underlined'
            value={String(checkout.formData?.['clientPhone'] || '')}
            isRequired
            onValueChange={(value) => handleChange('clientPhone', value)}
          />
        </div>
        <NumberInput
          label='Número de Personas'
          labelPlacement='outside'
          placeholder='3'
          variant='underlined'
          value={Number(checkout.formData?.['persons']) || 0}
          isRequired
          minValue={1}
          step={1}
          formatOptions={{
            maximumFractionDigits: 0,
          }}
          onValueChange={(value) => handleChange('persons', value)}
        />
      </div>
    </div>
  )
}

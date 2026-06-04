import React from 'react'
import { RootState } from '@/store'
import { Copy, Check } from 'lucide-react'
import { PaymentMethod } from '@/models/PaymentModel'
import { Card, CardBody } from '@heroui/card'
import { Input, Textarea } from '@heroui/input'
import { setCheckoutFormData } from '@/features/checkoutSlice'
import { Smartphone, Landmark } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

export const PaymentInfo = () => {
  const dispatch = useDispatch()
  const checkout = useSelector((state: RootState) => state.checkout)
  const [copiedText, setCopiedText] = React.useState<string | null>(null)

  const currentMethod = checkout.formData?.['paymentMethod'] || ''

  const handleChange = (name: string, value: string) => {
    dispatch(setCheckoutFormData({ name, value }))
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(field)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const paymentMethods = [
    {
      label: 'Pago Móvil',
      value: PaymentMethod.PAGO_MOVIL,
      icon: <Smartphone size={20} className='text-primary-500' />,
    },
    {
      label: 'Transferencia Bancaria',
      value: PaymentMethod.BANK_TRANSFER,
      icon: <Landmark size={20} className='text-primary-500' />,
    },
  ]

  React.useEffect(() => {
    handleChange('paymentMethod', PaymentMethod.PAGO_MOVIL)
  }, [])

  return (
    <div className='w-full space-y-8'>
      <div>
        <label className='text-sm text-muted-foreground block mb-3 font-medium'>
          Selecciona tu método de pago <span className='text-danger'>*</span>
        </label>
        <div className='grid grid-cols-1 sm:grid-cols-2  gap-3'>
          {paymentMethods.map((method) => {
            const isSelected = currentMethod === method.value
            return (
              <Card
                key={method.value}
                shadow='none'
                onPress={() => handleChange('paymentMethod', method.value)}
                isPressable
                className={`border-1 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-400/5' : 'hover:border-foreground-400'
                }`}
              >
                <CardBody className='flex flex-row items-center gap-3 p-4'>
                  <span className='text-xl'>{method.icon}</span>
                  <span className='text-sm font-semibold text-foreground'>{method.label}</span>
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>
      <div className='bg-muted/40 border border-border rounded-xl p-5 space-y-4 animate-appearance-in'>
        {currentMethod && (
          <h3 className='text-sm font-bold text-foreground tracking-tight'>
            Información para realizar el pago manual:
          </h3>
        )}
        {currentMethod === PaymentMethod.PAGO_MOVIL && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <DataField
              label='Banco'
              value='Banco Mercantil (0105)'
              onCopy={() => handleCopy('0105', 'banco')}
              isCopied={copiedText === 'banco'}
            />
            <DataField
              label='Teléfono'
              value='+58 412 123 4567'
              onCopy={() => handleCopy('04121234567', 'tel')}
              isCopied={copiedText === 'tel'}
            />
            <DataField
              label='Cédula / RIF'
              value='V-12345678'
              onCopy={() => handleCopy('12345678', 'rif')}
              isCopied={copiedText === 'rif'}
            />
          </div>
        )}
        {currentMethod === PaymentMethod.BANK_TRANSFER && (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm'>
            <DataField
              label='Banco'
              value='Banco Mercantil - Corriente'
              onCopy={() => handleCopy('Mercantil', 'banco-t')}
              isCopied={copiedText === 'banco-t'}
            />
            <DataField
              label='Número de Cuenta'
              value='0105-0000-00-0000000000'
              onCopy={() => handleCopy('01050000000000000000', 'cuenta')}
              isCopied={copiedText === 'cuenta'}
            />
            <DataField
              label='Titular'
              value='Marvig'
              onCopy={() => handleCopy('Tu Nombre o Empresa', 'titular')}
              isCopied={copiedText === 'titular'}
            />
            <DataField
              label='Cédula / RIF'
              value='J-12345678-0'
              onCopy={() => handleCopy('J123456780', 'rif-t')}
              isCopied={copiedText === 'rif-t'}
            />
          </div>
        )}
      </div>
      {currentMethod && (
        <div className='flex flex-col gap-5 animate-appearance-in'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              label='Referencia / Confirmación del pago'
              labelPlacement='outside'
              placeholder='Número de operación'
              variant='underlined'
              value={String(checkout.formData?.['paymentReference'] || '')}
              isRequired
              onValueChange={(value) => handleChange('paymentReference', value)}
            />
            <Input
              label='Fecha del pago'
              labelPlacement='outside'
              placeholder='Selecciona fecha del pago'
              type='date'
              variant='underlined'
              value={String(checkout.formData?.['paymentDate'] || '')}
              isRequired
              onValueChange={(value) => handleChange('paymentDate', value)}
            />
          </div>
          <Textarea
            label='Descripción'
            labelPlacement='outside'
            placeholder='Notas adicionales...'
            variant='underlined'
            value={String(checkout.formData?.['paymentDescription'] || '')}
            onValueChange={(value) => handleChange('paymentDescription', value)}
          />
        </div>
      )}
    </div>
  )
}

interface DataFieldProps {
  label: string
  value: string
  onCopy: () => void
  isCopied: boolean
}

const DataField: React.FC<DataFieldProps> = ({ label, value, onCopy, isCopied }) => (
  <div className='flex flex-col bg-card border border-border/60 p-3 rounded-lg relative group justify-between'>
    <div>
      <span className='text-xs text-muted-foreground block font-medium'>{label}</span>
      <span className='font-mono font-bold text-foreground select-all break-all pr-6'>{value}</span>
    </div>
    <button
      type='button'
      onClick={onCopy}
      className='absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors'
      title='Copiar al portapapeles'
    >
      {isCopied ? <Check size={14} className='text-success' /> : <Copy size={14} />}
    </button>
  </div>
)

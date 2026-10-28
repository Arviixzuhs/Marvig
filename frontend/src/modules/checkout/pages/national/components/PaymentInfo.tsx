import React from 'react'
import { RootState } from '@/store'
import { Copy, Check, Smartphone, Landmark } from 'lucide-react'
import { PaymentMethod } from '@/models/PaymentModel'
import { Card, CardBody } from '@heroui/card'
import { Input, Textarea } from '@heroui/input'
import { DatePicker } from '@heroui/date-picker'
import { I18nProvider } from '@react-aria/i18n'
import { parseDate, today, getLocalTimeZone } from '@internationalized/date'
import { companyInfo } from '@/constants'
import { setCheckoutFormData } from '@/features/checkoutSlice'
import { useDispatch, useSelector } from 'react-redux'

interface PaymentField {
  key: string
  label: string
  value: string
  copyValue?: string
}

interface PaymentMethodConfig {
  label: string
  icon: React.ReactNode
  fields: PaymentField[]
}

const onlyDigits = (text: string) => text.replace(/\D/g, '')
const withoutDashes = (text: string) => text.replace(/-/g, '')

const toLocalPhone = (phone: string) => {
  const digits = onlyDigits(phone)
  return digits.startsWith('58') ? `0${digits.slice(2)}` : digits
}

const formatPhone = (phone: string) => {
  const digits = onlyDigits(phone)
  if (!digits.startsWith('58') || digits.length !== 12) return phone
  return `+58 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`
}

const { pagoMovil, bankTransfer } = companyInfo.payment

const PAYMENT_INFO: Partial<Record<PaymentMethod, PaymentMethodConfig>> = {
  [PaymentMethod.PAGO_MOVIL]: {
    label: 'Pago Móvil',
    icon: <Smartphone size={20} className='text-primary-500' />,
    fields: [
      {
        key: 'banco',
        label: 'Banco',
        value: `${pagoMovil.bank.name} (${pagoMovil.bank.code})`,
        copyValue: pagoMovil.bank.code,
      },
      {
        key: 'telefono',
        label: 'Teléfono',
        value: formatPhone(pagoMovil.phone),
        copyValue: toLocalPhone(pagoMovil.phone),
      },
      {
        key: 'documento',
        label: 'Cédula / RIF',
        value: pagoMovil.document,
        copyValue: onlyDigits(pagoMovil.document),
      },
    ],
  },
  [PaymentMethod.BANK_TRANSFER]: {
    label: 'Transferencia Bancaria',
    icon: <Landmark size={20} className='text-primary-500' />,
    fields: [
      {
        key: 'banco',
        label: 'Banco',
        value: `${bankTransfer.bank} - ${bankTransfer.accountType}`,
        copyValue: bankTransfer.bank,
      },
      {
        key: 'cuenta',
        label: 'Número de Cuenta',
        value: bankTransfer.accountNumber,
        copyValue: onlyDigits(bankTransfer.accountNumber),
      },
      { key: 'titular', label: 'Titular', value: bankTransfer.holder },
      {
        key: 'documento',
        label: 'Cédula / RIF',
        value: bankTransfer.document,
        copyValue: withoutDashes(bankTransfer.document),
      },
    ],
  },
}

const DEFAULT_PAYMENT_METHOD = PaymentMethod.PAGO_MOVIL

const paymentMethods = (Object.entries(PAYMENT_INFO) as [PaymentMethod, PaymentMethodConfig][]).map(
  ([value, config]) => ({ value, label: config.label, icon: config.icon }),
)

export const PaymentInfo = () => {
  const dispatch = useDispatch()

  const checkout = useSelector((state: RootState) => state.checkout)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  const currentMethod = (checkout.formData?.['paymentMethod'] || '') as PaymentMethod | ''
  const currentConfig = currentMethod ? PAYMENT_INFO[currentMethod] : undefined

  const handleChange = (name: string, value: string) => {
    dispatch(setCheckoutFormData({ name, value }))
  }

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      setCopiedKey(null)
    }
  }

  // Fecha guardada en el store como "YYYY-MM-DD"
  const storedDate = String(checkout.formData?.['paymentDate'] || '')
  const dateValue = React.useMemo(() => {
    try {
      return storedDate ? parseDate(storedDate) : null
    } catch {
      return null
    }
  }, [storedDate])

  React.useEffect(() => {
    handleChange('paymentMethod', DEFAULT_PAYMENT_METHOD)
  }, [])

  return (
    <div className='w-full space-y-6 sm:space-y-8'>
      <div>
        <label className='text-sm text-muted-foreground block mb-3 font-medium'>
          Selecciona tu método de pago <span className='text-danger'>*</span>
        </label>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3'>
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
                <CardBody className='flex flex-row items-center gap-3 p-3 sm:p-4'>
                  <span className='text-xl'>{method.icon}</span>
                  <span className='text-sm font-semibold text-foreground flex-1 text-left'>
                    {method.label}
                  </span>
                  {isSelected && <Check size={16} className='text-blue-500 shrink-0' />}
                </CardBody>
              </Card>
            )
          })}
        </div>
      </div>

      {currentConfig && (
        <div className='bg-muted/40 border border-border rounded-xl p-3 sm:p-5 space-y-3 sm:space-y-4 animate-appearance-in'>
          <h3 className='text-sm font-bold text-foreground tracking-tight'>
            Información para realizar el pago manual:
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm'>
            {currentConfig.fields.map((field) => {
              const copyKey = `${currentMethod}-${field.key}`
              return (
                <DataField
                  key={copyKey}
                  label={field.label}
                  value={field.value}
                  onCopy={() => handleCopy(field.copyValue ?? field.value, copyKey)}
                  isCopied={copiedKey === copyKey}
                />
              )
            })}
          </div>
        </div>
      )}

      {currentMethod && (
        <div className='flex flex-col gap-5 animate-appearance-in'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-4'>
            <Input
              label='Referencia / Confirmación del pago'
              labelPlacement='outside'
              placeholder='Número de operación'
              variant='underlined'
              value={String(checkout.formData?.['paymentReference'] || '')}
              isRequired
              onValueChange={(value) => handleChange('paymentReference', value)}
            />
            <I18nProvider locale='es-VE'>
              <DatePicker
                label='Fecha del pago'
                labelPlacement='outside'
                variant='underlined'
                granularity='day'
                value={dateValue}
                maxValue={today(getLocalTimeZone())}
                isRequired
                showMonthAndYearPickers
                onChange={(date) => handleChange('paymentDate', date ? date.toString() : '')}
              />
            </I18nProvider>
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
  <div className='flex items-center justify-between gap-3 bg-card border border-border/60 px-3 py-2.5 sm:p-3 rounded-lg'>
    <div className='min-w-0'>
      <span className='text-xs text-muted-foreground block font-medium'>{label}</span>
      <span className='font-mono font-bold text-foreground select-all break-all text-sm'>
        {value}
      </span>
    </div>
    <button
      type='button'
      onClick={onCopy}
      aria-label={`Copiar ${label}`}
      className='shrink-0 flex items-center justify-center size-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-default-100 active:bg-default-200 transition-colors'
      title='Copiar al portapapeles'
    >
      {isCopied ? <Check size={16} className='text-success' /> : <Copy size={16} />}
    </button>
  </div>
)

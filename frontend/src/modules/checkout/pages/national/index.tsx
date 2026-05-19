import {
  Check,
  ChevronLeft,
  MapPin,
  Shield,
  Star
} from 'lucide-react'
import React from 'react'
//import { useParams } from 'react-router-dom'

export const NationalCheckoutPage = () => {
  // const params = useParams<{ apartmentId: string }>()

  const [step, setStep] = React.useState(1)
  const steps = ['Información', 'Pago', 'Confirmación']

  return (
    <div className='min-h-screen bg-background'>
      <div className='border-b border-border bg-card px-6 py-3'>
        <button
          className='text-sm text-muted-foreground hover:text-foreground flex items-center gap-1'
        >
          <ChevronLeft size={15} /> Volver al apartamento
        </button>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-10'>
        {/* Steps */}
        <div className='flex items-center justify-center gap-0 mb-12'>
          {steps.map((s, i) => (
            <div key={s} className='flex items-center'>
              <div className='flex items-center gap-2.5'>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i + 1 < step ? 'bg-green-500 text-white' : i + 1 === step ? 'bg-foreground text-white' : 'bg-muted text-muted-foreground'}`}
                >
                  {i + 1 < step ? <Check size={13} /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${i + 1 === step ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-20 h-px mx-4 transition-colors ${i + 1 < step ? 'bg-green-500' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
          {/* Form */}
          <div className='lg:col-span-3'>
            {step === 1 && (
              <div>
                <h2 className='text-lg font-bold mb-5'>Información personal</h2>
                <div className='space-y-4'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                        Nombre
                      </label>
                      <input
                        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:border-[#2B4FFF] transition-colors'
                        defaultValue='Carlos'
                      />
                    </div>
                    <div>
                      <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                        Apellido
                      </label>
                      <input
                        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:border-[#2B4FFF] transition-colors'
                        defaultValue='Hernández'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                      Correo electrónico
                    </label>
                    <input
                      className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:border-[#2B4FFF] transition-colors'
                      defaultValue='c.hernandez@email.com'
                    />
                  </div>
                  <div>
                    <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                      Teléfono
                    </label>
                    <input
                      className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:border-[#2B4FFF] transition-colors'
                      defaultValue='+57 300 123 4567'
                    />
                  </div>
                  <div>
                    <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                      Cédula / Documento
                    </label>
                    <input
                      className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none focus:border-[#2B4FFF] transition-colors'
                      defaultValue='1023456789'
                    />
                  </div>
                  <div>
                    <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                      Mensaje para el propietario (opcional)
                    </label>
                    <textarea
                      className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none resize-none h-20 focus:border-[#2B4FFF] transition-colors'
                      placeholder='Cuéntanos un poco sobre ti...'
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className='text-lg font-bold mb-5'>Método de pago</h2>
                <div className='flex gap-2 mb-6'>
                  {['Tarjeta', 'PSE', 'Nequi'].map((m, mi) => (
                    <button
                      key={m}
                      className={`flex-1 py-2.5 border rounded-lg text-sm font-medium transition-colors ${mi === 0 ? 'border-foreground bg-foreground/5' : 'border-border text-muted-foreground hover:bg-muted'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className='space-y-4'>
                  <div>
                    <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                      Número de tarjeta
                    </label>
                    <input
                      className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none font-mono tracking-widest placeholder:tracking-normal'
                      placeholder='0000 0000 0000 0000'
                    />
                  </div>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='col-span-2'>
                      <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                        Vencimiento
                      </label>
                      <input
                        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none'
                        placeholder='MM / AA'
                      />
                    </div>
                    <div>
                      <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                        CVV
                      </label>
                      <input
                        className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none'
                        placeholder='•••'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='text-xs text-muted-foreground font-medium mb-1 block'>
                      Nombre en la tarjeta
                    </label>
                    <input
                      className='w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card outline-none uppercase'
                      defaultValue='CARLOS HERNANDEZ'
                    />
                  </div>
                  <div className='flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2.5'>
                    <Shield size={13} className='text-green-600 shrink-0' />
                    Pago seguro cifrado con SSL 256-bit. Tus datos están protegidos.
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className='text-center py-6'>
                <div className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5'>
                  <Check size={36} className='text-green-600' strokeWidth={2.5} />
                </div>
                <h2 className='text-2xl font-extrabold mb-2'>¡Reserva confirmada!</h2>
                <p className='text-muted-foreground text-sm mb-7 max-w-xs mx-auto leading-relaxed'>
                  Tu reserva para ha sido confirmada. Recibirás un
                  correo con todos los detalles y tus accesos digitales.
                </p>
                <div className='bg-muted rounded-xl p-5 text-left text-sm space-y-2.5 max-w-xs mx-auto mb-7'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Reserva #</span>
                    <span className='font-mono font-medium'>RNT-2026-4821</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Entrada</span>
                    <span>10 mayo 2026</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Salida</span>
                    <span>10 junio 2026</span>
                  </div>
                  <div className='flex justify-between font-bold border-t border-border pt-2.5'>
                    <span>Total pagado</span>
                    <span>{100}</span>
                  </div>
                </div>
                <button
                  className='text-sm font-medium underline'
                  style={{ color: '#2B4FFF' }}
                >
                  Ver mis reservas
                </button>
              </div>
            )}

            {step < 3 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                className='mt-6 w-full py-3.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90'
                style={{ background: '#2B4FFF' }}
              >
                {step === 2 ? 'Confirmar y pagar' : 'Continuar'}
              </button>
            )}
          </div>

          {/* Summary */}
          <div className='lg:col-span-2'>
            <div className='bg-card border border-border rounded-2xl p-5 sticky top-8'>
              <h3 className='font-semibold mb-4 text-sm'>Resumen de reserva</h3>
              <div className='flex gap-3 mb-5'>
                <div className='w-20 h-16 rounded-xl bg-muted overflow-hidden shrink-0'>
                  <img
                    className='w-full h-full object-cover'
                  />
                </div>
                <div>
                  <div className='text-sm font-semibold'>pija</div>
                  <div className='text-xs text-muted-foreground mt-1 flex items-center gap-1'>
                    <MapPin size={10} />
                    tu casa, porqué?
                  </div>
                  <div className='flex items-center gap-1 mt-1 text-xs text-muted-foreground'>
                    <Star size={10} className='fill-yellow-400 text-yellow-400' /> mucho
                  </div>
                </div>
              </div>
              <div className='border-t border-border pt-4 space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>10 may – 10 jun 2026</span>
                  <span>30 días</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Alquiler mensual</span>
                  <span>{20000}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Depósito</span>
                  <span>{100}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Servicio plataforma</span>
                  <span>{199990}</span>
                </div>
                <div className='flex justify-between font-bold border-t border-border pt-3 text-base'>
                  <span>Total</span>
                  <span>{99999}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
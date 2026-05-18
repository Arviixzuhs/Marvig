import React from 'react'
import { useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'
import { ApartmentModel } from '@/models/ApartmentModel'
import { apartmentService } from '@/services/apartment'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bed,
  Car,
  Bath,
  Wifi,
  Star,
  Wind,
  Shield,
  Square,
  MapPin,
  Building,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export const ApartmentPage = () => {
  const params = useParams<{ apartmentId: string }>()
  const [apartment, setApartment] = React.useState<ApartmentModel | null>(null)
  const BOOKED_DAYS = [5, 6, 7, 8, 15, 16, 17, 22, 23]
  const onNavigate = useNavigate()

  const [startDay, setStartDay] = useState<number | null>(null)
  const [endDay, setEndDay] = useState<number | null>(null)

  const handleDay = (d: number) => {
    if (BOOKED_DAYS.includes(d)) return
    if (!startDay || (startDay && endDay)) {
      setStartDay(d)
      setEndDay(null)
    } else if (d > startDay) {
      setEndDay(d)
    } else {
      setStartDay(d)
      setEndDay(null)
    }
  }

  const loadData = async () => {
    if (params.apartmentId) {
      const response = await apartmentService.get(Number(params.apartmentId))
      setApartment(response)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const nights = startDay && endDay ? endDay - startDay : 0

  if (!apartment) return null

  return (
    <div className='min-h-screen bg-background'>
      <div className='max-w-6xl mx-auto px-6 py-8'>
        <h1 className='text-3xl font-extrabold mb-2 tracking-tight'>
          Apartamento #{apartment.number}
        </h1>
        <div className='flex items-center gap-5 text-sm text-muted-foreground mb-7'>
          <span className='flex items-center gap-1.5'>
            <Star size={13} className='fill-yellow-400 text-yellow-400' />{' '}
            <strong className='text-foreground'>4</strong> (5 reseñas)
          </span>
          <span className='flex items-center gap-1.5'>
            <MapPin size={13} /> testing, testing
          </span>
        </div>
        {apartment.images && apartment.images.length > 0 && (
          <div className='grid grid-cols-4 grid-rows-2 gap-2 mb-9 h-72 rounded-xl overflow-hidden'>
            <div className='col-span-2 row-span-2 bg-muted'>
              <img src={apartment.images[0].url} className='w-full h-full object-cover' />
            </div>
            {apartment.images.slice(1).map((p, i) => (
              <div key={i} className='bg-muted'>
                <img src={p.url} alt='' className='w-full h-full object-cover' />
              </div>
            ))}
          </div>
        )}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          <div className='lg:col-span-2 space-y-7'>
            <div className='flex items-center gap-7 py-5 border-y border-border'>
              <span className='flex items-center gap-2 text-sm font-medium'>
                <Bed size={17} /> {apartment.bedrooms} habitaciones
              </span>
              <span className='flex items-center gap-2 text-sm font-medium'>
                <Bath size={17} /> {apartment.bathrooms} baños
              </span>
              <span className='flex items-center gap-2 text-sm font-medium'>
                <Square size={17} /> {apartment.squareMeters} m²
              </span>
            </div>
            <div>
              <h2 className='font-semibold mb-3'>Descripción</h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Hermoso penthouse en el corazón de Chapinero Alto, con vista panorámica de la
                ciudad. Acabados de lujo, cocina integral completamente equipada, terraza privada y
                parqueadero doble. A 5 minutos de los principales centros comerciales y restaurantes
                del sector. Edificio con lobby 24 horas, portería y CCTV en todas las áreas comunes.
              </p>
            </div>
            <div>
              <h2 className='font-semibold mb-4'>Amenidades</h2>
              <div className='grid grid-cols-2 gap-3'>
                {[
                  { icon: Wifi, label: 'Wifi de alta velocidad' },
                  { icon: Car, label: 'Parqueadero doble' },
                  { icon: Dumbbell, label: 'Gimnasio privado' },
                  { icon: Wind, label: 'Aire acondicionado' },
                  { icon: Shield, label: 'Seguridad 24/7' },
                  { icon: Building, label: 'Terraza privada' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className='flex items-center gap-2.5 text-sm'>
                    <div className='w-8 h-8 rounded-lg bg-muted flex items-center justify-center'>
                      <Icon size={15} className='text-muted-foreground' />
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className='bg-card border border-border rounded-2xl p-5 sticky top-20'>
              <div className='flex items-baseline gap-1 mb-5'>
                <span className='text-2xl font-extrabold'>
                  {formatCurrency(apartment.pricePerDay)}
                </span>
                <span className='text-muted-foreground text-sm'>/día</span>
              </div>
              <div className='mb-4'>
                <div className='flex items-center justify-between mb-3'>
                  <button className='text-muted-foreground hover:text-foreground transition-colors'>
                    <ChevronLeft size={16} />
                  </button>
                  <span className='text-sm font-semibold'>Mayo 2026</span>
                  <button className='text-muted-foreground hover:text-foreground transition-colors'>
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className='grid grid-cols-7 mb-1'>
                  {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((d) => (
                    <div
                      key={d}
                      className='text-center text-[11px] text-muted-foreground py-1 font-medium'
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className='grid grid-cols-7 gap-y-0.5'>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`e${i}`} />
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const d = i + 1
                    const booked = BOOKED_DAYS.includes(d)
                    const isStart = d === startDay
                    const isEnd = d === endDay
                    const inRange = !!(startDay && endDay && d > startDay && d < endDay)
                    return (
                      <button
                        key={d}
                        onClick={() => handleDay(d)}
                        disabled={booked}
                        className={[
                          'text-xs h-7 w-full rounded text-center transition-colors',
                          booked
                            ? 'text-muted-foreground/40 line-through cursor-not-allowed'
                            : 'hover:bg-muted cursor-pointer',
                          isStart || isEnd ? '!bg-foreground !text-white font-semibold' : '',
                          inRange ? 'bg-muted' : '',
                        ].join(' ')}
                      >
                        {d}
                      </button>
                    )
                  })}
                </div>
              </div>
              {nights > 0 && (
                <div className='border-t border-border pt-3 mb-4 space-y-1.5 text-sm'>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>{nights} días seleccionados</span>
                    <span>{formatCurrency(Math.round((apartment.pricePerDay * nights) / 30))}</span>
                  </div>
                  <div className='flex justify-between font-bold border-t border-border pt-2'>
                    <span>Total</span>
                    <span>{formatCurrency(Math.round((apartment.pricePerDay * nights) / 30))}</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => onNavigate('checkout')}
                className='w-full py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90'
                style={{ background: nights > 0 ? '#2B4FFF' : '#111118' }}
              >
                {nights > 0 ? 'Reservar ahora' : 'Selecciona las fechas'}
              </button>
              <p className='text-[11px] text-muted-foreground text-center mt-2'>
                Sin cargos hasta confirmar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

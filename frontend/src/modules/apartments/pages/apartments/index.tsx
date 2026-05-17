import React from 'react'
import { useState } from 'react'
import { ApartmentCard } from '@/modules/apartments/components/ApartmentCard'
import { ApartmentModel } from '@/models/ApartmentModel'
import { apartmentService } from '@/services/apartment'
import { Check, Filter, Search } from 'lucide-react'

export const ApartmentsPage = () => {
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [rooms, setRooms] = useState(0)
  const [apartments, setApartments] = React.useState<ApartmentModel[]>([])

  const loadData = async () => {
    const response = await apartmentService.getAll({
      page: 0,
      pageSize: 20,
    })
    if (response?.content) {
      setApartments(response?.content)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [])

  const toggleCity = (c: string) =>
    setSelectedCities((sc) => (sc.includes(c) ? sc.filter((x) => x !== c) : [...sc, c]))

  return (
    <div className='min-h-screen bg-background'>
      {/* Search header */}
      <div className='border-b border-border bg-card px-6 py-4'>
        <div className='max-w-6xl mx-auto flex items-center gap-3'>
          <div className='flex-1 flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 border border-border'>
            <Search size={15} className='text-muted-foreground shrink-0' />
            <input
              className='flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground'
              placeholder='Buscar por ciudad, barrio o nombre...'
            />
          </div>
          <button className='flex items-center gap-2 border border-border rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-muted transition bg-card'>
            <Filter size={14} /> Filtros
          </button>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-6 flex gap-7'>
        {/* Sidebar */}
        <aside className='hidden md:block w-52 shrink-0 space-y-7'>
          <div>
            <h4 className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
              Ciudad
            </h4>
            <div className='space-y-2'>
              {['Bogotá', 'Medellín', 'Cali', 'Cartagena', 'Bucaramanga'].map((c) => (
                <label key={c} className='flex items-center gap-2 cursor-pointer'>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCities.includes(c) ? 'border-foreground bg-foreground' : 'border-border hover:border-foreground/50'}`}
                    onClick={() => toggleCity(c)}
                  >
                    {selectedCities.includes(c) && <Check size={10} className='text-white' />}
                  </div>
                  <span className='text-sm'>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
              Habitaciones
            </h4>
            <div className='flex gap-2 flex-wrap'>
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setRooms(n)}
                  className={`h-9 px-2 rounded-md border text-sm font-medium transition-colors ${rooms === n ? 'bg-foreground text-white border-foreground' : 'border-border hover:bg-muted'}`}
                >
                  {n === 0 ? 'Todas' : n === 4 ? '4+' : n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
              Precio / mes
            </h4>
            <div className='text-sm mb-2 font-medium'>$1.2M – $4.5M</div>
            <div className='h-1.5 bg-muted rounded-full relative'>
              <div
                className='absolute left-[10%] right-[5%] top-0 h-1.5 rounded-full'
                style={{ background: '#2B4FFF' }}
              />
              <div
                className='absolute left-[10%] -top-1 w-3 h-3 bg-white border-2 rounded-full'
                style={{ borderColor: '#2B4FFF' }}
              />
              <div
                className='absolute right-[5%] -top-1 w-3 h-3 bg-white border-2 rounded-full'
                style={{ borderColor: '#2B4FFF' }}
              />
            </div>
          </div>

          <div>
            <h4 className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
              Amenidades
            </h4>
            <div className='space-y-2'>
              {[
                'Parqueadero',
                'Gimnasio',
                'Piscina',
                'Seguridad 24/7',
                'Wifi incluido',
                'Terraza',
              ].map((a) => (
                <label key={a} className='flex items-center gap-2 cursor-pointer'>
                  <div className='w-4 h-4 rounded border border-border hover:border-foreground/50 transition-colors' />
                  <span className='text-sm'>{a}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-5'>
            <span className='text-sm text-muted-foreground'>
              <strong className='text-foreground font-semibold'>6</strong> apartamentos encontrados
            </span>
            <select className='text-sm border border-border rounded-lg px-3 py-2 bg-card outline-none cursor-pointer'>
              <option>Más relevantes</option>
              <option>Precio: menor a mayor</option>
              <option>Mejor valorados</option>
              <option>Más recientes</option>
            </select>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
            {apartments.map((apt, index) => (
              <ApartmentCard key={apt.id} apartment={apt} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

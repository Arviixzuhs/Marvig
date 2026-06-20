import React from 'react'
import { Search } from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import { useDebounce } from 'use-debounce'
import { inputStyles } from '@/styles'
import { ApartmentCard } from '@/modules/apartments/components/ApartmentCard'
import { IPageResponse } from '@/api/interfaces'
import { ApartmentModel } from '@/models/ApartmentModel'
import { GET_APARTMENTS } from '@/services/apartment/graphql/getApartmentsQuery'
import { IApartmentFilter } from '@/models/ApartmentModel'
import { Pagination, Slider, Input, Button, ButtonGroup } from '@heroui/react'
import { useSearchParams } from 'react-router-dom'

export const ApartmentsPage = () => {
  const INITIAL_PRICE_RANGE = [20, 2000]
  const [searchParams, _setSearchParams] = useSearchParams()
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  const isValidParamDate = (dateStr: string | null): boolean => {
    if (!dateStr) return false
    const regex = /^\d{4}-\d{2}-\d{2}$/
    if (!regex.test(dateStr)) return false
    const date = new Date(dateStr)
    return !isNaN(date.getTime())
  }

  const validFromDate = isValidParamDate(startDate) ? startDate! : ''
  const validToDate = isValidParamDate(endDate) ? endDate! : ''

  const [filters, setFilters] = React.useState<IApartmentFilter>({
    page: 0,
    pageSize: 12,
    search: '',
    number: '',
    floor: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    fromDate: validFromDate,
    toDate: validToDate,
    minPrice: INITIAL_PRICE_RANGE[0],
    maxPrice: INITIAL_PRICE_RANGE[1],
  })

  const [debouncedFilters] = useDebounce(filters, 350)

  const { data, loading } = useQuery<{
    findApartments: IPageResponse<ApartmentModel>
  }>(GET_APARTMENTS, {
    variables: {
      filters: {
        ...debouncedFilters,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const apartments = data?.findApartments.content || []
  const totalPages = data?.findApartments.totalPages || 1

  const handleFilterChange = (key: keyof IApartmentFilter, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' || value === undefined ? undefined : value,
      page: 0,
    }))
  }

  const handleToggleFilter = (key: 'bedrooms' | 'bathrooms', value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? undefined : value,
      page: 0,
    }))
  }

  const handlePriceRangeChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setFilters((prev) => ({
        ...prev,
        minPrice: value[0],
        maxPrice: value[1],
        page: 0,
      }))
    }
  }

  const handlePagination = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page: page - 1,
    }))
  }

  const resetFilters = () => {
    setFilters({
      page: 0,
      pageSize: 12,
      search: '',
      number: '',
      floor: undefined,
      status: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      minSquareMeters: undefined,
      maxSquareMeters: undefined,
      minPrice: INITIAL_PRICE_RANGE[0],
      maxPrice: INITIAL_PRICE_RANGE[1],
    })
  }

  return (
    <div className='min-h-screen bg-background text-foreground'>
      <div className='max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-7'>
        <aside className='w-full md:w-64 shrink-0 space-y-6 bg-card p-5 rounded-2xl  h-fit'>
          <div className='flex justify-between items-center pb-2 border-b border-border'>
            <h3 className='font-bold text-xs tracking-wide text-muted-foreground'>
              Filtros Avanzados
            </h3>
            <Button
              size='sm'
              variant='light'
              color='danger'
              onPress={resetFilters}
              className='h-auto p-1 min-w-0 text-xs'
            >
              Limpiar todo
            </Button>
          </div>
          <div>
            <h4 className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
              Habitaciones
            </h4>
            <ButtonGroup size='sm' variant='flat' className='w-full flex'>
              {[1, 2, 3, 4].map((n) => (
                <Button
                  key={n}
                  onPress={() => handleToggleFilter('bedrooms', n)}
                  className={`flex-1 min-w-0 transition-colors ${
                    filters.bedrooms === n ? 'bg-foreground text-background font-semibold' : ''
                  }`}
                >
                  {n}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div>
            <h4 className='text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3'>
              Baños
            </h4>
            <ButtonGroup size='sm' variant='flat' className='w-full flex'>
              {[1, 2, 3].map((n) => (
                <Button
                  key={n}
                  onPress={() => handleToggleFilter('bathrooms', n)}
                  className={`flex-1 min-w-0 transition-colors ${
                    filters.bathrooms === n ? 'bg-foreground text-background font-semibold' : ''
                  }`}
                >
                  {n}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div className='pt-2'>
            <Slider
              label='Precio / mes'
              size='sm'
              step={20}
              minValue={20}
              maxValue={2000}
              value={[
                filters.minPrice ?? INITIAL_PRICE_RANGE[0],
                filters.maxPrice ?? INITIAL_PRICE_RANGE[1],
              ]}
              onChange={handlePriceRangeChange}
              formatOptions={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
              classNames={{
                label: 'text-[11px] font-semibold uppercase tracking-widest text-muted-foreground',
                value: 'text-xs font-medium text-foreground',
              }}
            />
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Input
              type='number'
              label='Piso'
              labelPlacement='outside'
              placeholder='Ej. 3'
              size='sm'
              variant='bordered'
              value={filters.floor?.toString() || ''}
              onValueChange={(val) => handleFilterChange('floor', val)}
            />
            <Input
              type='text'
              label='Número Apt'
              labelPlacement='outside'
              placeholder='Ej. 102'
              size='sm'
              variant='bordered'
              value={filters.number || ''}
              onValueChange={(val) => handleFilterChange('number', val)}
            />
          </div>
        </aside>
        <div className='flex-1 flex flex-col gap-5'>
          <Input
            size='md'
            variant='flat'
            isClearable
            radius='lg'
            classNames={inputStyles}
            placeholder='Buscar...'
            startContent={<Search size={16} className='text-muted-foreground' />}
            value={filters.search || ''}
            onValueChange={(val) => handleFilterChange('search', val)}
            onClear={() => handleFilterChange('search', '')}
          />
          {loading ? (
            <div className='flex justify-center items-center py-24 text-sm text-muted-foreground animate-pulse'>
              Buscando propiedades...
            </div>
          ) : apartments.length === 0 ? (
            <div className='flex flex-col justify-center items-center py-24 text-sm text-muted-foreground bg-card rounded-2xl border border-dashed border-border gap-2'>
              <span>No se encontraron apartamentos con estos filtros.</span>
              <Button size='sm' variant='flat' onClick={resetFilters}>
                Restablecer búsqueda
              </Button>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                {apartments.map((apt, index) => (
                  <ApartmentCard key={apt.id} apartment={apt} index={index} />
                ))}
              </div>
              <div className='flex justify-center'>
                <Pagination
                  page={(filters?.page || 0) + 1}
                  total={totalPages}
                  variant='light'
                  onChange={handlePagination}
                  isCompact
                  showControls
                  color='primary'
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

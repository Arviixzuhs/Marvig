import React from 'react'
import { RootState } from '@/store'
import { useIsMobile } from '@/hooks/useMobile'
import { useLocation } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearAllFilters, setColumnFilter } from '@/features/appTableSlice'
import { Button, Chip, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'

export const ChipFilterGroup = () => {
  const dispatch = useDispatch()

  const isMobile = useIsMobile()

  const location = useLocation()

  React.useEffect(() => {
    dispatch(clearAllFilters())
  }, [location])

  const { columns, filters } = useSelector((state: RootState) => state.appTable)

  const chipColumns = columns.filter((col) => col.style === 'chip' && col.chipConfig)

  const handleChipClick = (uid: string, value: string) => {
    const currentSelections = filters[uid] || []
    let newSelections: string[]

    if (currentSelections.includes(value)) {
      newSelections = currentSelections.filter((item) => item !== value)
    } else {
      newSelections = [...currentSelections, value]
    }

    dispatch(setColumnFilter({ uid, selectedValues: newSelections }))
  }

  if (chipColumns.length === 0) return null

  return (
    <div>
      <Popover placement='bottom-start'>
        <PopoverTrigger>
          <Button
            variant='flat'
            isIconOnly={isMobile}
            startContent={
              <div>
                <SlidersHorizontal size={18} className='text-xl text-default-500' />
              </div>
            }
          >
            {!isMobile ? 'Filtros' : ''}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0'>
          <div className='flex flex-col gap-4 p-4 w-72 max-w-xs border border-default-100 rounded-xl bg-content1 shadow-md'>
            {chipColumns.map((column) => {
              const uid = column.uid
              const config = column.chipConfig || {}
              const currentSelections = filters[uid] || []

              return (
                <div key={uid} className='flex flex-col gap-2'>
                  <span className='text-xs font-semibold text-default-500 '>
                    Filtrar por {column.name}
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    {Object.entries(config).map(([value, info]) => {
                      const isSelected = currentSelections.includes(value)

                      return (
                        <Chip
                          key={value}
                          variant={isSelected ? 'solid' : 'flat'}
                          className='cursor-pointer transition-transform active:scale-95 text-white text-xs'
                          style={{
                            backgroundColor: `${info.color}40`,
                            color: info.color,
                            border: `1px solid ${isSelected ? info.color : 'transparent'}`,
                          }}
                          onClick={() => handleChipClick(uid, value)}
                        >
                          {info.label}
                        </Chip>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

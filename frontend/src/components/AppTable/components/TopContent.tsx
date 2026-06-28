import { Plus } from 'lucide-react'
import { Button } from '@heroui/button'
import { Searchbar } from './Searchbar'
import { useDispatch } from 'react-redux'
import { ChipFilterGroup } from './FilterBy'
import { toggleAddItemModal } from '@/features/appTableSlice'
import { FilterByDatePicker } from './FilterByDate'

interface TopContentProps {
  hiddeAdd?: boolean
  filterByDate?: boolean
  topContentExtension?: React.ReactElement
  searchbarPlaceholder?: string
}

export const TopContent = ({
  hiddeAdd,
  filterByDate,
  topContentExtension,
  searchbarPlaceholder,
}: TopContentProps) => {
  const dispatch = useDispatch()

  return (
    <div className='flex flex-col sm:flex-row gap-4 w-full mb-4 justify-between items-stretch md:items-center'>
      <div className='flex flex-row gap-3 items-center w-full lg:flex-1'>
        <div className='w-full sm:w-80'>
          <Searchbar searchbarPlaceholder={searchbarPlaceholder} />
        </div>
        <div className='flex items-center gap-3'>
          <ChipFilterGroup />
          {filterByDate && <FilterByDatePicker />}
        </div>
        {topContentExtension && <div className='flex-1 min-w-[150px]'>{topContentExtension}</div>}
      </div>
      {!hiddeAdd && (
        <div className='flex items-center justify-end shrink-0'>
          <Button
            onPress={() => dispatch(toggleAddItemModal(null))}
            color='primary'
            startContent={<Plus size={14} />}
            className='font-medium w-full sm:w-auto'
          >
            Agregar
          </Button>
        </div>
      )}
    </div>
  )
}

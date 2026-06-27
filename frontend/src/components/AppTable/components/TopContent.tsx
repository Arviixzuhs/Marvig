import { Plus } from 'lucide-react'
import { Button } from '@heroui/button'
import { Searchbar } from './Searchbar'
import { useDispatch } from 'react-redux'
import { toggleAddItemModal } from '@/features/appTableSlice'
import { FilterByDatePicker } from './FilterByDate'
import { ChipFilterGroup } from './FilterBy'

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
    <div className='flex flex-col sm:flex-row gap-3 w-full mb-4 justify-between items-stretch sm:items-center'>
      <div className='flex flex-wrap gap-3 items-center w-full sm:flex-1'>
        <div className='flex gap-3 w-full max-w-none sm:max-w-lg shrink-0'>
          <Searchbar searchbarPlaceholder={searchbarPlaceholder} />
          <ChipFilterGroup />
          {filterByDate && <FilterByDatePicker />}
        </div>
        {topContentExtension && topContentExtension}
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

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
    <div className='flex flex-col lg:flex-row gap-3 w-full mb-4 justify-between items-stretch lg:items-center'>
      <div className='flex flex-wrap gap-2 items-center w-full lg:flex-1'>
        <div className='w-full sm:w-72 max-w-none sm:max-w-xs shrink-0'>
          <Searchbar searchbarPlaceholder={searchbarPlaceholder} />
        </div>
        <ChipFilterGroup />
        {filterByDate && <FilterByDatePicker />}
        {topContentExtension && topContentExtension}
      </div>
      <div className='flex items-center justify-end shrink-0'>
        {!hiddeAdd && (
          <Button
            onPress={() => dispatch(toggleAddItemModal(null))}
            color='primary'
            startContent={<Plus size={14} />}
            className='font-medium w-full sm:w-auto'
          >
            Agregar
          </Button>
        )}
      </div>

    </div>
  )
}
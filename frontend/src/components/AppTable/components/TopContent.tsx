import { Plus } from 'lucide-react'
import { Button } from '@heroui/button'
import { Searchbar } from './Searchbar'
import { useDispatch } from 'react-redux'
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
    <div className='flex gap-2 w-full'>
      <Searchbar searchbarPlaceholder={searchbarPlaceholder} />
      {filterByDate && <FilterByDatePicker />}
      {topContentExtension && topContentExtension}
      {!hiddeAdd && (
        <div>
          <Button
            onPress={() => dispatch(toggleAddItemModal(null))}
            color='primary'
            startContent={<Plus size={14} />}
          >
            Agregar
          </Button>
        </div>
      )}
    </div>
  )
}

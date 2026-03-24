import { Input } from '@heroui/input'
import { Search } from 'lucide-react'
import { RootState } from '@/store'
import { setFilterValue } from '@/features/appTableSlice'
import { useDispatch, useSelector } from 'react-redux'

interface SearchbarProps {
  searchbarPlaceholder?: string
}

export const Searchbar = ({ searchbarPlaceholder }: SearchbarProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setFilterValue(e.target.value))

  return (
    <Input
      type='search'
      value={table.filterValue}
      onChange={handleChange}
      placeholder={searchbarPlaceholder ? searchbarPlaceholder : 'Buscar...'}
      startContent={<Search />}
      className='w-full'
      classNames={{
        input: 'bg-card',
        inputWrapper: 'bg-card',
      }}
    />
  )
}

import { RootState } from '@/store'
import { setRowsPerPage } from '@/features/appTableSlice'
import { Select, SelectItem } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'

export const RowsPerPage = () => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)
  const rowsPerPageOptions = [10, 15, 20]

  return (
    <Select
      size='sm'
      color='primary'
      selectedKeys={new Set([String(table.rowsPerPage)])}
      className='w-[70px] sm:w-20 min-w-max text-xs sm:text-md'
      onChange={(e) => dispatch(setRowsPerPage(Number(e.target.value)))}
      classNames={{
        trigger: 'h-8',
        value: 'text-xs sm:text-md',
      }}
      aria-label='Rows per page'
      defaultSelectedKeys={new Set([String(table.rowsPerPage)])}
    >
      {rowsPerPageOptions.map((option) => (
        <SelectItem key={option}>{String(option)}</SelectItem>
      ))}
    </Select>
  )
}

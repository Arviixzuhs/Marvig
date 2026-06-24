import { RootState } from '@/store'
import { Pagination } from '@heroui/react'
import { RowsPerPage } from './RowsPerPage'
import { setCurrentPage } from '@/features/appTableSlice'
import { useDispatch, useSelector } from 'react-redux'

interface ITablePagination {
  totalPages?: number
}

export const TablePagination = ({ totalPages }: ITablePagination) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()

  const handlePagination = (page: number) => {
    dispatch(setCurrentPage(page - 1))
  }

  return (
    <div className='flex justify-end bg-content1 items-center hoverScrollbar overflow-auto sm:bg-c-card p-2 px-4 rounded-b-2xl gap-3 min-h-[60px]'>
      <RowsPerPage />
      <Pagination
        page={table.currentPage + 1}
        total={totalPages || 1}
        variant='light'
        onChange={handlePagination}
        isCompact
        showControls
        initialPage={1}
      />
    </div>
  )
}

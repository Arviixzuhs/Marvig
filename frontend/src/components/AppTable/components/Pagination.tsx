import { RootState } from '@/store'
import { Pagination } from '@heroui/react'
import { RowsPerPage } from './RowsPerPage'
import { setCurrentPage } from '@/features/appTableSlice'
import { useDispatch, useSelector } from 'react-redux'

export const TablePagination = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()

  const handlePagination = (page: number) => {
    dispatch(setCurrentPage(page - 1))
  }

  return (
    <div className='flex gap-2'>
      <Pagination
        page={table.currentPage + 1}
        total={table.totalPages}
        onChange={handlePagination}
        initialPage={table.currentPage}
      />
      <RowsPerPage />
    </div>
  )
}

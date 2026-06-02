import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { ModalInput, setTableData, TableColumnInterface } from '@/features/appTableSlice'

interface UseTablePageProps {
  modalInputs: ModalInput[]
  tableColumns: TableColumnInterface[]
}

export const useTablePage = ({ tableColumns, modalInputs }: UseTablePageProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setTableData({
        columns: tableColumns,
        currentPage: 0,
        rowsPerPage: 10,
        filterValue: '',
        modalInputs: modalInputs,
      }),
    )
  }, [])
}

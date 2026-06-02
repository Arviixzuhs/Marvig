import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  ModalInput,
  setTableData,
  setFilterValue,
  setModalInputs,
  setTableColumns,
  TableColumnInterface,
} from '@/features/appTableSlice'

interface UseTablePageProps {
  tableColumns: TableColumnInterface[]
  modalInputs: ModalInput[]
}

export const useTablePage = ({ tableColumns, modalInputs }: UseTablePageProps) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setTableData({
        currentPage: 0,
        rowsPerPage: 10,
      }),
    )
    dispatch(setFilterValue(''))
    dispatch(setModalInputs(modalInputs))
    dispatch(setTableColumns(tableColumns))
  }, [])
}

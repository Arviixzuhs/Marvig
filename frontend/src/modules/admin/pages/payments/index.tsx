import React from 'react'
import toast from 'react-hot-toast'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { PaymentModel } from '@/models/PaymentModel'
import { paymentService } from '@/services/payment'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { reservationService } from '@/services/reservation'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { Autocomplete, AutocompleteChip } from '@/components/Autocomplete'
import { addItem, setTableData, setModalInputs, setTableColumns } from '@/features/appTableSlice'

interface IAdminPaymentPage {
  hiddeTopContent?: boolean
}

export const AdminPaymentPage = ({ hiddeTopContent = false }: IAdminPaymentPage) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  const loadData = async () => {
    try {
      const response = await paymentService.getAll({
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      })
      if (!response) return

      dispatch(setTableData(response))
    } catch (error) {
      console.log(error)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [debounceValue, table.currentPage, table.rowsPerPage])

  React.useEffect(() => {
    dispatch(setModalInputs(modalInputs))
    dispatch(setTableColumns(tableColumns))
  }, [])

  const { reserve, ...data } = table.formData
  const tableFormData = {
    ...data,
    reservationId: (reserve as AutocompleteChip[])?.[0]?.id || null,
  }

  const tableActions: AppTableActions = {
    create: async () => {
      const response = await paymentService.create(tableFormData as PaymentModel)
      dispatch(addItem(response))
      toast.success('Pago registrado correctamente')
    },
  }

  return (
    <AppTable
      tableActions={tableActions}
      hiddeTopContent={hiddeTopContent}
      searchbarPlaceholder='Buscar pago...'
      modalExtension={
        <>
          <Autocomplete
            chips
            label='Reserva'
            formDataKey='reserve'
            placeholder='Buscar reserva...'
            fetchItems={async (search) => {
              const res = await reservationService.getAll({
                search,
                page: 0,
                pageSize: 10,
              })
              return (
                res?.content.map((item) => ({
                  id: item.id,
                  name: `${item.clientName} (${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()})`,
                })) || []
              )
            }}
          />
        </>
      }
    />
  )
}

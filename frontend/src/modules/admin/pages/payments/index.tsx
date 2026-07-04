import toast from 'react-hot-toast'
import { useQuery } from '@apollo/client/react'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { useTablePage } from '@/hooks/useTablePage'
import { reportService } from '@/services/report'
import { IPageResponse } from '@/api/interfaces'
import { FIND_PAYMENTS } from '@/services/payment/graphql/getPaymentsQuery'
import { Edit, Download } from 'lucide-react'
import { paymentService } from '@/services/payment'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { PaymentModel, PaymentStatus } from '@/models/PaymentModel'
import { setCurrentItemToUpdate, toggleEditItemModal } from '@/features/appTableSlice'

interface IAdminPaymentPage {
  hiddeTopContent?: boolean
}

export const AdminPaymentPage = ({ hiddeTopContent = false }: IAdminPaymentPage) => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)
  const dispatch = useDispatch()

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch, previousData } = useQuery<{ findPayments: IPageResponse<PaymentModel> }>(
    FIND_PAYMENTS,
    {
      variables: {
        filters: {
          page: table.currentPage,
          search: debounceValue,
          status: table.filters['status'],
          method: table.filters['method'],
          pageSize: table.rowsPerPage,
          fromDate: table.dateFilter.start,
          toDate: table.dateFilter.end,
        },
      },
      notifyOnNetworkStatusChange: true,
    },
  )

  const tableActions: AppTableActions = {
    update: async () => {
      await paymentService.updateStatus(
        table.currentItemToUpdate,
        table.formData['status'] as PaymentStatus,
      )
      await refetch()
      toast.success('Pago actualizado correctamente')
    },
  }

  const handleDownloadPaymentById = async (id: number) => {
    try {
      await reportService.downloadPaymentById(id)
      toast.success('Pago descargado correctamente')
    } catch (error) {
      toast.error('Ocurrió un error al descargar el pago')
    }
  }

  return (
    <AppTable
      hiddeAdd
      totalPages={data?.findPayments.totalPages || previousData?.findPayments.totalPages}
      tableContent={data?.findPayments.content || []}
      tableActions={tableActions}
      filterByDate
      hiddeTopContent={hiddeTopContent}
      dropdownItems={[
        {
          key: 'edit_payment',
          title: 'Editar',
          startContent: <Edit size={14} />,
          onPress: (itemId: number) => {
            dispatch(setCurrentItemToUpdate(itemId))
            dispatch(toggleEditItemModal(null))
          },
        },
        {
          key: 'download_payment',
          title: 'Descargar PDF',
          startContent: <Download size={14} />,
          onPress: (itemId: number) => {
            handleDownloadPaymentById(itemId)
          },
        },
      ]}
      searchbarPlaceholder='Buscar pago por referencia...'
    />
  )
}

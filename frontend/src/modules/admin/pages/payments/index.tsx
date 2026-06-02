import toast from 'react-hot-toast'
import { useQuery } from '@apollo/client/react'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { useSelector } from 'react-redux'
import { PaymentModel } from '@/models/PaymentModel'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { FIND_PAYMENTS } from '@/services/payment/graphql/getPaymentsQuery'
import { paymentService } from '@/services/payment'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { reservationService } from '@/services/reservation'
import { tableColumns, modalInputs } from './data'
import { Autocomplete, AutocompleteChip } from '@/components/Autocomplete'

interface IAdminPaymentPage {
  hiddeTopContent?: boolean
}

export const AdminPaymentPage = ({ hiddeTopContent = false }: IAdminPaymentPage) => {
  const table = useSelector((state: RootState) => state.appTable)
  const [debounceValue] = useDebounce(table.filterValue, 100)

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch } = useQuery<{ findPayments: IPageResponse<PaymentModel> }>(FIND_PAYMENTS, {
    variables: {
      filters: {
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      },
    },
  })

  const { reserve, ...form } = table.formData
  const tableFormData = {
    ...form,
    reservationId: (reserve as AutocompleteChip[])?.[0]?.id || null,
  }

  const tableActions: AppTableActions = {
    create: async () => {
      await paymentService.create(tableFormData as PaymentModel)
      await refetch()
      toast.success('Pago registrado correctamente')
    },
  }

  return (
    <AppTable
      totalPages={data?.findPayments.totalPages}
      tableContent={data?.findPayments.content || []}
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

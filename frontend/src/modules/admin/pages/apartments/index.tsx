import toast from 'react-hot-toast'
import { Divider } from '@heroui/react'
import { AppTable } from '@/components/AppTable'
import { useQuery } from '@apollo/client/react'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { fileService } from '@/services/file'
import { useSelector } from 'react-redux'
import { useTablePage } from '@/hooks/useTablePage'
import { IPageResponse } from '@/api/interfaces'
import { ImageUploader } from '@/components/ImageUploader'
import { ApartmentModel } from '@/models/ApartmentModel'
import { useImageUpload } from '@/components/ImageUploader/providers/ImageUploaderProvider'
import { GET_APARTMENTS } from '@/services/apartment/graphql/getApartmentsQuery'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { apartmentService } from '@/services/apartment'
import { tableColumns, modalInputs } from './data'

export const AdminApartmentPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const id = table.currentItemToUpdate
  const { formData, images } = useImageUpload()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  useTablePage({ tableColumns, modalInputs })

  const { data, refetch, previousData } = useQuery<{
    findApartments: IPageResponse<ApartmentModel>
  }>(GET_APARTMENTS, {
    variables: {
      filters: {
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      },
    },
    notifyOnNetworkStatusChange: true,
  })

  const tableActions: AppTableActions = {
    create: async () => {
      try {
        const newApartment = await apartmentService.create(table.formData)

        if (images.length > 0 && newApartment) {
          const uploadRes = await fileService.uploadFiles(formData)
          await apartmentService.updateImages(newApartment.id, uploadRes.fileUrls)
        }

        await refetch()
        toast.success('Apartamento creado correctamente')
      } catch (error) {
        console.error(error)
        toast.error('Error al crear el apartamento')
      }
    },
    update: async () => {
      try {
        if (Object.keys(table.formData).length > 0) {
          await apartmentService.update(id, table.formData)
        }

        const existingURLs = images
          .filter((img) => img.imageURL && !img.file)
          .map((img) => img.imageURL)

        let finalURLs = [...existingURLs]

        if (images.length > 0) {
          const uploadRes = await fileService.uploadFiles(formData)
          finalURLs = [...finalURLs, ...uploadRes.fileUrls]
        }

        await apartmentService.updateImages(id, finalURLs)
        await refetch()
        toast.success('Apartamento actualizado correctamente')
      } catch (error) {
        console.error(error)
        toast.error('Error al actualizar el apartamento')
      }
    },
    delete: async () => {
      try {
        await apartmentService.delete(table.currentItemToDelete)
        toast.success('Apartamento eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar')
      }
    },
  }

  return (
    <AppTable
      totalPages={data?.findApartments.totalPages || previousData?.findApartments.totalPages}
      tableContent={data?.findApartments.content || []}
      modalExtension={
        <>
          <Divider />
          <ImageUploader />
        </>
      }
      tableActions={tableActions}
      searchbarPlaceholder='Buscar apartamento...'
    />
  )
}

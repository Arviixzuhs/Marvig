import React from 'react'
import toast from 'react-hot-toast'
import { Divider } from '@heroui/react'
import { AppTable } from '@/components/AppTable'
import { RootState } from '@/store'
import { useDebounce } from 'use-debounce'
import { fileService } from '@/services/file'
import { ImageUploader } from '@/components/ImageUploader'
import { useImageUpload } from '@/components/ImageUploader/providers/ImageUploaderProvider'
import { AppTableActions } from '@/components/AppTable/interfaces/appTable'
import { apartmentService } from '@/services/apartment'
import { useDispatch, useSelector } from 'react-redux'
import { tableColumns, modalInputs } from './data'
import { ApartmentModel, IApartmentImage } from '@/models/ApartmentModel'
import { deleteItem, setTableData, setModalInputs, setTableColumns } from '@/features/appTableSlice'

export const AdminApartmentPage = () => {
  const table = useSelector((state: RootState) => state.appTable)
  const id = table.currentItemToUpdate
  const dispatch = useDispatch()
  const { formData, resetFormData, setImages, images } = useImageUpload()
  const [debounceValue] = useDebounce(table.filterValue, 100)

  const loadData = async () => {
    try {
      const response = await apartmentService.getAll({
        page: table.currentPage,
        search: debounceValue,
        pageSize: table.rowsPerPage,
      })
      if (!response) return
      dispatch(setTableData(response))
    } catch (error) {
      console.error('Error loading apartments:', error)
    }
  }

  React.useEffect(() => {
    loadData()
  }, [debounceValue, table.currentPage, table.rowsPerPage])

  React.useEffect(() => {
    dispatch(setModalInputs(modalInputs))
    dispatch(setTableColumns(tableColumns))
  }, [])

  React.useEffect(() => {
    if (!table.currentItemToUpdate) {
      resetFormData()
      return
    }

    const itemToUpdate = table.data.find(
      (item: ApartmentModel) => item.id === table.currentItemToUpdate,
    )

    if (itemToUpdate?.images) {
      setImages(
        itemToUpdate.images.map((img: IApartmentImage) => ({
          id: String(img.id),
          imageURL: img.url,
        })),
      )
    }
  }, [table.currentItemToUpdate, table.data])

  const tableActions: AppTableActions = {
    create: async () => {
      try {
        const newApartment = await apartmentService.create(table.formData)

        if (images.length > 0 && newApartment) {
          const uploadRes = await fileService.uploadFiles(formData)
          await apartmentService.updateImages(newApartment.id, uploadRes.fileUrls)
        }

        await loadData()
        toast.success('Apartamento creado correctamente')
        resetFormData()
      } catch (error) {
        console.error(error)
        toast.error('Error al crear el apartamento')
      }
    },
    update: async () => {
      try {
        await apartmentService.update(id, table.formData)

        const existingURLs = images
          .filter((img) => img.imageURL && !img.file)
          .map((img) => img.imageURL)

        let finalURLs = [...existingURLs]

        if (images.length > 0) {
          const uploadRes = await fileService.uploadFiles(formData)
          finalURLs = [...finalURLs, ...uploadRes.fileUrls]
        }

        await apartmentService.updateImages(id, finalURLs)

        resetFormData()
        await loadData()
        toast.success('Apartamento actualizado correctamente')
      } catch (error) {
        console.error(error)
        toast.error('Error al actualizar el apartamento')
      }
    },
    delete: async () => {
      try {
        await apartmentService.delete(table.currentItemToDelete)
        dispatch(deleteItem(table.currentItemToDelete))
        toast.success('Apartamento eliminado correctamente')
      } catch (error) {
        toast.error('Error al eliminar')
      }
    },
  }

  return (
    <AppTable
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

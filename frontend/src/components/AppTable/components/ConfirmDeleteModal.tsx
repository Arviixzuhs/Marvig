import React from 'react'
import toast from 'react-hot-toast'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { toggleConfirmDeleteModal } from '@/features/appTableSlice'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'

interface ConfirmDeleteModalProps {
  handleDelete: () => Promise<void>
}

export const ConfirmDeleteModal = ({ handleDelete }: ConfirmDeleteModalProps) => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const toggleDeleteModal = () => {
    dispatch(toggleConfirmDeleteModal(null))
  }

  const confirmDelete = async () => {
    try {
      setIsLoading(true)
      await handleDelete()
      toggleDeleteModal()
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar el registro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      isOpen={table.isConfirmDeleteModalOpen}
      onClose={toggleDeleteModal}
      placement='center'
      backdrop='blur'
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader className='flex justify-center'>Mensaje importante</ModalHeader>
        <ModalBody className='text-center'>
          <p>¿Estas seguro que deseas eliminar este registro?</p>
          <p className='text-red-400 text-sm'>Esta acción no puede deshacerse.</p>
        </ModalBody>
        <ModalFooter className='flex gap-2 w-full'>
          <Button variant='flat' className='w-full' onPress={() => toggleDeleteModal()}>
            Cancelar
          </Button>
          <Button color='danger' className='w-full' onPress={confirmDelete} isLoading={isLoading}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

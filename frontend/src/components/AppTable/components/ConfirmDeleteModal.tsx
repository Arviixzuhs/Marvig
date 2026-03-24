import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { toggleConfirmDeleteModal } from '@/features/appTableSlice'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react'

interface ConfirmDeleteModalProps {
  handleDelete: () => void
}

export const ConfirmDeleteModal = ({ handleDelete }: ConfirmDeleteModalProps) => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)

  const toggleDeleteModal = () => {
    dispatch(toggleConfirmDeleteModal(null))
  }

  const confirmDelete = () => {
    handleDelete()
    toggleDeleteModal()
  }

  return (
    <Modal isOpen={table.isConfirmDeleteModalOpen} onClose={toggleDeleteModal} placement='center'>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader className='flex justify-center'>Mensaje importante</ModalHeader>
        <ModalBody className='text-center'>
          <p>¿Estas seguro que deseas eliminar este registro?</p>
          <p className='text-red-400 text-sm'>Esta acción no puede deshacerse.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant='light' onPress={() => toggleDeleteModal()}>
            Cancelar
          </Button>
          <Button color='danger' onPress={confirmDelete}>
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

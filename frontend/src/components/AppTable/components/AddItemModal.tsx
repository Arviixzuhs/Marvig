import React from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { setFormData, clearFormData, toggleAddItemModal } from '@/features/appTableSlice'
import {
  Form,
  Modal,
  Input,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from '@heroui/react'

export interface AddItemModalProps {
  action: () => void
  children: React.ReactNode
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  action,
  children,
}: AddItemModalProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(clearFormData(null))
  }, [table.isAddItemModalOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch(setFormData({ name: e.target.name, value: e.target.value }))

  const toggleModal = () => {
    dispatch(toggleAddItemModal(null))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    /* Object.fromEntries(new FormData(e.currentTarget)) */
    action()
    toggleModal()
  }

  return (
    <>
      <Modal
        size='4xl'
        isOpen={table.isAddItemModalOpen}
        onClose={toggleModal}
        placement='center'
        scrollBehavior='inside'
      >
        <ModalContent>
          <ModalHeader className='flex flex-col gap-1'>Agregar</ModalHeader>

          <Form onSubmit={onSubmit} className='overflow-auto'>
            <ModalBody className='w-full'>
              <div className='w-full flex flex-col gap-4'>
                {table.modalInputs.map((item, index) => (
                  <div
                    key={index}
                    className='flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4'
                  >
                    <Input
                      min={0}
                      max={999999}
                      size='sm'
                      type={item.type}
                      name={item.name}
                      value={String(table.formData?.[item.name] || '')}
                      label={item.label}
                      required={item.required}
                      onChange={handleChange}
                      placeholder={item.placeholder}
                    />
                  </div>
                ))}
                {children}
              </div>
            </ModalBody>
            <ModalFooter className='flex gap-2 mt-3 w-full'>
              <Button
                type='button'
                radius='sm'
                variant='flat'
                onPress={toggleModal}
                className='w-full'
              >
                Cerrar
              </Button>
              <Button className='w-full' type='submit' color='primary' radius='sm'>
                Guardar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </>
  )
}

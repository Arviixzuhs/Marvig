import React from 'react'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFormData,
  clearFormData,
  toggleEditItemModal,
  setCurrentItemToUpdate,
} from '@/features/appTableSlice'
import {
  Form,
  Modal,
  Input,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalContent,
  Select,
  SelectItem,
  DatePicker,
} from '@heroui/react'
import { parseAbsoluteToLocal } from '@internationalized/date'
import { useImageUpload } from '@/components/ImageUploader/providers/ImageUploaderProvider'

export interface EditItemModalProps {
  action: () => void
  children: React.ReactNode
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  action,
  children,
}: EditItemModalProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const { resetFormData, setImages } = useImageUpload()
  const currentItemToEdit = table.data.find((item) => item.id === table.currentItemToUpdate)

  const parseDateTime = (value: any) => {
    if (!value) return null

    try {
      return parseAbsoluteToLocal(value)
    } catch {
      return null
    }
  }

  React.useEffect(() => {
    if (!table.isEditItemModalOpen) {
      dispatch(clearFormData(null))
      dispatch(setCurrentItemToUpdate(-1))
    }
  }, [table.isEditItemModalOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type?: string) => {
    const { name, value } = e.target

    let processedValue: string | number | null = value

    if (value === '') {
      dispatch(setFormData({ name, value: null }))
      return
    }

    if (type === 'number' || type === 'float') {
      const regex = type === 'float' ? /[^0-9.]/g : /[^0-9]/g

      const sanitizedString = value.replace(regex, '')

      if (type === 'float') {
        if ((sanitizedString.match(/\./g) || []).length > 1) return
      }

      if (sanitizedString.endsWith('.')) {
        dispatch(setFormData({ name, value: sanitizedString }))
        return
      }

      processedValue =
        type === 'float' ? parseFloat(sanitizedString) : parseInt(sanitizedString, 10)

      if (isNaN(processedValue)) return
    }

    dispatch(setFormData({ name, value: processedValue }))
  }

  const handleSelectChange = (name: string, value: string) => {
    dispatch(setFormData({ name, value }))
  }

  const toggleModal = () => {
    resetFormData()
    setImages([])
    dispatch(toggleEditItemModal(null))
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    action()
    toggleModal()
  }

  const handleDateChange = (name: string, value: any) => {
    if (!value) {
      dispatch(setFormData({ name, value: null }))
      return
    }

    dispatch(
      setFormData({
        name,
        value: value.toDate().toISOString(),
      }),
    )
  }

  return (
    <Modal
      size='4xl'
      isOpen={table.isEditItemModalOpen}
      onClose={toggleModal}
      placement='center'
      scrollBehavior='inside'
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <ModalHeader>Editar</ModalHeader>

        <Form onSubmit={onSubmit} className='overflow-auto'>
          <ModalBody className='w-full'>
            <div className='w-full flex flex-col gap-4'>
              {table.modalInputs.map((item, index) => (
                <div key={index} className='w-full'>
                  {item.type === 'select' && (
                    <Select
                      label={item.label}
                      placeholder={item.placeholder}
                      name={item.name}
                      isRequired={item.required}
                      defaultSelectedKeys={
                        currentItemToEdit?.[item.name]
                          ? [String(currentItemToEdit?.[item.name])]
                          : []
                      }
                      onSelectionChange={(keys) =>
                        handleSelectChange(item.name, Array.from(keys)[0] as string)
                      }
                    >
                      {(item.options || []).map((opt) => (
                        <SelectItem key={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                  {item.type === 'date' && (
                    <DatePicker
                      label={item.label}
                      granularity='minute'
                      hourCycle={24}
                      isRequired={item.required}
                      value={parseDateTime(
                        table.formData?.[item.name] ?? currentItemToEdit?.[item.name],
                      )}
                      onChange={(value) => handleDateChange(item.name, value)}
                    />
                  )}
                  {item.type !== 'select' && item.type !== 'date' && (
                    <Input
                      size='md'
                      type='text'
                      name={item.name}
                      label={item.label}
                      placeholder={item.placeholder}
                      isRequired={item.required}
                      defaultValue={currentItemToEdit?.[item.name]}
                      onChange={(e) => handleChange(e, item.type)}
                    />
                  )}
                </div>
              ))}
              {children}
            </div>
          </ModalBody>

          <ModalFooter className='flex gap-2 w-full'>
            <Button type='button' variant='flat' onPress={toggleModal} className='w-full'>
              Cancelar
            </Button>

            <Button type='submit' color='primary' className='w-full'>
              Guardar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  )
}

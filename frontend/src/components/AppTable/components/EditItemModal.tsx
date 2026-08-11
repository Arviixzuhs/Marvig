import React from 'react'
import toast from 'react-hot-toast'
import { RootState } from '@/store'
import { parseAbsoluteToLocal } from '@internationalized/date'
import { useDispatch, useSelector } from 'react-redux'
import {
  setFormData,
  toggleEditItemModal,
  setCurrentItemToUpdate,
  InputType,
  clearFormData,
} from '@/features/appTableSlice'
import {
  Form,
  Modal,
  Input,
  Select,
  Button,
  Divider,
  Textarea,
  ModalBody,
  DatePicker,
  SelectItem,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from '@heroui/react'
import { isValidNumericInput } from '@/utils/isValidNumericInput'

export interface EditItemModalProps {
  action: () => Promise<void>
  children: React.ReactNode
  tableContent: any[]
  modalExtensionUp?: React.ReactNode
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  action,
  children,
  tableContent,
  modalExtensionUp,
}: EditItemModalProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const currentItemToEdit = tableContent.find((item) => item.id === table.currentItemToUpdate)
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const filteredInputs = React.useMemo(
    () => table.modalInputs.filter((input) => input.showOnEdit !== false),
    [table.modalInputs],
  )

  const parseDateTime = (value: any) => {
    if (!value) return null

    try {
      return parseAbsoluteToLocal(value)
    } catch {
      return null
    }
  }

  // Obtiene el valor modificado de Redux o cae de vuelta al item original
  const getFieldValue = (fieldName: string) => {
    if (table.formData?.[fieldName] !== undefined) {
      return table.formData[fieldName]
    }
    return currentItemToEdit?.[fieldName]
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type?: InputType,
  ) => {
    const { name, value } = e.target

    if (!isValidNumericInput(value, type)) return

    if (value === '') {
      dispatch(setFormData({ name, value: null }))
      return
    }

    let processedValue: string | number | null = value

    if (type === 'number') {
      processedValue = parseInt(value, 10)
    } else if (type === 'float') {
      processedValue = value.endsWith('.') ? value : parseFloat(value)
    }

    dispatch(setFormData({ name, value: processedValue }))
  }

  const handleSelectChange = (name: string, value: string) => {
    dispatch(setFormData({ name, value }))
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

  const toggleModal = () => {
    dispatch(toggleEditItemModal(null))
    dispatch(clearFormData(null))
    dispatch(setCurrentItemToUpdate(-1))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      filteredInputs.forEach((input) => {
        if (!input.divider && input.name) {
          if (table.formData?.[input.name] === undefined) {
            dispatch(
              setFormData({
                name: input.name,
                value: currentItemToEdit?.[input.name] ?? null,
              }),
            )
          }
        }
      })

      await action()
      toggleModal()
    } catch (error: any) {
      toast.error(error.message || 'Error al guardar el registro')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      size='4xl'
      isOpen={table.isEditItemModalOpen}
      onClose={toggleModal}
      scrollBehavior='inside'
      backdrop='blur'
      isKeyboardDismissDisabled={true}
    >
      <ModalContent>
        <ModalHeader>Editar</ModalHeader>
        <Form onSubmit={onSubmit} className='overflow-auto'>
          <ModalBody className='w-full'>
            {modalExtensionUp}
            <div className='w-full flex flex-col gap-4'>
              {filteredInputs.map((item, index) => {
                if (item.divider) {
                  return (
                    <div key={`divider-${index}`} className='flex flex-col gap-2'>
                      {item.divider.title && (
                        <div className={`${index !== 0 && 'mt-3'} flex flex-col gap-2`}>
                          <span className='text-sm font-medium text-muted-foreground'>
                            {item.divider.title}
                          </span>
                        </div>
                      )}
                      <Divider />
                    </div>
                  )
                }

                const rawVal = getFieldValue(item.name)

                return (
                  <div key={item.name || index} className='w-full'>
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
                        isRequired={item.required}
                        value={parseDateTime(rawVal)}
                        onChange={(value) => handleDateChange(item.name, value)}
                      />
                    )}

                    {(item.type === 'text' ||
                      item.type === 'number' ||
                      item.type === 'float' ||
                      item.type === 'email' ||
                      item.type === 'password') && (
                      <Input
                        size='md'
                        type={item.type === 'float' || item.type === 'number' ? 'text' : item.type}
                        name={item.name}
                        label={item.label}
                        placeholder={item.placeholder}
                        isRequired={item.required}
                        value={rawVal === null || rawVal === undefined ? '' : String(rawVal)}
                        onChange={(e) => handleChange(e, item.type)}
                      />
                    )}

                    {item.type === 'textarea' && (
                      <Textarea
                        size='md'
                        name={item.name}
                        label={item.label}
                        placeholder={item.placeholder}
                        isRequired={item.required}
                        value={rawVal === null || rawVal === undefined ? '' : String(rawVal)}
                        onChange={(e) => handleChange(e, item.type)}
                      />
                    )}
                  </div>
                )
              })}
              {children}
            </div>
          </ModalBody>

          <ModalFooter className='flex gap-2 w-full'>
            <Button type='button' variant='flat' onPress={toggleModal} className='w-full'>
              Cancelar
            </Button>

            <Button type='submit' color='primary' className='w-full' isLoading={isLoading}>
              Guardar
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  )
}

import React from 'react'
import toast from 'react-hot-toast'
import { RootState } from '@/store'
import { I18nProvider } from '@react-aria/i18n'
import { parseAbsoluteToLocal } from '@internationalized/date'
import { useDispatch, useSelector } from 'react-redux'
import { setFormData, clearFormData, toggleAddItemModal } from '@/features/appTableSlice'
import {
  Form,
  Modal,
  Input,
  Button,
  Select,
  Divider,
  Textarea,
  ModalBody,
  SelectItem,
  DatePicker,
  ModalHeader,
  ModalFooter,
  ModalContent,
} from '@heroui/react'

export interface AddItemModalProps {
  action: () => Promise<void>
  children: React.ReactNode
  modalExtensionUp?: React.ReactNode
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  action,
  children,
  modalExtensionUp,
}: AddItemModalProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const parseDateTime = (value: any) => {
    if (!value) return null
    try {
      return parseAbsoluteToLocal(value)
    } catch {
      return null
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, type?: string) => {
    const { name, value } = e.target
    if (value === '') {
      dispatch(setFormData({ name, value: null }))
      return
    }

    let processedValue: string | number | null = value

    if (type === 'number' || type === 'float') {
      const regex = type === 'float' ? /[^0-9.]/g : /[^0-9]/g
      let sanitizedString = value.replace(regex, '')

      if (sanitizedString === '') return

      if (type === 'float') {
        const dots = (sanitizedString.match(/\./g) || []).length
        if (dots > 1) return
        processedValue = parseFloat(sanitizedString)
      } else {
        processedValue = parseInt(sanitizedString)
      }
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
    dispatch(clearFormData(null))
    dispatch(toggleAddItemModal(null))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
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
      isOpen={table.isAddItemModalOpen}
      onClose={toggleModal}
      backdrop='blur'
      scrollBehavior='inside'
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>Agregar Registro</ModalHeader>
        <Form onSubmit={onSubmit} className='overflow-auto'>
          <ModalBody className='w-full'>
            {modalExtensionUp}
            <div className='w-full flex flex-col gap-4'>
              {table.modalInputs.map((item, index) => {
                if (item.divider) {
                  return (
                    <div className='flex flex-col gap-2'>
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

                return (
                  <div key={index} className='w-full'>
                    {item.type === 'select' && (
                      <Select
                        label={item.label}
                        placeholder={item.placeholder}
                        name={item.name}
                        isRequired={item.required}
                        selectedKeys={
                          table.formData?.[item.name] ? [String(table.formData[item.name])] : []
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
                      <I18nProvider locale='es'>
                        <DatePicker
                          label={item.label}
                          isRequired={item.required}
                          value={parseDateTime(table.formData?.[item.name])}
                          onChange={(value) => handleDateChange(item.name, value)}
                        />
                      </I18nProvider>
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
                        onChange={(e) => handleChange(e, item.type)}
                        isRequired={item.required}
                        placeholder={item.placeholder}
                        value={String(table.formData?.[item.name] || '')}
                      />
                    )}
                    {item.type == 'textarea' && (
                      <Textarea
                        size='md'
                        type='text'
                        name={item.name}
                        label={item.label}
                        onChange={handleChange}
                        placeholder={item.placeholder}
                        isRequired={item.required}
                        value={String(table.formData?.[item.name] || '')}
                      />
                    )}
                  </div>
                )
              })}
              {children}
            </div>
          </ModalBody>
          <ModalFooter className='flex gap-2 w-full'>
            <Button
              type='button'
              variant='flat'
              onPress={toggleModal}
              className='w-full'
              isLoading={isLoading}
            >
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

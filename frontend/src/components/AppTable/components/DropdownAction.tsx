import { ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { Edit, MoreVertical, Trash2 } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import {
  toggleEditItemModal,
  setCurrentItemToDelete,
  setCurrentItemToUpdate,
  toggleConfirmDeleteModal,
} from '@/features/appTableSlice'

export interface DropdownActionProps {
  itemId: number
}

export const DropdownAction = ({ itemId }: DropdownActionProps) => {
  const dispatch = useDispatch()

  const handleDelete = () => {
    dispatch(setCurrentItemToDelete(itemId))
    dispatch(toggleConfirmDeleteModal(null))
  }

  const handleUpdate = () => {
    dispatch(setCurrentItemToUpdate(itemId))
    dispatch(toggleEditItemModal(null))
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size='sm' variant='light'>
          <MoreVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Static Actions'>
        <DropdownItem key='edit' onPress={handleUpdate} startContent={<Edit size={14} />}>
          Editar
        </DropdownItem>
        <DropdownItem
          key='delete'
          className='text-danger'
          color='danger'
          onPress={handleDelete}
          startContent={<Trash2 size={14} />}
        >
          Eliminar
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export interface DropdownItemInteface {
  key: string
  title: ReactNode | string
  onPress: (itemId: number) => Promise<void> | any
  disabled?: boolean
  startContent?: ReactNode | undefined
}

export interface PersonalizeDropdownActionProps {
  itemId: number
  dropdownItems: DropdownItemInteface[]
}

export const PersonalizeDropdownAction = ({
  dropdownItems,
  itemId,
}: PersonalizeDropdownActionProps) => {
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size='sm' variant='light'>
          <MoreVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label='Dropdown menu with icons' items={dropdownItems}>
        {(item) => (
          <DropdownItem
            key={item.key}
            onPress={() => item.onPress(itemId)}
            startContent={<span>{item.startContent}</span>}
          >
            <span>{item.title}</span>
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}

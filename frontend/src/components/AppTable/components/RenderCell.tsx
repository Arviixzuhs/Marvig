import { Key } from 'react'
import { Chip } from '@heroui/react'
import { formatCurrency } from '@/utils/formatCurrency'
import { TableColumnInterface } from '@/features/appTableSlice'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { DropdownAction, DropdownItemInteface, PersonalizeDropdownAction } from './DropdownAction'

export interface RenderCellProps {
  column?: TableColumnInterface
  value: string
  itemId: number
  columnKey: Key
  dropdownItems?: DropdownItemInteface[]
}

export const RenderCell = (props: RenderCellProps) => {
  if (props.column && props.column.style) {
    switch (props.column.style) {
      case 'user':
        return (
          <div className='flex items-center gap-2 text-c-text'>
            <div className='w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white'>
              {props.value && typeof props.value === 'string'
                ? props.value.charAt(0).toUpperCase()
                : 'U'}
            </div>
            {props.value}
          </div>
        )
      case 'chip':
        if (props.column && props.column.style && props.column.chipConfig) {
          return (
            <Chip
              color='secondary'
              size='sm'
              radius='sm'
              variant='flat'
              style={{
                background: props.column.chipConfig[props.value]?.color,
                color: 'white',
              }}
            >
              {props.column.chipConfig[props.value]?.label}
            </Chip>
          )
        } else {
          return (
            <Chip color='secondary' size='sm' variant='flat'>
              {props.value}
            </Chip>
          )
        }
      case 'currency':
        return <span className='text-blue-500'>{formatCurrency(Number(props.value))}</span>
      case 'date':
        return (
          <>
            {getFormattedDateTime({
              value: props.value,
              format: {
                day: '2-digit',
                year: 'numeric',
                hour: 'numeric',
                month: '2-digit',
                minute: 'numeric',
              },
            })}
          </>
        )
    }
  }

  switch (props.columnKey) {
    case 'actions': {
      if (!props.dropdownItems) {
        return <DropdownAction itemId={props.itemId} />
      } else {
        return (
          <PersonalizeDropdownAction
            itemId={props.itemId}
            dropdownItems={props.dropdownItems || []}
          />
        )
      }
    }

    default:
      return <>{props.value}</>
  }
}

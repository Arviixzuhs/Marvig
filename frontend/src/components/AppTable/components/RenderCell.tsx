import { Key } from 'react'
import { Avatar, Chip } from '@heroui/react'
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

const NotContent = () => <span className='text-sm text-gray-500'>Sin contenido</span>

export const RenderCell = (props: RenderCellProps) => {
  if (props.column && props.column.style) {
    switch (props.column.style) {
      case 'user':
        return (
          <div className='flex items-center gap-2 text-c-text text-nowrap'>
            <Avatar
              name={props.value}
              size='sm'
              color='primary'
              showFallback
              classNames={{ base: 'shrink-0' }}
            />
            {props.value}
          </div>
        )
      case 'chip':
        if (props.column && props.column.style && props.column.chipConfig) {
          const color = props.column.chipConfig[props.value]?.color
          return (
            <Chip
              color='secondary'
              size='sm'
              radius='full'
              variant='flat'
              style={{
                background: color + '40' || '#6B7280',
                color: color,
              }}
            >
              {props.column.chipConfig[props.value]?.label || 'Sin contenido'}
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
          <div className='text-nowrap'>
            {props.value ? (
              getFormattedDateTime({
                value: props.value,
                format: {
                  ...props.column.dateFormat,
                },
              })
            ) : (
              <NotContent />
            )}
          </div>
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
      return (
        <div className='text-nowrap'>
          {String(props.value).length === 0 || !props.value ? <NotContent /> : props.value}
        </div>
      )
  }
}

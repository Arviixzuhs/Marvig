import { Key } from 'react'
import { getFormattedDateTime } from '@/utils/getFormattedDateTime'
import { DropdownAction, DropdownItemInteface, PersonalizeDropdownAction } from './DropdownAction'

export interface RenderCellProps {
  value: string
  column: Key
  itemId: number
  dropdownItems?: DropdownItemInteface[]
}

export const RenderCell = (props: RenderCellProps) => {
  switch (props.column) {
    case 'createdAt':
      return (
        <>
          {getFormattedDateTime({
            value: props.value,
            format: {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            },
          })}
        </>
      )

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

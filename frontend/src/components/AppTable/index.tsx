import React from 'react'
import { TopContent } from './components/TopContent'
import { RenderCell } from './components/RenderCell'
import { useSelector } from 'react-redux'
import { AddItemModal } from './components/AddItemModal'
import { EmptyContent } from './components/EmptyContent'
import { EditItemModal } from './components/EditItemModal'
import type { RootState } from '@/store'
import { useImageUpload } from '@/components/ImageUploader/providers/ImageUploaderProvider'
import { TablePagination } from './components/Pagination'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import { DropdownItemInteface } from './components/DropdownAction'
import type { AppTableActions } from './interfaces/appTable'
import { type TableColumnInterface } from '@/features/appTableSlice'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'

export interface AppTableProps {
  hiddeAdd?: boolean
  totalPages?: number
  tableContent: any[]
  filterByDate?: boolean
  tableActions?: AppTableActions
  dropdownItems?: DropdownItemInteface[]
  modalExtension?: React.ReactElement
  modalExtensionUp?: React.ReactElement
  hiddeTopContent?: boolean
  topContentExtension?: React.ReactElement
  searchbarPlaceholder?: string
}

export const AppTable = ({
  hiddeAdd,
  totalPages,
  tableContent = [],
  tableActions,
  filterByDate,
  dropdownItems,
  modalExtension,
  modalExtensionUp,
  hiddeTopContent = false,
  topContentExtension,
  searchbarPlaceholder,
}: AppTableProps) => {
  const table = useSelector((state: RootState) => state.appTable)
  const { resetFormData, setImages } = useImageUpload()

  React.useEffect(() => {
    if (table.currentItemToUpdate === -1 && table.isAddItemModalOpen) {
      resetFormData()
      return
    }

    const itemToUpdate = tableContent.find((item) => item.id === table.currentItemToUpdate)

    if (itemToUpdate?.images) {
      setImages(
        itemToUpdate.images.map((img: { id: number; url: string }) => ({
          id: String(img.id),
          imageURL: img.url,
        })),
      )
    }
  }, [table.currentItemToUpdate, tableContent, table.isAddItemModalOpen])

  return (
    <>
      <Table
        shadow='none'
        isCompact
        isHeaderSticky
        topContent={
          <>
            {!hiddeTopContent && (
              <TopContent
                hiddeAdd={hiddeAdd}
                filterByDate={filterByDate}
                topContentExtension={topContentExtension}
                searchbarPlaceholder={searchbarPlaceholder}
              />
            )}
          </>
        }
        bottomContent={<TablePagination totalPages={totalPages} />}
        bottomContentPlacement='outside'
        topContentPlacement='outside'
        classNames={{
          base: 'grow overflow-auto overflow-hidden gap-0 h-full',
          tbody: 'h-full',
          table: [`${tableContent.length === 0 && 'h-full'}`],
          wrapper:
            'grow overflow-auto hoverScrollbar rounded-none rounded-t-2xl rounded-2xl rounded-b-none h-full',
          emptyWrapper: 'h-full',
        }}
      >
        <TableHeader columns={table.columns}>
          {(column: TableColumnInterface) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={!!column.sortable}
            >
              <>{column.name}</>
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tableContent} emptyContent={<EmptyContent />}>
          {(item) => (
            <TableRow key={String(item.id)}>
              {(columnKey) => (
                <TableCell className='default-text-color'>
                  <RenderCell
                    column={table.columns.find((col) => col.uid === columnKey)}
                    columnKey={columnKey}
                    value={item[columnKey]}
                    itemId={item.id}
                    dropdownItems={dropdownItems}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {tableActions?.create && (
        <AddItemModal action={tableActions.create} modalExtensionUp={modalExtensionUp}>
          {modalExtension}
        </AddItemModal>
      )}

      {tableActions?.update && (
        <EditItemModal action={tableActions.update} tableContent={tableContent}>
          {modalExtension}
        </EditItemModal>
      )}

      {tableActions?.delete && <ConfirmDeleteModal handleDelete={tableActions.delete} />}
    </>
  )
}

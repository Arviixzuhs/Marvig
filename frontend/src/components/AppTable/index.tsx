import React from 'react'
import type { RootState } from '@/store'
import { TopContent } from './components/TopContent'
import { RenderCell } from './components/RenderCell'
import { useLocation } from 'react-router-dom'
import { AddItemModal } from './components/AddItemModal'
import { EmptyContent } from './components/EmptyContent'
import { EditItemModal } from './components/EditItemModal'
import { TablePagination } from './components/Pagination'
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal'
import { DropdownItemInteface } from './components/DropdownAction'
import type { AppTableActions } from './interfaces/appTable'
import { useDispatch, useSelector } from 'react-redux'
import { setFilterValue, setTableData, type TableColumnInterface } from '@/features/appTableSlice'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react'

export interface AppTableProps {
  hiddeAdd?: boolean
  filterByDate?: boolean
  tableActions?: AppTableActions
  dropdownItems?: DropdownItemInteface[]
  modalExtension?: React.ReactElement
  hiddeTopContent?: boolean
  topContentExtension?: React.ReactElement
  searchbarPlaceholder?: string
}

export const AppTable = ({
  hiddeAdd,
  tableActions,
  filterByDate,
  dropdownItems,
  modalExtension,
  hiddeTopContent = false,
  topContentExtension,
  searchbarPlaceholder,
}: AppTableProps) => {
  const location = useLocation()
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)

  React.useEffect(() => {
    dispatch(
      setTableData({
        content: [],
        totalPages: 0,
        currentPage: 0,
        rowsPerPage: 10,
      }),
    )
    dispatch(setFilterValue(''))
  }, [location])

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
        bottomContent={<TablePagination />}
        topContentPlacement='outside'
        classNames={{
          base: 'h-full',
          tbody: 'h-full',
          table: [`${table.data.length === 0 && 'h-full'}`],
          wrapper: 'h-full',
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
        <TableBody items={table.data} emptyContent={<EmptyContent />}>
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
      <AddItemModal action={() => tableActions?.create?.()}>{modalExtension}</AddItemModal>
      <EditItemModal action={() => tableActions?.update?.()}>{modalExtension}</EditItemModal>
      <ConfirmDeleteModal handleDelete={() => tableActions?.delete?.()} />
    </>
  )
}

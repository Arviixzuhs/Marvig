import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type TableColumnStyle = 'date' | 'currency' | 'chip' | 'user'

export interface IChipConfig {
  label: string
  color: string
}

interface BaseColumn {
  uid: string
  name: string
  sortable?: boolean
}

interface ChipColumn extends BaseColumn {
  style: 'chip'
  chipConfig: {
    [key: string]: IChipConfig
  }
}

interface OtherColumn extends BaseColumn {
  style?: Exclude<TableColumnStyle, 'chip'>
  chipConfig?: never
}

export type TableColumnInterface = ChipColumn | OtherColumn

export enum DateFilterPeriod {
  TODAY = 'TODAY',
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  LAST_MONTH = 'LAST_MONTH',
}

export interface DateFilter {
  end: string
  start: string
}

export type InputType =
  | 'text'
  | 'number'
  | 'email'
  | 'password'
  | 'date'
  | 'select'
  | 'float'
  | 'textarea'

export interface SelectOption {
  label: string
  value: string | number
}

export interface IDivider {
  title?: string
}

export interface IDivider {
  title?: string
}

interface SharedProps {
  showOnEdit?: boolean
}

interface StandardFields {
  name: string
  label: string
  type?: InputType
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
}

export type ModalInput = SharedProps &
  (
    | (StandardFields & { divider?: never })
    | ({ divider: IDivider } & { [K in keyof StandardFields]?: never })
  )

export interface AppTableInterface {
  columns: TableColumnInterface[]
  formData: Record<string, string | unknown>
  dateFilter: DateFilter
  filterValue: string
  currentPage: number
  rowsPerPage: number
  dateFilterPeriod: DateFilterPeriod | null
  modalInputs: ModalInput[]
  isAddItemModalOpen: boolean
  isEditItemModalOpen: boolean
  currentItemToUpdate: number
  currentItemToDelete: number
  isConfirmDeleteModalOpen: boolean
}

export const manageAppTableSlice = createSlice({
  name: 'appTable',
  initialState: {
    columns: [],
    formData: {},
    filterValue: '',
    currentPage: 0,
    rowsPerPage: 10,
    modalInputs: [],
    isAddItemModalOpen: false,
    isEditItemModalOpen: false,
    currentItemToDelete: -1,
    currentItemToUpdate: -1,
    dateFilterPeriod: null,
    isConfirmDeleteModalOpen: false,
    dateFilter: {
      end: '',
      start: '',
    },
  } as AppTableInterface,
  reducers: {
    setTableData: (
      state,
      action: PayloadAction<{
        currentPage: number
        rowsPerPage: number
      }>,
    ) => {
      const { currentPage, rowsPerPage } = action.payload
      state.currentPage = currentPage
      state.rowsPerPage = rowsPerPage
    },
    setTableColumns: (state, action: PayloadAction<TableColumnInterface[]>) => {
      state.columns = action.payload
    },
    setFilterValue: (state, action: PayloadAction<string>) => {
      state.filterValue = action.payload
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload
    },
    setModalInputs: (state, action: PayloadAction<ModalInput[]>) => {
      state.modalInputs = action.payload
    },
    setFormData: (state, action: PayloadAction<{ name: string; value: string | unknown }>) => {
      const { name, value } = action.payload
      if (state.formData) {
        state.formData[name] = value
      }
    },
    clearFormData: (state, _action) => {
      state.formData = {}
    },
    toggleConfirmDeleteModal: (state, _action) => {
      state.isConfirmDeleteModalOpen = !state.isConfirmDeleteModalOpen
    },
    toggleAddItemModal: (state, _action) => {
      state.isAddItemModalOpen = !state.isAddItemModalOpen
    },
    toggleEditItemModal: (state, _action) => {
      state.isEditItemModalOpen = !state.isEditItemModalOpen
    },
    setCurrentItemToDelete: (state, action) => {
      state.currentItemToDelete = action.payload
    },
    setCurrentItemToUpdate: (state, action) => {
      state.currentItemToUpdate = action.payload
    },
    setDateFilter: (state, action) => {
      const { start, end } = action.payload
      state.dateFilter.end = end?.toString() || ''
      state.dateFilter.start = start?.toString() || ''
    },
    setDateFilterPeriod: (state, action: PayloadAction<{ period: DateFilterPeriod | null }>) => {
      const { period } = action.payload
      state.dateFilterPeriod = period
    },
  },
})

export const {
  setTableData,
  setTableColumns,
  setFilterValue,
  setDateFilter,
  setCurrentPage,
  toggleEditItemModal,
  setModalInputs,
  toggleAddItemModal,
  setRowsPerPage,
  setFormData,
  clearFormData,
  setDateFilterPeriod,
  toggleConfirmDeleteModal,
  setCurrentItemToUpdate,
  setCurrentItemToDelete,
} = manageAppTableSlice.actions

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TableColumnInterface {
  uid: string
  name: string
  sortable?: boolean
}

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

export interface ModalInput {
  name: string
  type?: string
  label?: string
  required?: boolean
  placeholder?: string
}

export interface AppTableInterface<T> {
  data: T[]
  columns: TableColumnInterface[]
  formData: Record<string, string | unknown>
  dateFilter: DateFilter
  filterValue: string
  totalPages: number
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
    data: [],
    columns: [],
    formData: {},
    filterValue: '',
    totalPages: 0,
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
  } as AppTableInterface<any>,
  reducers: {
    setTableData: (
      state,
      action: PayloadAction<{
        totalPages: number
        currentPage: number
        rowsPerPage: number
        content: unknown[]
      }>,
    ) => {
      const { totalPages, currentPage, rowsPerPage, content } = action.payload
      state.currentPage = currentPage
      state.totalPages = totalPages
      state.rowsPerPage = rowsPerPage
      state.data = content
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
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload
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
    addItem: (state, action) => {
      state.data.unshift(action.payload)
    },
    deleteItem: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter((item) => item.id !== action.payload)
    },
    updateItem: (state, action: PayloadAction<{ id: number; newData: object }>) => {
      const { id, newData } = action.payload
      const item = state.data.find((item) => item.id === id)
      if (!item) return

      const updatedItem = Object.assign(item, newData)
      state.data[state.data.indexOf(item)] = updatedItem
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
  setTotalPages,
  toggleAddItemModal,
  setRowsPerPage,
  setFormData,
  clearFormData,
  addItem,
  deleteItem,
  setDateFilterPeriod,
  updateItem,
  toggleConfirmDeleteModal,
  setCurrentItemToUpdate,
  setCurrentItemToDelete,
} = manageAppTableSlice.actions

import { Search } from 'lucide-react'
import { RootState } from '@/store'
import { setFormData } from '@/features/appTableSlice'
import { Key, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Autocomplete as AutocompleteHeroUI, AutocompleteItem, Chip } from '@heroui/react'

export interface AutocompleteProps<T extends { id: number; name: string }> {
  label?: string
  chips?: boolean
  fetchItems: (search: string) => Promise<T[]>
  formDataKey: string
  placeholder?: string
}

export interface AutocompleteChip {
  id: number
  label: string
}

export const Autocomplete = <T extends { id: number; name: string }>({
  label,
  chips = false,
  fetchItems,
  formDataKey,
  placeholder,
}: AutocompleteProps<T>) => {
  const dispatch = useDispatch()
  const table = useSelector((state: RootState) => state.appTable)
  const currentItemToEdit = table.data.find((item) => item.id === table.currentItemToUpdate)

  const [result, setResult] = useState<T[]>([])
  const [searchValue, setSearchValue] = useState<string>('')

  useEffect(() => {
    if (!currentItemToEdit) return

    const existingValues = table.formData?.[formDataKey] as AutocompleteChip[]

    if (!existingValues || existingValues.length === 0) {
      const initialValues = currentItemToEdit[formDataKey]?.map((i: T) => ({
        id: i.id,
        label: i.name,
      }))
      if (initialValues) {
        dispatch(
          setFormData({
            name: formDataKey,
            value: initialValues,
          }),
        )
      }
    }
  }, [currentItemToEdit])

  const items = (table.formData?.[formDataKey] as AutocompleteChip[]) || []

  useEffect(() => {
    fetchItems(searchValue)
      .then((res) => setResult(res))
      .catch(console.error)
  }, [searchValue, fetchItems])

  const handleRemove = (itemToRemove: AutocompleteChip) => {
    dispatch(
      setFormData({
        name: formDataKey,
        value: items.filter((item) => item.id !== itemToRemove.id),
      }),
    )
  }

  const handleAdd = (key: Key | null) => {
    if (!key) return
    const itemToAdd = result.find((item) => item.id === Number(key))
    if (!itemToAdd) return
    if (!items.find((c) => c.id === itemToAdd.id)) {
      dispatch(
        setFormData({
          name: formDataKey,
          value: [...items, { id: itemToAdd.id, label: itemToAdd.name }],
        }),
      )
    }
  }

  const availableItems = result.filter((item) => !items.some((c) => c.id === item.id))

  return (
    <div className='flex w-full flex-col gap-2'>
      <div className='flex w-full flex-wrap md:flex-nowrap gap-4'>
        <AutocompleteHeroUI<T>
          label={label}
          listboxProps={{
            emptyContent: 'Sin resultados.',
          }}
          labelPlacement='outside'
          startContent={<Search />}
          placeholder={placeholder}
          defaultItems={availableItems}
          onInputChange={setSearchValue}
          onSelectionChange={handleAdd}
        >
          {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
        </AutocompleteHeroUI>
      </div>
      {chips && (
        <div className='flex gap-2 pt-2'>
          {items.map((item) => (
            <Chip key={item.id} color='primary' variant='flat' onClose={() => handleRemove(item)}>
              {item.label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}
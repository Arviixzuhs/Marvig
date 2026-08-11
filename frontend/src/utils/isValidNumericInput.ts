export type InputType = 'number' | 'float' | string

export const isValidNumericInput = (value: string, type?: InputType): boolean => {
  if (!type || (type !== 'number' && type !== 'float')) return true
  if (value === '') return true

  if (type === 'number') {
    return /^\d+$/.test(value)
  }

  if (type === 'float') {
    return /^\d*\.?\d*$/.test(value) && value !== '.'
  }

  return true
}

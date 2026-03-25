import { inputStyles } from '@/styles'
import { Input, ScrollShadow } from '@heroui/react'

import React from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

interface AuthFormField {
  label: string
  name: string
  placeholder: string
  type: string
  value?: string
  isDisabled?: boolean
}

interface AuthFormItemProps {
  item: AuthFormField
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const AuthFormItem = ({ item, handleChange, error }: AuthFormItemProps) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  return (
    <Input
      labelPlacement='outside'
      placeholder={item.placeholder}
      label={item.label}
      radius='sm'
      type={item.type == 'password' ? (isVisible ? 'text' : 'password') : ''}
      name={item.name}
      value={item.value}
      onChange={handleChange}
      isInvalid={!!error}
      errorMessage={error}
      classNames={inputStyles}
      isDisabled={item.isDisabled}
      endContent={
        item.type == 'password' && (
          <span className='focus:outline-none cursor-pointer' onClick={toggleVisibility}>
            {isVisible ? (
              <BsEye className='text-2xl text-default-400 pointer-events-none' />
            ) : (
              <BsEyeSlash className='text-2xl text-default-400 pointer-events-none' />
            )}
          </span>
        )
      }
    />
  )
}

interface AuthFormProps {
  inputs: AuthFormField[]
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  errors: { [key: string]: string }
}

export const AuthForm = ({ inputs, handleChange, errors }: AuthFormProps) => {
  return (
    <ScrollShadow className='w-full grow flex flex-col gap-3 overflow-auto hoverScrollbar pr-2'>
      {inputs.map((item, index) => (
        <AuthFormItem
          item={item}
          key={index}
          handleChange={handleChange}
          error={errors[item.name]}
        />
      ))}
    </ScrollShadow>
  )
}

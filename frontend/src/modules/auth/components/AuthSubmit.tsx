import { Button } from '@heroui/react'

interface AuthSubmitProps {
  label: string
  disabled?: boolean
  timeLeft?: string
}

export const AuthSubmit = ({ label, disabled = false, timeLeft }: AuthSubmitProps) => {
  return (
    <Button
      type='submit'
      color='primary'
      radius='sm'
      className='h-[44px] mt-2 font-bold w-full min-h-[44px]'
      isDisabled={disabled}
    >
      {disabled && timeLeft ? timeLeft : label}
    </Button>
  )
}

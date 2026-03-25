import { Checkbox } from '@heroui/react'
import { Link } from 'react-router-dom'

export const AuthLoginOptions = () => {
  return (
    <div className='flex items-center justify-between w-full gap-3 my-4'>
      <div className='relative flex items-center text-sm text-c-title'>
        <Checkbox defaultSelected radius='sm' size='sm'>
          Mantenerme conectado
        </Checkbox>
      </div>
      <Link to='/recovery-password/email' className='text-sm text-blue-500'>
        ¿Olvidaste tu contraseña?
      </Link>
    </div>
  )
}

import { TelescopeIcon } from 'lucide-react'

interface EmptyContentProps {
  title?: string
  description?: string
}

export const EmptyContent = ({
  title = 'Sin registros',
  description = 'Los registros guardados se verán aquí',
}: EmptyContentProps) => {
  return (
    <div className='w-full flex justify-center flex-col items-center h-full select-none'>
      <TelescopeIcon className='w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-gray-400' />
      <p className='default-text-color text-sm sm:text-base '>{title}</p>
      <p className='text-gray-400 text-xs sm:text-sm '>{description}</p>
    </div>
  )
}

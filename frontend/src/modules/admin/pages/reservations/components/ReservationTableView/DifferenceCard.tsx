import { LucideIcon } from 'lucide-react'

interface IDifferenceCardProps {
  icon: LucideIcon
  title: string
  description: string
  bgColor: string
  borderColor: string
  textColor: string
}

export const DifferenceCard = ({
  icon: Icon,
  title,
  description,
  bgColor,
  borderColor,
  textColor,
}: IDifferenceCardProps) => (
  <div className={`flex gap-3 p-4 rounded-lg border ${bgColor} ${borderColor} ${textColor}`}>
    <div className='mt-0.5'>
      <Icon className='w-5 h-5' />
    </div>
    <div className='flex flex-col gap-1 w-full'>
      <h4 className='font-semibold text-sm'>{title}</h4>
      <p className='text-sm'>{description}</p>
    </div>
  </div>
)

import { useNavigate } from 'react-router-dom'

interface AuthFooter {
  href: string
  label: string
  hrefLabel: string
}

export const AuthFooter = ({ href, label, hrefLabel }: AuthFooter) => {
  const navigate = useNavigate()
  return (
    <div className='flex items-center gap-2 justify-center w-full mb-4 mt-4 text-c-title'>
      <p className='font-[400] text-[14px]'>{label}</p>
      <button className='text-blue-500 font-[500] text-[14px] cursor-pointer' onClick={() => navigate(href)}>
        {hrefLabel}
      </button>
    </div>
  )
}

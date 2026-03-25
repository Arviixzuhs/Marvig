interface AuthHeader {
  title: string
  description?: string | React.ReactNode
}

export const AuthHeader = ({ title, description }: AuthHeader) => {
  return (
    <div className='flex flex-col gap-5'>
      <h3 className='sessiontitle 2xl:text-3xl text-2xl font-medium mb-[10px] text-center text-c-text'>
        {title}
      </h3>
      <p className='text-[#7f8a97] text-center'>{description}</p>
    </div>
  )
}

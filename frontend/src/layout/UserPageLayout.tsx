import React from 'react'

interface UserPageLayoutProps {
  children: React.ReactNode
}

export const UserPageLayout = ({ children }: UserPageLayoutProps) => {
  return (
    <div className='w-full flex-grow bg-background text-foreground flex justify-center'>
      <div className='w-full h-full max-w-6xl px-3 py-4 md:px-6 md:py-6'>{children}</div>
    </div>
  )
}

import React from 'react'

interface UserPageLayoutProps {
  children: React.ReactNode
}

export const UserPageLayout = ({ children }: UserPageLayoutProps) => {
  return (
    <div className='w-full bg-background text-foreground flex justify-center'>
      <div className='w-full max-w-7xl px-6 py-6'>{children}</div>
    </div>
  )
}

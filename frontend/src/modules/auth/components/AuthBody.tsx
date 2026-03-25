import nachoBeach from '@/assets/images/nacho_beach.jpg'
import React from 'react'

interface AuthBodyProps {
  children: React.ReactNode
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> | void
}

export const AuthBody = ({ children, onSubmit }: AuthBodyProps) => {
  return (
    <div className='container flex mx-auto flex-col h-screen'>
      <div className='w-full flex justify-start p-8 pb-0'></div>
      <div className='lg:flex h-full justify-center w-full 2xl:gap-[152px] overflow-hidden xl:p-8 grow flex items-center'>
        <div className='max-h-[500px] 2xl:max-h-[520px] lg:flex h-full justify-center w-full gap-[100px] 2xl:gap-[152px] overflow-hidden flex items-center'>
          <form
            onSubmit={onSubmit}
            className='w-[434px] mx-auto lg:mx-0 flex items-center flex-col grow overflow-auto h-full max-w-[400px] p-2 justify-center'
          >
            {children}
          </form>
          <div
            className='w-[400px] 2xl:w-[450px] h-full max-h-[700px] 2xl:max-h-[700px] gap-8 rounded-[38px] items-center overflow-hidden relative hidden lg:flex flex-col justify-between'
            style={{
              backgroundImage: `url(${nachoBeach})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import { Footer } from '@/components/Footer/Footer'
import { UserNavbar } from '@/components/UserNavbar'
import { Outlet, useLocation } from 'react-router-dom'
import { ReactLenis, type LenisRef } from 'lenis/react'

export const UserLayout = () => {
  const { pathname } = useLocation()
  const lenisRef = React.useRef<LenisRef>(null)

  React.useEffect(() => {
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  React.useEffect(() => {
    document.body.classList.value = ''
  }, [])

  return (
    <ReactLenis ref={lenisRef} root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      <div className='flex flex-col min-h-screen bg-background text-foreground'>
        <UserNavbar />
        <main className='flex-grow w-full'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  )
}

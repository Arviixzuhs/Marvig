import { Toaster } from 'react-hot-toast'

export const NotificationToast = () => {
  return (
    <Toaster
      toastOptions={{
        style: {
          backgroundColor: 'var(--card)',
          color: 'var(--text-default)',
          pointerEvents: 'none',
        },
        position: 'top-center',
        success: {
          iconTheme: {
            primary: 'rgb(73, 158, 73)',
            secondary: 'white',
          },
        },
      }}
    />
  )
}

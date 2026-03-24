import { Toaster } from 'react-hot-toast'

export const NotificationToast = () => {
  return (
    <Toaster
      toastOptions={{
        className: '',
        position: 'bottom-right',
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

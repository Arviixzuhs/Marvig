import React from 'react'
import { Button } from '@heroui/react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  React.useEffect(() => {
    const saved = (localStorage.getItem('theme') ?? 'light') as 'light' | 'dark'

    setTheme(saved)

    if (saved === 'dark') {
      document.body.classList.add('dark')
    }
  }, [])

  const changeTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'

    if (!document.startViewTransition) {
      document.body.classList.toggle('dark', nextTheme === 'dark')
      setTheme(nextTheme)
      localStorage.setItem('theme', nextTheme)
      return
    }

    document.startViewTransition(() => {
      document.body.classList.toggle('dark', nextTheme === 'dark')
      setTheme(nextTheme)
      localStorage.setItem('theme', nextTheme)
    })
  }

  return (
    <Button onPress={changeTheme} isIconOnly variant='light' radius='full'>
      {theme === 'light' ? (
        <Moon size={20} className='w-5 h-5 text-default-500' />
      ) : (
        <Sun size={20} className='w-5 h-5 text-default-500' />
      )}
    </Button>
  )
}

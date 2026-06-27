import React from 'react'
import { Button } from '@heroui/react'
import { Sun, Moon } from 'lucide-react'

// Temas principales para el toggle
const THEME_ONE = 'light'
const THEME_TWO = 'dark'

const THEME_KAWAII = 'kawaii'

const ALL_THEMES = [THEME_ONE, THEME_TWO, THEME_KAWAII] as const

type Theme = typeof THEME_ONE | typeof THEME_TWO

export function ThemeToggle() {
  const [theme, setTheme] = React.useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || THEME_ONE
    }
    return THEME_ONE
  })

  React.useEffect(() => {
    const currentClasses = Array.from(document.body.classList)

    const themesToRemove = currentClasses.filter((className) =>
      (ALL_THEMES as readonly string[]).includes(className),
    )

    if (themesToRemove.length > 0) {
      document.body.classList.remove(...themesToRemove)
    }

    document.body.classList.add(theme)

    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === THEME_ONE ? THEME_TWO : THEME_ONE

    if (!document.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    document.startViewTransition(() => {
      setTheme(nextTheme)
    })
  }

  return (
    <Button onPress={toggleTheme} isIconOnly variant='light' radius='full'>
      {theme === THEME_ONE ? (
        <Moon size={20} className='w-5 h-5 text-default-500' />
      ) : (
        <Sun size={20} className='w-5 h-5 text-default-500' />
      )}
    </Button>
  )
}

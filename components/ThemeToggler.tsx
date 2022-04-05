import { useTheme } from 'next-themes'
import { SunIcon } from '@radix-ui/react-icons'
import { IconButton } from './IconButton'
import { useCallback } from 'react'
import type { Theme } from 'types/theme'

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = useCallback(
    () => setTheme(theme === 'light' ? 'dark' : 'light'),
    [theme]
  )

  return (
    <IconButton onClick={toggleTheme}>
      <SunIcon />
    </IconButton>
  )
}

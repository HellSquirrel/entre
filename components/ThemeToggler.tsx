import { useTheme } from 'next-themes'
import { SunIcon } from '@radix-ui/react-icons'
import { IconButton } from './IconButton'
import { useCallback } from 'react'
import type { Theme } from 'types/theme'

export const ThemeToggler = () => {
  const { setTheme } = useTheme()

  const toggleTheme = useCallback(
    () => setTheme((theme: Theme) => (theme === 'light' ? 'dark' : 'light')),
    []
  )

  return (
    <IconButton onClick={toggleTheme}>
      <SunIcon />
    </IconButton>
  )
}

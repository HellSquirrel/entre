import React, { FC } from 'react'
import { useRouter } from 'next/router'
import { styled } from '@styles'
import { Link } from './Link'

type Props = {
  className?: string
}

const StyledLink = styled('button', {
  border: 'none',
  background: 'none',
  fontSize: '$main',
  outline: 'none',
  transition: 'opacity 300ms',
  color: '$white !important',
  fontWeight: 'normal',

  '&:hover': {
    opacity: 0.8,
  },
})

export const LangSwitcher: FC<Props> = ({ className }) => {
  const router = useRouter()
  const { locale, pathname } = router
  const nextLocale = locale === 'en' ? 'ru' : 'en'

  return (
    <StyledLink
      onClick={() => router.push(pathname, pathname, { locale: nextLocale })}
      className={className}>
      {nextLocale}
    </StyledLink>
  )
  return null
}

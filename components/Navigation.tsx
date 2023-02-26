import React from 'react'
import { ThemeToggler } from './ThemeToggler'
import { styled } from '@styles'
import { Back } from './Back'
import { useRouter } from 'next/router'
import { LangSwitcher } from './LangSwitcher'

const Nav = styled('nav', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '$1 $1',
  alignSelf: 'flex-end',
  alignItem: 'center',
  width: '100%',
})

const StyledToolbar = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '0 0 auto',
})

export const Navigation = () => {
  const router = useRouter()
  const isBlogOrRoot = router.route === '/blog' || router.route === '/'
  return (
    <Nav>
      {isBlogOrRoot ? <div /> : <Back />}
      <StyledToolbar>
        <LangSwitcher />
        <ThemeToggler />
      </StyledToolbar>
    </Nav>
  )
}

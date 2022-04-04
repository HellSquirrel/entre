import React from 'react'
import { ThemeToggler } from './ThemeToggler'
import { styled } from '@styles'
import { Back } from './Back'
import { useRouter } from 'next/router'

const Nav = styled('nav', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '$1 $1',
  alignSelf: 'flex-end',
  alignItem: 'center',
  width: '100%',
})

export const Navigation = () => {
  const router = useRouter()
  const isPost = router.route === '/blog/[slug]'
  return (
    <Nav>
      {isPost ? <Back /> : <div />}
      <ThemeToggler />
    </Nav>
  )
}

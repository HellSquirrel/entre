import React from 'react'
import { ThemeToggler } from './ThemeToggler'
import { styled } from '@styles'

const Nav = styled('nav', {
  maxWidth: '$max',
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '$1 $1',
})

export const Navigation = () => (
  <Nav>
    <ThemeToggler />
  </Nav>
)

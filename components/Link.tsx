import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import { styled } from '@styles'

const StyledLink = styled('a', {
  color: '$violet12',
  textDecoration: 'underline',
  transition: 'color 150ms',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',

  '&:hover': {
    color: '$plum12',
  },

  [`html[data-theme='light']`]: {
    '&': {
      color: '$violet8',
      '&:hover': {
        color: '$plum7',
      },
    },
  },
})

// @ts-ignore
export const Link = ({ children, href, ...rest }: LinkProps) => (
  <NextLink href={href}>
    <StyledLink {...rest}>{children}</StyledLink>
  </NextLink>
)

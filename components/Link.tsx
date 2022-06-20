import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import { styled } from '@styles'

const StyledLink = styled('a', {
  color: '$violet11',
  textDecoration: 'underline',
  transition: 'color 150ms',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  textDecorationThickness: '$sizes$unit',
  textUnderlineOffset: '$sizes$small',
  textDecorationColor: 'rgba(0, 0, 0, 0)',

  '&:hover': {
    color: '$violet12',
    textDecorationColor: 'inherit',
  },

  [`html[data-theme='light'] &`]: {
    color: '$violet8',
    '&:hover': {
      color: '$violet10',
    },
  },
})

// @ts-ignore
export const Link = ({ children, href, ...rest }: LinkProps) => (
  <NextLink href={href} passHref>
    <StyledLink {...rest}>{children}</StyledLink>
  </NextLink>
)

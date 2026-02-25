import React, { FC } from 'react'
import { styled } from '@styles'

type Props = {
  title: string
  children: React.ReactNode
  withBackground?: boolean
}

const StyledDetails = styled('details', {
  padding: '$3 0',

  variants: {
    withBackground: {
      true: {
        backgroundColor: '$violet4',
        padding: '$3',
        borderRadius: '6px',

        [`html[data-theme='dark'] &`]: {
          backgroundColor: 'hsl(255, 30%, 20%)',
        },
      },
    },
  },
})

export const Details = ({ children, title, withBackground }: Props) => (
  <StyledDetails withBackground={withBackground}>
    <summary>{title}</summary>
    {children}
  </StyledDetails>
)

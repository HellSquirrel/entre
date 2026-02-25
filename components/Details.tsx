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
        backgroundColor: '$indigo3',
        borderLeft: '3px solid $indigo8',
        padding: '$3',
        borderRadius: '0 6px 6px 0',

        [`html[data-theme='light'] &`]: {
          backgroundColor: '$violet12',
          borderLeftColor: '$violet8',
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

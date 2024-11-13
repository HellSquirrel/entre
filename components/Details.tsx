import React, { FC } from 'react'
import { styled } from '@styles'

type Props = {
  title: string
  children: React.ReactNode
}

const StyledDetails = styled('details', {
  padding: '$3 0',
})

export const Details = ({ children, title } : Props) => (
  <StyledDetails>
    <summary>{title}</summary>
    {children}
  </StyledDetails>
)

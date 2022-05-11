import React, { FC } from 'react'
import { styled } from '@styles'

type Props = {
  title: string
}

const StyledDetails = styled('details', {
  padding: '$3 0',
})

export const Details: FC<Props> = ({ children, title }) => (
  <StyledDetails>
    <summary>{title}</summary>
    {children}
  </StyledDetails>
)

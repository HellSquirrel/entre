import { styled } from '@styles'
import { FC } from 'react'

const Button = styled('button', {
  alignItems: 'center',
  appearance: 'none',
  display: 'inline-flex',
  flexShrink: 0,
  fontFamily: 'inherit',
  fontSize: '14px',
  justifyContent: 'center',
  lineHeight: '1',
  outline: 'none',
  padding: '$2',
  textDecoration: 'none',
  userSelect: 'none',
  border: 'none',
  background: 'none',

  '&:hover': {
    color: '$violet4',
  },
})

type Props = {
  onClick: () => void
}

export const IconButton: FC<Props> = ({ children, onClick }) => (
  <Button onClick={onClick}>{children}</Button>
)

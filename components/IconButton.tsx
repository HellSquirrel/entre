import { styled } from '@styles'
import { FC } from 'react'
import { Link } from './Link'

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
  transition: 'opacity 300ms',

  ['& svg']: {
    width: '$icon',
    height: '$icon',
  },

  '&:hover': {
    opacity: 0.8,
  },
})

type Props = {
  onClick?: () => void
  href?: string
  className?: string
}

export const IconButton: FC<Props> = ({ children, onClick, href, className }) =>
  onClick ? (
    <Button onClick={onClick} className={className}>
      {children}
    </Button>
  ) : (
    // @ts-ignore
    <Button href={href} as={Link} className={className}>
      {children}
    </Button>
  )

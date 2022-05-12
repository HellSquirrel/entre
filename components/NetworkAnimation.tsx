import { FC } from 'react'
import NetworkSvg from './assets/network.svg'
import { styled, keyframes } from '@styles'

type Props = {
  className?: string
}

const appear = keyframes({
  '0%': {
    opacity: 1,
  },
  '25%': {
    opacity: 0,
  },
  '50%': {
    opacity: 0,
  },
  '75%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

const appear1 = keyframes({
  '0%': {
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
})

const NetworkStyled = styled(NetworkSvg, {
  '& g': {
    opacity: 1,
  },

  '& g:nth-child(1)': {
    animation: `${appear} 4s infinite steps(1, start)`,
    animationDelay: '3s',
  },

  '& g:nth-child(2)': {
    animation: `${appear} 4s infinite steps(1, start)`,
    animationDelay: '2s',
  },

  '& g:nth-child(3)': {
    animation: `${appear} 4s infinite steps(1, start)`,
    animationDelay: '1s',
  },

  '& g:nth-child(4)': {
    animation: `${appear} 4s infinite steps(1, start)`,
  },
})

export const NetworkAnimation: FC<Props> = ({ className }) => (
  <NetworkStyled className={className} />
)

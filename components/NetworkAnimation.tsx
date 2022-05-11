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
  '50%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

const NetworkStyled = styled(NetworkSvg, {
  '& g': {
    opacity: 1,
  },

  '& g:nth-child(1)': {
    animation: `${appear} 5s infinite steps(1)`,
    animationDelay: '4s',
  },

  '& g:nth-child(2)': {
    animation: `${appear} 5s infinite steps(1)`,
    animationDelay: '3s',
  },

  '& g:nth-child(3)': {
    animation: `${appear} 5s infinite steps(1)`,
    animationDelay: '2s',
  },

  '& g:nth-child(4)': {
    animation: `${appear} 5s infinite steps(1)`,
    animationDelay: '1s',
  },
})

export const NetworkAnimation: FC<Props> = ({ className }) => (
  <NetworkStyled className={className} />
)

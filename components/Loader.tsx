import React from 'react'
import { styled, keyframes } from '@styles'

const animation = keyframes({
  '0%': {
    backgroundPosition: '10% 0%',
  },
  '50%': {
    backgroundPosition: '91% 100%',
  },
  '100%': {
    backgroundPosition: '10% 0%',
  },
})

const LoaderText = styled('div', {
  fontSize: '$medium',
  background: '-webkit-linear-gradient(180deg, $orange10, $orange12)',
  '-webkit-background-clip': 'text',
  '-webkit-text-fill-color': 'transparent',
  backgroundSize: '200% 200%',
  animation: `${animation} 4s infinite`,
  marginBottom: '$2',
})

export const Loader = () => (
  <LoaderText>
    Модельки иногда бывают тяжелыми :) Подождите немного, пока они загрузятся...
  </LoaderText>
)

import { styled } from '@styles'

export const Predictions = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridRowGap: '$3',

  '@bp1': {
    gridTemplateColumns: '1fr 1fr',
  },
})

export const PredictedClass = styled('span', {
  color: '$colors$orange10',
})

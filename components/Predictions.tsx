import { styled } from '@styles'
import React, { FC } from 'react'
import { Loader } from './Loader'

export const StyledPredictions = styled('div', {
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

type Props = {
  children: React.ReactNode
  loading?: boolean
}

export const Predictions: FC<Props> = ({ loading, children }) => {
  return (
    <>
      {loading && <Loader />}
      <StyledPredictions>{children}</StyledPredictions>
    </>
  )
}

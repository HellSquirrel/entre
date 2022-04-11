import React, { FC } from 'react'
import { styled } from '@styles'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

const Main = styled('main', {
  flex: '1 0 auto',
  padding: '$3',
  maxWidth: '$max',
  width: '100%',
})

export const Layout: FC = ({ children }) => {
  return (
    <>
      <Navigation />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}

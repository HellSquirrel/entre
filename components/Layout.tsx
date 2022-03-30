import React, { FC } from 'react'
import Head from 'next/head'
import { styled, globalCss } from '@styles'
import { Navigation } from './Navigation'
import { Footer } from './Footer'

const Main = styled('main', {
  flex: '1 0 auto',
  padding: '$3',
  maxWidth: '$max',
})

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    background: '$mauve2',
  },

  '#__next': {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Raleway, sans-serif',
    fontSize: '$main',
    lineHeight: '$main',
  },

  html: {
    margin: 0,
    padding: 0,
  },

  '*': { boxSizing: 'border-box' },

  'h1, h2, h3, h3': {
    fontFamily: 'Fira Code',
  },

  h1: {
    fontSize: '$h1',
  },

  a: {
    color: '$violet7',
    textDecoration: 'underline',
    transition: 'color 150ms',

    '&:hover': {
      color: '$violet5',
    },
  },
})

export const Layout: FC = ({ children }) => {
  globalStyles()
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&family=Raleway&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Navigation />
      <Main>
        {children}
        <Footer />
      </Main>
    </>
  )
}

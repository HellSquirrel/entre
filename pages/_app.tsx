import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import { globalCss } from '@styles'

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    background:
      'radial-gradient(circle at bottom, $pink5 0, $indigo3 50%, transparent)',
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
    fontSize: '$big',

    '@bp1': {
      fontSize: '$h1',
    },
  },

  '.img': {
    background: '$gray12',
  },

  [`html[data-theme='light']`]: {
    body: {
      background: '$plumA1',
    },
    '.img': {
      background: 'none',
    },
  },
})

function NextAPP({ Component, pageProps }: AppProps) {
  globalStyles()
  return (
    <ThemeProvider defaultTheme="dark">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default NextAPP

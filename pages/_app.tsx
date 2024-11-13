
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import { globalCss } from '@styles'
import { useEffect } from 'react'
import { createContext, FC } from 'react'
import { useRouter } from 'next/router'

const LocaleContext = createContext('ru')

type Locale = 'en' | 'ru'

type Props = {
  children: React.ReactNode
  locale: Locale
}

const LocaleContextProvider: FC<Props> = ({ children, locale }) => {
  const { locale: routerLocale } = useRouter()
  return (
    <LocaleContext.Provider value={routerLocale || locale || 'ru'}>
      {children}
    </LocaleContext.Provider>
  )
}

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    background:
      'linear-gradient(0deg, $mint4, $mint1 30%, $indigo3 50%, $indigo1)',
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
    display: 'flex',
    alignSelf: 'center',
    padding: '$3',
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

function NextAPP({
  Component,
  pageProps,
  router,
}: AppProps & { Component: any }) {
  useEffect(() => {
    if (typeof window !== undefined && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register(
          new URL('../utils/sw.ts', import.meta.url)
        )
      })
    }
  }, [])

  globalStyles()

  return (
    <ThemeProvider defaultTheme="dark">
      <LocaleContextProvider locale={router.locale as Locale}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </LocaleContextProvider>
    </ThemeProvider>
  )
}

export default NextAPP

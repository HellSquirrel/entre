import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ThemeProvider } from 'next-themes'

function NextAPP({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default NextAPP

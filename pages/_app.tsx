import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '../components/Analytics'
import { getCssText } from '@styles'
import Head from 'next/head'

function NextAPP({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <Head>
        <link rel="icon" type="image/png" sizes="32x32" href="/dragon.png" />
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        <Analytics />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default NextAPP

import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '../components/Analytics'
import { getCssText } from '@styles'

function NextAPP({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <style id="stitches" dangerouslySetInnerHTML={{ __html: getCssText() }} />
      <Analytics />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}

export default NextAPP

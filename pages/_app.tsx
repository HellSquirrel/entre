import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { MDXProvider } from '@mdx-js/react'
import { ThemeProvider } from 'next-themes'
import Image from 'next/image'

function NextAPP({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="dark">
      <Layout>
        <MDXProvider components={{}}>
          <Component {...pageProps} />
        </MDXProvider>
      </Layout>
    </ThemeProvider>
  )
}

export default NextAPP

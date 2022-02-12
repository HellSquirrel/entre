import '../styles/globals.css'
import type { AppProps } from 'next/app'

function NextAPP({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default NextAPP

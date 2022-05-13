import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { getCssText } from '@styles'

const gTagId = 'G-7WLMRYD21T'

const scriptContent = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${gTagId}');`

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang="en">
        <style
          id="stitches"
          dangerouslySetInnerHTML={{ __html: getCssText() }}
        />
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Raleway&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" type="image/png" sizes="32x32" href="/dragon.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${gTagId}`}
          />
          <script
            id="gtag-init"
            dangerouslySetInnerHTML={{
              __html: scriptContent,
            }}
          />
        </body>
      </Html>
    )
  }
}

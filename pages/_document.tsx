import React from 'react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { getCssText } from '@styles'
import { Analytics } from 'components/Analytics'

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
            href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&family=Raleway&display=swap"
            rel="stylesheet"
          />
          <link rel="icon" type="image/png" sizes="32x32" href="/dragon.png" />
          <meta name="robots" content="noindex" />
          <Analytics />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

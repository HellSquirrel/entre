import { FC, useEffect, useState } from 'react'
import refractor from 'refractor'
import graphql from 'refractor/lang/graphql.js'
import { toHtml } from 'hast-util-to-html'
import { Pre } from './Pre'

refractor.register(graphql)

type Props = {
  code: string | (() => Promise<string>)
  lang: string
}

export const CodeSnippet: FC<Props> = ({ code, lang }) => {
  const [html, setHtml] = useState('')
  useEffect(() => {
    async function fetchCode() {
      let result = ''
      if (typeof code !== 'string') {
        result = await code()
      } else {
        result = code
      }

      setHtml(toHtml(refractor.highlight(result, lang)))
    }

    fetchCode()
  }, [code, lang])

  return <Pre dangerouslySetInnerHTML={{ __html: html }} />
}

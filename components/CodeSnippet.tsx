import { FC } from 'react'
import refractor from 'refractor'
import graphql from 'refractor/lang/graphql.js'
import { toHtml } from 'hast-util-to-html'
import { Pre } from './Pre'

refractor.register(graphql)

type Props = {
  code: string
  lang: string
}

export const CodeSnippet: FC<Props> = ({ code, lang }) => {
  const result = refractor.highlight(code, lang)
  const htmlResult = toHtml(result)
  return <Pre dangerouslySetInnerHTML={{ __html: htmlResult }} />
}

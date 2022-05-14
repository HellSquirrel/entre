import React, { FC } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Props = {
  content: string
}

export const Formula: FC<Props> = ({ content }) => {
  const html = katex.renderToString(content, {
    throwOnError: false,
    inlineMode: true,
  })
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

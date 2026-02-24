import React, { FC } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Props = {
  content: string
  inline?: boolean
}

export const Formula: FC<Props> = ({ content, inline }) => {
  const html = katex.renderToString(content, {
    throwOnError: false,
    displayMode: !inline,
  })
  return inline
    ? <span dangerouslySetInnerHTML={{ __html: html }} />
    : <div dangerouslySetInnerHTML={{ __html: html }} />
}

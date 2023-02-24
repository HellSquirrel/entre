import React from 'react'
import { useRouter } from 'next/router'

type Props = {
  children: [React.ReactElement, React.ReactElement]
}

export const LocaleProvider: React.FC<Props> = ({
  children: [enVersion, ruVersion],
}) => {
  const { locale } = useRouter()
  return locale === 'en' ? enVersion : ruVersion
}

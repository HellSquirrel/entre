import React from 'react'
import { Link } from './Link'
import { CaretLeftIcon } from '@radix-ui/react-icons'
import { LocaleProvider } from './LocaleProvider'

export const Back = () => (
  // @ts-ignore
  <Link href="/">
    <>
      <CaretLeftIcon />
      <LocaleProvider>
        <>All posts</>
        <>Все статьи</>
      </LocaleProvider>
    </>
  </Link>
)

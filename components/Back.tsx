import React from 'react'
import { Link } from './Link'
import { CaretLeftIcon } from '@radix-ui/react-icons'

export const Back = () => (
  // @ts-ignore
  <Link href="/">
    <>
      <CaretLeftIcon />
      Все статьи
    </>
  </Link>
)

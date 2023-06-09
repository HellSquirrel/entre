import NextImage, { ImageProps } from 'next/image'
import { styled } from '@styles'

const Caption = styled('figcaption', {
  fontSize: '$small',
})

type Props = {
  caption?: React.ReactNode
} & ImageProps

export const Image = ({ caption, ...rest }: Props) => {
  return (
    <figure>
      <NextImage {...rest} alt="" />
      {caption && <Caption>{caption}</Caption>}
    </figure>
  )
}

import { FC } from 'react'
import { GetStaticPropsContext } from 'next'
import { Post, Frontmatter } from '../../types/blog'
import { MDXProvider } from '@mdx-js/react'
import { styled } from '@styles'
import { Pre } from '../../components/Pre'
import { Link } from '../../components/Link'

import * as ImageOptimization from '../../blog/image-optimizations.mdx'
import * as PerfectLoader from '../../blog/perfect-loader.mdx'

const pages = [ImageOptimization, PerfectLoader]

const Img = styled('img', {
  maxWidth: '$max',
})

type Props = {
  frontmatter: Frontmatter
  Component: React.FunctionComponent
  slug: string
}

const components = {
  img: (props: { src: string; alt: string }) => {
    return <Img src={props.src} alt={props.alt} />
  },
  pre: Pre,
  a: Link,
}

export function getStaticPaths() {
  // @ts-ignore
  const paths = __POSTS__.map(p => ({
    params: {
      slug: `/blog/${p.frontmatter.slug}`,
    },
  }))
  return {
    paths,
    fallback: true,
  }
}

export function getStaticProps(context: GetStaticPropsContext) {
  const currentSlug = context?.params?.slug || ''
  const post =
    // @ts-ignore
    __POSTS__.find(f => currentSlug.includes(f.slug)) || (__POSTS__[0] as Post)
  return {
    props: {
      frontmatter: post?.frontmatter || {},
      slug: currentSlug,
    },
  }
}

const Post: FC<Props> = ({ frontmatter, slug }) => {
  const CurrentPage = pages.find(
    // @ts-ignore
    p => p?.frontmatter?.slug === slug
  )?.default

  return (
    // @ts-ignore
    <MDXProvider components={components}>
      <div>
        {/* @ts-ignore */}
        {CurrentPage ? <CurrentPage /> : null}
      </div>
    </MDXProvider>
  )
}

export default Post

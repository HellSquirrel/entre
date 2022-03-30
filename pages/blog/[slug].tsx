import { FC } from 'react'
import { GetStaticPropsContext } from 'next'
import { getPosts } from 'lib/mdx'
import { Post, Frontmatter } from '../../types/blog'
import { MDXProvider } from '@mdx-js/react'
import { styled } from '@styles'
import ImageOptimisations from '../../blog/image-optimizations.mdx'

const Img = styled('img', {
  maxWidth: '$max',
})

type Props = {
  frontmatter: Frontmatter
  slug: string
}

const components = {
  img: (props: { src: string; alt: string }) => {
    return <Img src={props.src} alt={props.alt} />
  },
}

export async function getStaticPaths() {
  const posts = getPosts(`${process.cwd()}/blog`)
  const paths = posts.map(p => ({
    params: {
      slug: `/blog/${p.slug}`,
    },
  }))
  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const posts = getPosts(`${process.cwd()}/blog`)
  const post =
    posts.find(f => context?.params?.slug?.includes(f.slug)) ||
    (posts[0] as Post)

  return {
    props: {
      frontmatter: post?.frontmatter || {},
      slug: post?.slug,
    },
  }
}

const Post: FC<Props> = ({ frontmatter }) => (
  // @ts-ignore
  <MDXProvider components={components}>
    <div>
      <div>{new Date(frontmatter?.date).toLocaleDateString()}</div>
      <ImageOptimisations />
    </div>
  </MDXProvider>
)

export default Post

import { FC } from 'react'
import { GetStaticPropsContext } from 'next'
import { getPosts } from 'lib/mdx'
import { Post, Frontmatter } from '../../types/blog'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote'
import { MDXProvider } from '@mdx-js/react'
import { styled } from '@styles'

const Img = styled('img', {
  maxWidth: '$max',
})

type Props = {
  mdxSource: MDXRemoteProps
  frontmatter: Frontmatter
  slug: string
}

const components = {
  img: (props: { src: string; alt: string }) => {
    return <Img src={props.src} alt={props.alt} />
  },
}

export async function getStaticPaths() {
  const matters = getPosts(`${process.cwd()}/blog`)
  const paths = matters.map(m => ({
    params: {
      slug: `/blog/${m.slug}`,
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

  const mdxSource = await serialize(post.content)

  return {
    props: {
      mdxSource,
      frontmatter: post?.frontmatter || {},
      slug: post?.slug,
    },
  }
}

const Post: FC<Props> = ({ frontmatter, mdxSource }) => (
  // @ts-ignore
  <MDXProvider components={components}>
    <div>
      <div>{new Date(frontmatter?.date).toLocaleDateString()}</div>
      <MDXRemote {...mdxSource} />
    </div>
  </MDXProvider>
)

export default Post
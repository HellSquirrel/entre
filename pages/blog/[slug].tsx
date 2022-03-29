import { FC } from 'react'
import { GetStaticProps } from 'next'
import { getPosts } from 'lib/mdx'
import { Post, Frontmatter } from '../../types/blog'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote'

type Props = {
  mdxSource: MDXRemoteProps
  frontmatter: Frontmatter
  slug: string
}

const Post: FC<Props> = ({ frontmatter, mdxSource }) => (
  <div>
    <div>{frontmatter.title}</div>
    <div>{new Date(frontmatter.date).toLocaleDateString()}</div>
    <MDXRemote {...mdxSource} />
  </div>
)

export const getStaticProps: GetStaticProps = async context => {
  const post = getPosts(`${process.cwd()}/blog`).find(
    f => f.slug === context?.params?.slug
  ) as Post

  const mdxSource = await serialize(post.content)
  console.log(mdxSource, post?.frontmatter)
  return {
    props: {
      mdxSource,
      frontmatter: post?.frontmatter || {},
      slug: post?.slug,
    },
  }
}

export const getStaticPaths = async () => {
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

export default Post

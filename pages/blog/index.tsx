import { FC } from 'react'
import { GetStaticProps } from 'next'
import { getPosts } from 'lib/mdx'
import Link from 'next/link'
import { Post } from '../../types/blog'

export const getStaticProps: GetStaticProps = () => {
  return {
    props: { posts: getPosts(`${process.cwd()}/blog`) },
  }
}

type Props = {
  posts: Post[]
}

const ListOfAllPosts: FC<Props> = ({ posts }) => (
  <ul>
    {posts.map(({ frontmatter: { title, date, tags }, slug }) => (
      <li key={title}>
        <h2>
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        <div>{new Date(date).toLocaleDateString()}</div>
        <ul>
          {tags.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </li>
    ))}
  </ul>
)

export default ListOfAllPosts

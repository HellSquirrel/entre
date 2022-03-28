import { NextPage, GetStaticProps } from 'next'
import { getAllFrontmatter } from 'lib/mdx'
import Link from 'next/link'

export const getStaticProps: GetStaticProps = () => {
  return {
    props: { matters: getAllFrontmatter(`${process.cwd()}/pages/blog/posts`) },
  }
}

const ListOfAllPosts: NextPage = ({ matters }) => {
  console.log(matters)
  return (
    <ul>
      {matters.map(({ title, date, tags, slug }) => (
        <li key={title}>
          <h2>
            <Link href={`/blog/posts/${slug}`}>{title}</Link>
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
}

export default ListOfAllPosts

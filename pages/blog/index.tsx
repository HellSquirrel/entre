import { FC } from 'react'
import { GetStaticProps } from 'next'
import { Link } from '../../components/Link'
import { Post } from '../../types/blog'
import { styled } from '@styles'

export const getStaticProps: GetStaticProps = () => {
  return {
    // @ts-ignore
    props: { posts: __POSTS__ },
  }
}

type Props = {
  posts: Post[]
}

const StyledList = styled('ul', {
  listStyle: 'none',
})

const StyledLink = styled(Link, {
  fontSize: '$h2',
})

const ListOfAllPosts: FC<Props> = ({ posts }) => (
  <StyledList>
    {posts.map(({ frontmatter: { title, date, tags, slug } }) => (
      <li key={title}>
        {/* @ts-ignore */}
        <StyledLink href={`/blog/${slug}`}>{title}</StyledLink>
        <div>{new Date(date).toLocaleDateString()}</div>
        <ul>
          {tags.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </li>
    ))}
  </StyledList>
)

export default ListOfAllPosts

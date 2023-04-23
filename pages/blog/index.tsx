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
  fontFamily: 'Fira Code',
})

const StyledDate = styled('div', {
  fontSize: '$small',
})

const StyledPost = styled('li', {
  '& + &': {
    marginTop: '$4',
  },
})

const StyledTags = styled('ul', {
  display: 'flex',
  listStyle: 'none',
  padding: 0,
  margin: 0,
})

const StyledTag = styled('li', {
  color: '$pink9',
  '& + &': {
    marginLeft: '$space$2',
  },
})

const skipUnpublished = process.env.NODE_ENV === 'production'

const ListOfAllPosts: FC<Props> = ({ posts }) => (
  <StyledList>
    {posts
      .filter(p => !skipUnpublished || p.frontmatter.published)
      .sort(
        (p1, p2) =>
          // @ts-ignore - We can subtract dates
          new Date(p2.frontmatter.date) - new Date(p1.frontmatter.date)
      )
      .map(({ frontmatter: { title, date, tags, slug, external } }) => (
        <StyledPost key={title}>
          <StyledDate>{new Date(date).toLocaleDateString('en-US')}</StyledDate>
          {/* @ts-ignore */}
          <StyledLink
            href={external ? slug : `/blog/${slug}`}>
            {title}
          </StyledLink>
          <StyledTags>
            {tags.map(t => (
              <StyledTag key={t}>{t}</StyledTag>
            ))}
          </StyledTags>
        </StyledPost>
      ))}
  </StyledList>
)

export default ListOfAllPosts

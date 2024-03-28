import { FC, useContext } from 'react'
import { GetStaticProps } from 'next'
import { Link } from '../../components/Link'
import { Post } from '../../types/blog'
import { styled } from '@styles'
import { useRouter } from 'next/router'
import { LocaleProvider } from '@components/LocaleProvider'

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
const checkLocale = (locales: string[] | undefined, currentLocale?: string) => {
  if (currentLocale === 'en') {
    return locales?.includes('en')
  }

  if (currentLocale === 'ru') {
    return locales ? locales.includes('ru') : true
  }

  return true
}

const ListOfAllPosts: FC<Props> = ({ posts }) => {
  const { locale } = useRouter()
  const postsToShow = posts
    .filter(p => !skipUnpublished || p.frontmatter.published)
    .filter(p => checkLocale(p.frontmatter.locales, locale))
    .sort(
      // @ts-ignore - We can subtract dates
      (p1, p2) => new Date(p2.frontmatter.date) - new Date(p1.frontmatter.date)
    )

  if (!postsToShow.length) {
    return (
      <LocaleProvider>
        <>There is nothing to show ... yet!</>
        <>Тут пока ничего нет :( </>
      </LocaleProvider>
    )
  }

  return (
    <StyledList>
      {postsToShow.map(
        ({ frontmatter: { title, date, tags, slug, external } }) => (
          <StyledPost key={title}>
            <StyledDate>
              {new Date(date).toLocaleDateString('en-US')}
            </StyledDate>
            {/* @ts-ignore */}
            <StyledLink href={external ? slug : `/blog/${slug}`}>
              {title}
            </StyledLink>
            <StyledTags>
              {tags.map(t => (
                <StyledTag key={t}>{t}</StyledTag>
              ))}
            </StyledTags>
          </StyledPost>
        )
      )}
    </StyledList>
  )
}

export default ListOfAllPosts

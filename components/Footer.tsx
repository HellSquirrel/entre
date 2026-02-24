import { FC } from 'react'
import { styled } from '@styles'
import { IconButton } from './IconButton'
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import Dragon from './dragon.svg'
import Link from 'next/link'
import { LocaleProvider } from './LocaleProvider'
import RSS from './rss.svg'

const FooterEl = styled('footer', {
  padding: '$sizes$step $3',
  display: 'flex',
  flexDirection: 'column',

  '@bp1': {
    flexDirection: 'row',
  },
})

const StyledDragon = styled(Dragon, {
  width: '$step',
  height: '$step',
  objectFit: 'cover',
  marginBottom: 'calc(-$3)',

  '@bp1': {
    marginBottom: 0,
  },

  [`html[data-theme='dark'] &`]: {
    path: {
      stroke: '$colors$mauve12 !important',
    },
  },
})

const Left = styled('div', {
  flex: '0 0 $step',
  paddingRight: '$3',
})

const Right = styled('div', {
  maxWidth: 'calc(5 * $step)',
})

const StyledRSS = styled(RSS, {
  position: 'relative',
});

const Socials = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: "0 0 0 10px",
  display: 'flex',
  alignItems: 'center',
})

const Icon = styled(IconButton, {
  position: 'relative',
  top: '1px',
  padding: '6px',
})

const Author = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

const Bio = styled('div', {
  fontSize: '$secondary',
})

const FooterRu: FC = () => {
  return (
    <FooterEl>
      {/*  @ts-ignore */}
      <Left>
        <StyledDragon />
      </Left>
      <Right>
        <Author>
          <Link href="/me">Полина Гуртовая</Link>
          <Socials>
            <li>
              {/* @ts-ignore */}
              <Icon href="https://github.com/hellsquirrel">
                <GitHubLogoIcon />
              </Icon>
              {/* @ts-ignore */}
              <Icon href="https://twitter.com/pgurtovaya">
                <TwitterLogoIcon />
              </Icon>
              {/* @ts-ignore */}
              <Icon href="/rss/ru" external>
                <StyledRSS />
              </Icon>
            </li>
          </Socials>
        </Author>
        <Bio>
          Занимаюсь фронтендом. На досуге изобретаю велосипеды и читаю старые
          книги о древних технологиях.
        </Bio>
      </Right>
    </FooterEl>
  )
}

export const FooterEn: FC = () => {
  return (
    <FooterEl>
      {/*  @ts-ignore */}
      <Left>
        <StyledDragon />
      </Left>
      <Right>
        <Author>
          <Link href="/me">Polina Gurtovaia</Link>
          <Socials>
            <li>
              {/* @ts-ignore */}
              <Icon href="https://github.com/hellsquirrel">
                <GitHubLogoIcon />
              </Icon>
              </li>
            <li>
              {/* @ts-ignore */}
              <Icon href="https://twitter.com/pgurtovaya">
                <TwitterLogoIcon />
              </Icon>
            </li>
            <li>
              {/* @ts-ignore */}
              <Icon href="/rss" external>
                <StyledRSS />
              </Icon>
            </li>
          </Socials>
        </Author>
        <Bio>
          I work in frontend development. In my free time, I invent things that
          already exist and read old books about ancient technologies.
        </Bio>
      </Right>
    </FooterEl>
  )
}

export const Footer = () => (
  <LocaleProvider>
    <FooterEn />
    <FooterRu />
  </LocaleProvider>
)

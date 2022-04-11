import { FC } from 'react'
import me from './me.jpg'
import { styled } from '@styles'
import { IconButton } from './IconButton'
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'
import Dragon from './dragon.svg'

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

const Socials = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
})

const Twitter = styled(IconButton, {
  position: 'relative',
  left: '-10px',
  top: '1px',
})

const Author = styled('div', {
  display: 'flex',
  alignItems: 'center',
})

const Bio = styled('div', {
  fontSize: '$secondary',
})

export const Footer: FC = () => {
  return (
    <FooterEl>
      {/*  @ts-ignore */}
      <Left>
        <StyledDragon />
      </Left>
      <Right>
        <Author>
          Полина Гуртовая
          <Socials>
            <li>
              {/* @ts-ignore */}
              <IconButton href="https://github.com/hellsquirrel">
                <GitHubLogoIcon />
              </IconButton>
              {/* @ts-ignore */}
              <Twitter href="https://twitter.com/pgurtovaya">
                <TwitterLogoIcon />
              </Twitter>
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

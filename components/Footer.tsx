import { FC } from 'react'
import me from './me.jpg'
import { styled } from '@styles'
import { IconButton } from './IconButton'
import { GitHubLogoIcon, TwitterLogoIcon } from '@radix-ui/react-icons'

const FooterEl = styled('footer', {
  maxWidth: '$max',
  padding: '$sizes$step 0',
  display: 'flex',
  alignSelf: 'flex-start',
})

const Photo = styled('img', {
  width: '$step',
  height: '$step',
  objectFit: 'cover',
})

const Left = styled('div', {
  flex: '0 0 $step',
  paddingRight: '$3',
})

const Right = styled('div', {
  flex: '1 0 auto',
  maxWidth: 'calc(5 * $step)',
})

const Socials = styled('ul', {
  listStyle: 'none',
  padding: 0,
  margin: 0,
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
        <Photo {...me} />
      </Left>
      <Right>
        <Author>
          Полина Гуртовая
          <Socials>
            <li>
              <IconButton onClick={() => {}}>
                <GitHubLogoIcon />
              </IconButton>
              <IconButton onClick={() => {}}>
                <TwitterLogoIcon />
              </IconButton>
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

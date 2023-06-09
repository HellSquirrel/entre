import { useState } from 'react'
import { blockThread } from './utils'
import { styled } from '@styles'

const StyledBlock = styled('div', {
  position: 'relative',
  padding: '$4 0',
})

const StyledButton = styled('button', {
  position: 'relative',
  zIndex: 1,
})

const Container = styled('div', {
  position: 'relative',
  minHeight: '500px',
})

export const ImageDecodeDemo = () => {
  const [option, setOption] = useState('jpg')
  const [load, setLoad] = useState(false)
  return (
    <Container>
      <select
        name="blocking example"
        value={option}
        onChange={e => setOption(e.target.value)}>
        <option value="jpg">jpeg</option>
        <option value="webp" selected>
          webp
        </option>
        <option value="avif" selected>
          avif
        </option>
      </select>
      <StyledBlock>
        <StyledButton onClick={() => setLoad(true)}>🎑 Load Image</StyledButton>
      </StyledBlock>
      {load && <img src={`/images/evil-squirrel-blocks-the-road.${option}`} />}
    </Container>
  )
}
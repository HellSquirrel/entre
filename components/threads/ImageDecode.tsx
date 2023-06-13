import { useEffect, useState } from 'react'
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

const StyledImg = styled('img', {
  maxWidth: '100%',
})

export const ImageDecodeDemo = () => {
  const [option, setOption] = useState('jpg')
  const [load, setLoad] = useState(false)
  const [drawOnCanvas, setDrawOnCanvas] = useState(false)

  useEffect(() => {
    if (drawOnCanvas) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
      }
      img.src = `/images/evil-squirrel-blocks-the-road.${option}`
    }
  }, [option, drawOnCanvas])

  return (
    <Container>
      <select
        name="blocking example"
        value={option}
        onChange={e => {
          setOption(e.target.value)
          setDrawOnCanvas(false)
        }}>
        <option value="jpg">jpeg</option>
        <option value="webp">webp</option>
        <option value="avif">avif</option>
      </select>
      <StyledBlock>
        <StyledButton onClick={() => setLoad(true)}>🎑 Load Image</StyledButton>
      </StyledBlock>
      {load && (
        <>
          <StyledImg src={`/images/evil-squirrel-blocks-the-road.${option}`} />
          <button onClick={() => setDrawOnCanvas(true)}>Draw on canvas!</button>
        </>
      )}
    </Container>
  )
}

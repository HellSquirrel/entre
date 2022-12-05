import React, { useRef, useEffect, useCallback } from 'react'
import sq from '../assets/sq.jpeg'
import { styled } from '@styles'
import { convolve } from 'utils/math'
import init, { blur_image } from './squirrel-processor/squirrel_processor'

const sqWidth = sq.width / 2
const sqHeight = sq.height / 2

const Img = styled('img', {
  maxWidth: '100%',
})

const Canvas = styled('canvas', {
  maxWidth: '100%',
})

const Container = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
})

const ButtonContainer = styled('div', {
  display: 'flex',
  gap: '$space$2',
  marginBottom: '$space$2',
})

const blurKernel = [
  [1 / 16, 1 / 8, 1 / 16],
  [1 / 8, 1 / 4, 1 / 8],
  [1 / 16, 1 / 8, 1 / 16],
]

const getImageData = (imageRef: HTMLImageElement) => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = sqWidth
    canvas.height = sqHeight
    ctx?.drawImage(imageRef, 0, 0, sqWidth, sqHeight)
    return ctx?.getImageData(0, 0, sqWidth, sqHeight).data
  } catch (e) {
    console.log(e)
  }
}

const blurWithJs = (
  pixelData: Uint8ClampedArray,
  width: number,
  height: number
) => convolve(pixelData, blurKernel, width, height)

const putTextOnCanvas = (
  ctx: CanvasRenderingContext2D,
  tech: string,
  time: number
) => {
  ctx.font = 'bold 16px sans-serif'
  ctx.fillStyle = 'white'
  ctx.fillText(`Blurred with ${tech} in ${time.toFixed()} ms`, 10, 40)
}

export const BlurredSquirrel = () => {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgToProcess = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    init()
  }, [])

  const blurWithWasm = useCallback(() => {
    const pixels = getImageData(imgToProcess.current!)
    const castedImageData = new Uint8Array(pixels!)
    const start = performance.now()
    const blurredImageData = blur_image(castedImageData, sqWidth, sqHeight)
    const end = performance.now()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const imgData = ctx?.createImageData(sqWidth, sqHeight)
    imgData?.data.set(blurredImageData)
    ctx?.putImageData(imgData!, 0, 0)
    putTextOnCanvas(ctx!, 'Wasm', end - start)
  }, [])

  const blurWithJS = useCallback(() => {
    const pixels = getImageData(imgToProcess.current!)
    const start = performance.now()
    const blurredImageData = blurWithJs(pixels!, sqWidth, sqHeight)
    const end = performance.now()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const imgData = ctx?.createImageData(sqWidth, sqHeight)
    imgData?.data.set(blurredImageData)
    ctx?.putImageData(imgData!, 0, 0)
    putTextOnCanvas(ctx!, 'JS', end - start)
  }, [])

  const handleBlurWithJS = useCallback(() => {
    if (!imgToProcess.current) {
      imgToProcess.current = new Image()
      imgToProcess.current.src = sq.src
    }

    if (!imgToProcess.current.complete) {
      imgToProcess.current.onload = blurWithJS
    } else {
      blurWithJS()
    }
  }, [])

  const handleBlurWithWasm = useCallback(() => {
    if (!imgToProcess.current) {
      imgToProcess.current = new Image()
      imgToProcess.current.src = sq.src
    }

    if (!imgToProcess.current.complete) {
      imgToProcess.current.onload = blurWithWasm
    } else {
      blurWithWasm()
    }
  }, [])

  return (
    <div>
      <ButtonContainer>
        <button onClick={handleBlurWithWasm}> Blur with Wasm</button>
        <button onClick={handleBlurWithJS}> Blur with JS</button>
      </ButtonContainer>

      <Container>
        <Img src={sq.src} width={sqWidth} height={sqHeight} ref={imageRef} />
        <Canvas ref={canvasRef} width={sqWidth} height={sqHeight} />
      </Container>
    </div>
  )
}

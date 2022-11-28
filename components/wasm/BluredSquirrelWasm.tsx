import React, { useRef, useEffect, useCallback } from 'react'
import sq from '../assets/sq.jpeg'
import { styled } from '@styles'
import { convolve } from 'utils/math'
import init, { blur_image } from './squirrelProcessor/squirrel_processor'

const Img = styled('img', {
  maxWidth: '100%',
  objectFit: 'cover',
})

const Canvas = styled('canvas', {
  maxWidth: '100%',
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
    const width = imageRef.width
    const height = imageRef.height
    canvas.width = width
    canvas.height = height
    ctx?.drawImage(imageRef, 0, 0)
    return ctx?.getImageData(0, 0, imageRef.width, imageRef.height).data
  } catch (e) {
    console.log(e)
  }
}

const blurWithJs = (
  pixelData: Uint8ClampedArray,
  width: number,
  height: number
) => convolve(pixelData, blurKernel, width, height)

export const BlurredSquirrel = () => {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgToProcess = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    init()
  }, [])

  const handleBlurWithJS = useCallback(() => {
    if (!imgToProcess.current) {
      imgToProcess.current = new Image()
      imgToProcess.current.src = sq.src
    }
    imgToProcess.current.onload = () => {
      const { width, height } = imageRef.current!
      const pixels = getImageData(imgToProcess.current!)
      const start = performance.now()
      const blurredImageData = blurWithJs(pixels!, width, height)
      const end = performance.now()
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      const imgData = ctx?.createImageData(width, height)
      imgData?.data.set(blurredImageData)
      ctx?.putImageData(imgData!, 0, 0)
      ctx?.fillText(`Blurred with JS in ${end - start}ms`, 10, 20)
    }
  }, [])

  const handleBlurWithWasm = useCallback(() => {
    if (!imgToProcess.current) {
      imgToProcess.current = new Image()
      imgToProcess.current.src = sq.src
    }

    imgToProcess.current.onload = () => {
      const { width, height } = imageRef.current!
      const pixels = getImageData(imgToProcess.current!)
      const castedImageData = new Uint8Array(pixels!)
      const start = performance.now()
      const blurredImageData = blur_image(castedImageData, width, height)
      const end = performance.now()
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      const imgData = ctx?.createImageData(width, height)
      imgData?.data.set(blurredImageData)
      ctx?.putImageData(imgData!, 0, 0)
      ctx?.fillText(`Blurred with Wasm in ${end - start}ms`, 10, 20)
    }
  }, [])

  return (
    <div>
      <button onClick={handleBlurWithWasm}> Blur Squirrel with Wasm</button>
      <button onClick={handleBlurWithJS}> Blur Squirrel with JS</button>
      <Img src={sq.src} ref={imageRef} />
      <Canvas ref={canvasRef} width={sq.width} height={sq.height} />
    </div>
  )
}

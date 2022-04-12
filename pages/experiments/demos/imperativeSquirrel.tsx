import React, {
  useRef,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from 'react'
import sq from './sq.avif'
import { styled } from '@styles'

const KernelEditor = styled('div', {
  width: 'calc(3 * $step)',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: '1fr 1fr 1fr',
  gap: '$2',
})

const Input = styled('input', {
  width: '100%',
  height: '$fontSizes$big',
  fontSize: '$fontSizes$main',
})

const convStep = (arr1: number[], kernel): number =>
  kernel.flat().reduce((acc, v, i) => acc + v * arr1[i], 0)

const convolve = (
  array: Uint8ClampedArray,
  kernel: number[][],
  w: number,
  h: number,
  stride = 1,
  chInImage = 4
): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(w * h * chInImage).fill(255)
  const kh = kernel.length
  const kw = kernel[0].length

  for (let i = 0; i < w - kw; i += stride) {
    for (let j = 0; j < h - kh; j += stride) {
      for (let c = 0; c < chInImage; c++) {
        const arrToConsolve: number[] = []
        for (let k = 0; k < kw; k++) {
          for (let l = 0; l < kh; l++) {
            arrToConsolve.push(
              array[
                chInImage * w * j +
                  chInImage * i +
                  c +
                  chInImage * k +
                  chInImage * l * kw
              ]
            )
          }
        }

        const convStepResult = convStep(arrToConsolve, kernel)
        result[chInImage * w * j + chInImage * i + c] = convStepResult
      }
    }
  }

  return result
}

const imgToArray = (imageRef: HTMLImageElement, kernel): ImageData => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const width = imageRef.width
  const height = imageRef.height
  canvas.width = width
  canvas.height = height
  ctx.drawImage(imageRef, 0, 0)
  const data = ctx.getImageData(0, 0, imageRef.width, imageRef.height).data

  const imgArray = new Uint8ClampedArray(data)
  const convolved = convolve(imgArray, kernel, width, height)
  return new ImageData(convolved, width, height)
}

const ImperativeSquirrel = () => {
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)
  const [kernel, setKernel] = useState([
    [1 / 16, 1 / 8, 1 / 16],
    [1 / 8, 1 / 4, 1 / 8],
    [1 / 16, 1 / 8, 1 / 16],
  ])

  const updateKennel = useCallback(
    (n, value) => {
      const newKernel = kernel.map(row => [...row])
      newKernel[Math.floor(n / 3)][n % 3] = value
      setKernel(newKernel)
    },
    [kernel]
  )

  useEffect(() => {
    const img = new Image()
    img.src = sq.src
    img.onload = () => {
      const data = imgToArray(img, kernel)
      canvasRef.current.getContext('2d').putImageData(data, 0, 0)
    }
    forceUpdate()
  }, [kernel])

  return (
    <div>
      <img src={sq.src} ref={imageRef} width={sq.width} height={sq.height} />
      <canvas ref={canvasRef} width={sq.width} height={sq.height} />
      <KernelEditor>
        {kernel.flat().map((v, i) => (
          <Input
            type="text"
            key={v + i}
            value={v}
            onChange={e => updateKennel(i, e.target.value)}
          />
        ))}
      </KernelEditor>
    </div>
  )
}

export default ImperativeSquirrel

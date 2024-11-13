import React, {
  useRef,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from 'react'
import sq from '../assets/sq.jpeg'
import { styled } from '@styles'
import { debounce } from '../../utils/debounce'

const KernelEditor = styled('div', {
  width: 'calc(3 * $step)',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: '1fr 1fr 1fr',
  gap: '$2',
})

const Img = styled('img', {
  maxWidth: '100%',
  objectFit: 'cover',
})

const Canvas = styled('canvas', {
  maxWidth: '100%',
})

const Input = styled('input', {
  width: '100%',
  height: '$fontSizes$big',
  fontSize: '$fontSizes$main',
})

const initialKernel = [
  [1 / 16, 1 / 8, 1 / 16],
  [1 / 8, 1 / 4, 1 / 8],
  [1 / 16, 1 / 8, 1 / 16],
]

const postImageData = (
  imageRef: HTMLImageElement,
  kernel: number[][],
  worker: Worker
) => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = imageRef.width
    const height = imageRef.height
    canvas.width = width
    canvas.height = height
    ctx?.drawImage(imageRef, 0, 0)
    const data = ctx?.getImageData(0, 0, imageRef.width, imageRef.height).data
    worker.postMessage({ data, kernel, width, height })
  } catch (e) {
    console.log(e)
  }
}

export const ImperativeSquirrel = () => {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgToProcess = useRef<HTMLImageElement | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const [_, forceUpdate] = useReducer(x => x + 1, 0)
  const [kernel, setKernel] = useState(initialKernel)

  const updateKennel = useCallback(
    // @ts-ignore
    (n, value) => {
      const newKernel = kernel.map(row => [...row])
      newKernel[Math.floor(n / 3)][n % 3] = value
      setKernel(newKernel)
    },
    [kernel]
  )

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../../utils/worker.ts', import.meta.url)
    )
    workerRef.current.onmessage = ({ data: { data, width, height } }) => {
      canvasRef.current
        ?.getContext('2d')
        ?.putImageData(new ImageData(data, width, height), 0, 0)
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (!imgToProcess.current) {
      imgToProcess.current = new Image()
    }
  }, [])

  const loadWithNewKernel = useCallback(
    debounce(() => {
      requestAnimationFrame(() => {
        if (imgToProcess.current && workerRef.current) {
          postImageData(imgToProcess.current, kernel, workerRef.current)
        }
      })
    }, 500),
    [kernel]
  )

  useEffect(() => {
    if (imgToProcess.current) {
      imgToProcess.current.src = sq.src
      imgToProcess.current.onload = loadWithNewKernel
    }
  }, [loadWithNewKernel])

  return (
    <div>
      <Img src={sq.src} ref={imageRef} />
      <Canvas ref={canvasRef} width={sq.width} height={sq.height} />
      <KernelEditor>
        {kernel.flat().map((v, i) => (
          <Input
            type="text"
            key={i}
            value={v}
            onChange={e => updateKennel(i, e.target.value)}
          />
        ))}
      </KernelEditor>
    </div>
  )
}

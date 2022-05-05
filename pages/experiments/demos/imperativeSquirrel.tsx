import React, {
  useRef,
  useEffect,
  useReducer,
  useState,
  useCallback,
} from 'react'
import sq from './sq.jpeg'
import { styled } from '@styles'
import { image } from '@tensorflow/tfjs'
import { debounce } from '../../../utils/debounce'
import { convolve } from '../../../utils/math'

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

const postImageData = (imageRef: HTMLImageElement, kernel, worker: Worker) => {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = imageRef.width
    const height = imageRef.height
    canvas.width = width
    canvas.height = height
    ctx.drawImage(imageRef, 0, 0)
    const data = ctx.getImageData(0, 0, imageRef.width, imageRef.height).data
    worker.postMessage({ data, kernel, width, height })
    // const convolved = convolve(data, kernel, width, height)
    // return new ImageData(convolved, width, height)
  } catch (e) {
    console.log(e)
  }
}

const ImperativeSquirrel = () => {
  const imageRef = useRef(null)
  const canvasRef = useRef(null)
  const imgToProcess = useRef(null)
  const workerRef = useRef(null)
  const [_, forceUpdate] = useReducer(x => x + 1, 0)
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
    console.log(import.meta.url)
    workerRef.current = new Worker(
      new URL('../../../utils/worker.ts', import.meta.url)
    )
    workerRef.current.onmessage = ({ data: { data, width, height } }) => {
      canvasRef.current
        .getContext('2d')
        .putImageData(new ImageData(data, width, height), 0, 0)
    }
    return () => {
      workerRef.current.terminate()
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
        postImageData(imgToProcess.current, kernel, workerRef.current)
      })
    }, 500),
    [kernel]
  )

  useEffect(() => {
    imgToProcess.current.src = sq.src
    imgToProcess.current.onload = loadWithNewKernel
  }, [loadWithNewKernel])

  return (
    <div>
      <img src={sq.src} ref={imageRef} width={sq.width} height={sq.height} />
      <canvas ref={canvasRef} width={sq.width} height={sq.height} />
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

export default ImperativeSquirrel

import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import squirrel from './assets/sq.jpeg'
import cat from './assets/cat.jpeg'
import IMAGENET_CLASSES from './assets/tf-classes.json'
import { styled } from '@styles'

const Predictions = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
})

const PredictedClass = styled('span', {
  color: '$colors$sky10',
})

const MODEL_URL = '/models/mobilenet/model.json'
const PREPROCESS_DIVISOR = tf.scalar(255 / 2)
const MAX_PROB = 0.05
const WIDTH = 224
const HEIGHT = 224

const predict = async (input: tf.Tensor, model: tf.LayersModel) => {
  const preprocessedInput = tf.div(
    tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
    PREPROCESS_DIVISOR
  )
  const reshapedInput = preprocessedInput.reshape([
    -1,
    ...preprocessedInput.shape,
  ])
  return model.predict(reshapedInput)
}

const loadModel = async (): Promise<tf.LayersModel> => {
  const model = await tf.loadLayersModel(MODEL_URL)
  model.summary()
  return model
}

type Predictions = Array<{ prob: number; cl: string }>

const getProbs = async (
  img: HTMLImageElement,
  model: tf.LayersModel
): Promise<Predictions> => {
  const tensor = tf.browser.fromPixels(img)
  const result = await predict(tensor, model)
  const predictedClasses = tf.tidy(() => {
    const data = (result as tf.Tensor).dataSync()
    return (
      data
        // @ts-ignore
        .reduce((acc, val, idx) => {
          if (val > MAX_PROB) {
            return [
              ...acc,
              {
                prob: val,
                // @ts-ignore
                cl: IMAGENET_CLASSES[idx][1],
              },
            ]
          }

          return acc
        }, [])
        // @ts-ignore
        .sort((a, b) => (a.prob > b.prob ? -1 : 1))
    )
  })

  return predictedClasses
}

const LayersModel = () => {
  const imgSqRef = useRef<HTMLImageElement | null>(null)
  const imgCatRef = useRef<HTMLImageElement | null>(null)
  const modelRef = useRef<tf.LayersModel | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [imgSqClass, setSqClass] = useState<Predictions>([])
  const [imgCatClass, setCatClass] = useState<Predictions>([])

  useEffect(() => {
    ;(async () => {
      modelRef.current = await loadModel()
      // modelRef.current.summary()
      setModelLoaded(true)
    })()
  }, [])
  useEffect(() => {
    const fn = async () => {
      if (!modelLoaded || !imgSqRef.current || !modelRef.current) return
      const imgSqLoaded =
        imgSqRef.current.complete && imgSqRef.current.naturalHeight !== 0
      if (imgSqLoaded) {
        const probs = await getProbs(imgSqRef.current, modelRef.current)
        setSqClass(probs)
      } else {
        imgSqRef.current.onload = async () => {
          if (imgSqRef.current && modelRef.current) {
            const probs = await getProbs(imgSqRef.current, modelRef.current)
            setSqClass(probs)
          }
        }
      }
    }

    fn()
  }, [modelLoaded])

  useEffect(() => {
    const fn = async () => {
      if (!modelLoaded || !imgCatRef.current || !modelRef.current) return
      const imgCatLoaded =
        imgCatRef.current.complete && imgCatRef.current.naturalHeight !== 0
      if (imgCatLoaded) {
        const probs = await getProbs(imgCatRef.current, modelRef.current)
        setCatClass(probs)
      } else {
        imgCatRef.current.onload = async () => {
          if (imgCatRef.current && modelRef.current) {
            const probs = await getProbs(imgCatRef.current, modelRef.current)
            setCatClass(probs)
          }
        }
      }
    }

    fn()
  }, [modelLoaded])
  return (
    <Predictions>
      <div>
        <img src={squirrel.src} ref={imgSqRef} width={WIDTH} height={HEIGHT} />
        <div>
          {imgSqClass.map(({ prob, cl }) => (
            <div key={cl}>
              <PredictedClass>{cl}</PredictedClass> with probability{' '}
              {(prob * 100).toFixed(1)}%
            </div>
          ))}
        </div>
      </div>
      <div>
        <img src={cat.src} ref={imgCatRef} width={WIDTH} height={HEIGHT} />
        <div>
          {imgCatClass.map(({ prob, cl }) => (
            <div key={cl}>
              <PredictedClass>{cl}</PredictedClass> with probability{' '}
              {(prob * 100).toFixed(1)}%
            </div>
          ))}
        </div>
      </div>
    </Predictions>
  )
}

export default LayersModel

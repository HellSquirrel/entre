import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import squirrel from '../demos/sq.jpeg'
import cat from './cat.jpeg'
import IMAGENET_CLASSES from './tf-classes.json'

const INPUT_NODE_NAME = 'images'
const OUTPUT_NODE_NAME = 'module_apply_default/MobilenetV1/Logits/output'
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
    return (data as Float32Array)
      .reduce((acc, val, idx) => {
        if (val > MAX_PROB) {
          return [...acc, { prob: val, cl: IMAGENET_CLASSES[idx][1] }]
        }

        return acc
      }, [])
      .sort((a, b) => (a.prob > b.prob ? -1 : 1))
  })

  return predictedClasses
}

export default () => {
  const imgSqRef = useRef(null)
  const imgCatRef = useRef(null)
  const modelRef = useRef<tf.LayersModel>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [imgSqClass, setSqClass] = useState<Predictions>([])
  const [imgCatClass, setCatClass] = useState<Predictions>([])

  useEffect(() => {
    ;(async () => {
      modelRef.current = await loadModel()
      modelRef.current.summary()
      setModelLoaded(true)
    })()
  }, [])
  useEffect(() => {
    const fn = async () => {
      if (!modelLoaded) return
      const imgSqLoaded =
        imgSqRef.current.complete && imgSqRef.current.naturalHeight !== 0
      if (imgSqLoaded) {
        const probs = await getProbs(imgSqRef.current, modelRef.current)
        setSqClass(probs)
      } else {
        imgSqRef.current.onload = async () => {
          const probs = await getProbs(imgSqRef.current, modelRef.current)
          setSqClass(probs)
        }
      }
    }

    fn()
  }, [modelLoaded])

  useEffect(() => {
    const fn = async () => {
      if (!modelLoaded) return
      const imgCatLoaded =
        imgCatRef.current.complete && imgCatRef.current.naturalHeight !== 0
      if (imgCatLoaded) {
        const probs = await getProbs(imgCatRef.current, modelRef.current)
        setCatClass(probs)
      } else {
        imgCatRef.current.onload = async () => {
          const probs = await getProbs(imgCatRef.current, modelRef.current)
          setCatClass(probs)
        }
      }
    }

    fn()
  }, [modelLoaded])
  return (
    <>
      <img src={squirrel.src} ref={imgSqRef} width={WIDTH} height={HEIGHT} />
      <div>
        {imgSqClass.map(({ prob, cl }) => (
          <div key={cl}>
            {cl} with probability {(prob * 100).toFixed(1)}%
          </div>
        ))}
      </div>
      <br />
      <br />
      <img src={cat.src} ref={imgCatRef} width={WIDTH} height={HEIGHT} />
      <div>
        {imgCatClass.map(({ prob, cl }) => (
          <div key={cl}>
            {cl} with probability {(prob * 100).toFixed(1)}%
          </div>
        ))}
      </div>
    </>
  )
}

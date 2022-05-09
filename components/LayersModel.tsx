import { useEffect, useRef, useState, FC } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import squirrel from './assets/sq.jpeg'
import cat from './assets/cat.jpeg'
import IMAGENET_CLASSES from './assets/tf-classes.json'
import { styled } from '@styles'
import { applyColorMap } from 'utils/images'

const Predictions = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
})

const PredictedClass = styled('span', {
  color: '$colors$sky10',
})

const Canvas = styled('canvas', {
  opacity: 0.4,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const ColorMap = styled('div', {
  maxWidth: '100%',
  position: 'relative',

  '& img': {
    maxWidth: '100%',
  },
})

const MODEL_URL = '/models/mobilenet/model.json'
const PREPROCESS_DIVISOR = tf.scalar(255 / 2)
const MAX_PROB = 0.05
const WIDTH = 224
const HEIGHT = 224

const processInputImage = (input: tf.Tensor) => {
  const preprocessedInput = tf.div(
    tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
    PREPROCESS_DIVISOR
  )
  return preprocessedInput.reshape([-1, ...preprocessedInput.shape])
}

const predict = async (input: tf.Tensor, model: tf.LayersModel) =>
  model.predict(processInputImage(input))

const loadModel = async (): Promise<tf.LayersModel> => {
  const model = await tf.loadLayersModel(MODEL_URL)
  // model.summary()
  return model
}

type Predictions = Array<{ prob: number; cl: string }>
type Props = {
  showHeatMap?: boolean
}

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

const exploreLayer = (
  input: tf.Tensor,
  model: tf.LayersModel,
  width: number,
  height: number
): tf.Tensor<tf.Rank.R2> => {
  const LAYER_NAME = 'block_12_expand'
  const CLASS_INDEX = 335
  const layer = model.getLayer(LAYER_NAME)
  const layerOutput = layer.output
  const processed = processInputImage(input)

  const subModel1 = tf.model({
    inputs: model.inputs,
    outputs: layerOutput,
  })

  const [_, ...outputShape] = (layerOutput as tf.SymbolicTensor).shape

  const newModelInput = tf.input({ shape: outputShape })
  let layerIndex = model.layers.findIndex(l => l.name === LAYER_NAME)

  let y = newModelInput
  const layers = model.layers.slice(layerIndex + 1)
  for (const l of layers) {
    if (l.getClassName() === 'Add') {
      y = l.apply([y, y]) as tf.SymbolicTensor
    } else {
      y = l.apply(y) as tf.SymbolicTensor
    }
  }

  const subModel2 = tf.model({ inputs: newModelInput, outputs: y })

  return tf.tidy(() => {
    const convOutput2ClassOutput = (input: tf.Tensor) =>
      (subModel2.apply(input, { training: true }) as tf.Tensor).gather(
        [CLASS_INDEX],
        1
      )

    const gradFunction = tf.grad(convOutput2ClassOutput)

    const lastConvLayerOutputValues = subModel1.apply(processed)

    const gradValues = gradFunction(lastConvLayerOutputValues as tf.Tensor)

    const pooledGradValues = tf.mean(gradValues, [0, 1, 2])

    const scaledConvOutputValues = (lastConvLayerOutputValues as tf.Tensor).mul(
      pooledGradValues
    )

    let heatMap = scaledConvOutputValues.mean(-1).relu().expandDims(-1)

    heatMap = heatMap.div(heatMap.max())

    heatMap = tf.image.resizeBilinear(heatMap as tf.Tensor<tf.Rank.R3>, [
      width,
      height,
    ])

    heatMap = applyColorMap(heatMap)

    return heatMap.div(heatMap.max()).squeeze()
  })
}

export const LayersModel: FC<Props> = ({ showHeatMap }) => {
  const imgSqRef = useRef<HTMLImageElement | null>(null)
  const imgCatRef = useRef<HTMLImageElement | null>(null)
  const origImageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const modelRef = useRef<tf.LayersModel | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [imgSqClass, setSqClass] = useState<Predictions>([])
  const [imgCatClass, setCatClass] = useState<Predictions>([])

  useEffect(() => {
    ;(async () => {
      modelRef.current = await loadModel()
      setModelLoaded(true)
    })()
  }, [])

  useEffect(() => {
    const fn = async () => {
      if (!modelLoaded || !imgSqRef.current || !modelRef.current || showHeatMap)
        return
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
      if (
        !modelLoaded ||
        !imgCatRef.current ||
        !modelRef.current ||
        showHeatMap
      )
        return
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

  useEffect(() => {
    const fn = async () => {
      if (
        !modelLoaded ||
        !modelRef.current ||
        !origImageRef.current ||
        !canvasRef.current ||
        !showHeatMap
      )
        return

      // todo: image could be not loaded at the moment
      const origImage = tf.browser.fromPixels(origImageRef.current)

      const heatMap = exploreLayer(
        origImage,
        modelRef.current,
        origImageRef.current?.width,
        origImageRef.current?.height
      )

      tf.browser.toPixels(heatMap, canvasRef.current)
    }

    fn()
  }, [modelLoaded])
  return (
    <>
      {!showHeatMap && (
        <Predictions>
          <div>
            <img
              src={squirrel.src}
              ref={imgSqRef}
              width={WIDTH}
              height={HEIGHT}
            />
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
      )}
      {showHeatMap && (
        <ColorMap>
          <img src={squirrel.src} ref={origImageRef} />
          <Canvas ref={canvasRef} />
        </ColorMap>
      )}
    </>
  )
}

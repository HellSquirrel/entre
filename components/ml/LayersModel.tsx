import { useEffect, useRef, useState, FC } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import squirrel from '../assets/sq.jpeg'
import cat from '../assets/cat.jpeg'
import IMAGENET_CLASSES from '../assets/tf-classes.json'
import { applyColorMap } from 'utils/images'
import {
  ImagesEnum,
  imageLoads$,
  loadModel,
  creteModelBroadcaster$,
} from '../../utils/modelLoader'
import { filter } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { predict } from 'utils/models'
import { PredictedClass, Predictions } from '../Predictions'
import { processInputImage } from 'utils/models'
import { styled } from '@styles'

const ColorMap = styled('div', {
  maxWidth: '100%',
  position: 'relative',

  '& img': {
    maxWidth: '100%',
  },
})

const Canvas = styled('canvas', {
  opacity: 0.4,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
})

const MODEL_URL = '/models/mobilenet/model.json'

const broadcaster$ = creteModelBroadcaster$(MODEL_URL)

const WIDTH = 224
const HEIGHT = 224

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
    const { values, indices } = tf.topk(result as tf.Tensor)
    const valuesData = values.dataSync() as Float32Array
    const indexData = indices.dataSync()
    return valuesData.reduce(
      // @ts-ignore
      (acc, val, idx) => [
        ...acc,
        {
          prob: val,
          // @ts-ignore
          cl: IMAGENET_CLASSES[indexData[idx]][1],
        },
      ],
      []
    )
  })

  // @ts-ignore
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

const LayersModel: FC<Props> = ({ showHeatMap }) => {
  const imgSqRef = useRef<HTMLImageElement | null>(null)
  const imgCatRef = useRef<HTMLImageElement | null>(null)
  const origImageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [imgSqClass, setSqClass] = useState<Predictions>([])
  const [imgCatClass, setCatClass] = useState<Predictions>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadModel(MODEL_URL)
    }
  }, [])

  useEffect(() => {
    if (showHeatMap) return
    const allIsLoaded$ = combineLatest([
      imageLoads$.pipe(filter(img => img === ImagesEnum.Squirrel)),
      broadcaster$,
    ])

    allIsLoaded$.subscribe({
      next: async ([_, model]) => {
        setLoading(false)
        const probs = await getProbs(
          imgSqRef.current as HTMLImageElement,
          model as tf.LayersModel
        )
        setSqClass(probs)
      },
    })
  }, [showHeatMap])

  useEffect(() => {
    if (!showHeatMap) return
    const allIsLoaded$ = combineLatest([
      imageLoads$.pipe(filter(img => img === ImagesEnum.Squirrel)),
      imageLoads$.pipe(filter(img => img === ImagesEnum.Original)),
      broadcaster$,
    ])

    allIsLoaded$.subscribe({
      next: async ([_, __, model]) => {
        setLoading(false)
        const origImage = tf.browser.fromPixels(
          origImageRef.current as HTMLImageElement
        )

        const heatMap = exploreLayer(
          origImage,
          model as tf.LayersModel,
          origImageRef.current?.width as number,
          origImageRef.current?.height as number
        )

        tf.browser.toPixels(heatMap, canvasRef.current as HTMLCanvasElement)
      },
    })
  }, [showHeatMap])

  useEffect(() => {
    if (showHeatMap) return
    const allIsLoaded$ = combineLatest([
      imageLoads$.pipe(filter(img => img === ImagesEnum.Cat)),
      broadcaster$,
    ])

    allIsLoaded$.subscribe({
      next: async ([_, model]) => {
        const probs = await getProbs(
          imgCatRef.current as HTMLImageElement,
          model as tf.LayersModel
        )
        setCatClass(probs)
        setLoading(false)
      },
    })
  }, [showHeatMap])

  useEffect(() => {
    if (imgSqRef.current?.complete) {
      imageLoads$.next(ImagesEnum.Squirrel)
    } else {
      imgSqRef.current?.addEventListener('load', () => {
        imageLoads$.next(ImagesEnum.Squirrel)
      })
    }

    if (imgCatRef.current?.complete) {
      imageLoads$.next(ImagesEnum.Cat)
    } else {
      imgCatRef.current?.addEventListener('load', () => {
        imageLoads$.next(ImagesEnum.Cat)
      })
    }

    if (origImageRef.current?.complete) {
      imageLoads$.next(ImagesEnum.Original)
    } else {
      origImageRef.current?.addEventListener('load', () => {
        imageLoads$.next(ImagesEnum.Original)
      })
    }
  }, [])

  return (
    <>
      {!showHeatMap && (
        <Predictions loading={loading}>
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

export default LayersModel

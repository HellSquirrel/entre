import { useEffect, useRef, useState, FC } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import squirrel from './assets/sq.jpeg'
import cat from './assets/cat.jpeg'
import {
  creteModelBroadcaster$,
  ImagesEnum,
  imageLoads$,
  loadModel,
} from '../utils/modelLoader'
import { filter } from 'rxjs/operators'
import { combineLatest } from 'rxjs'
import { predict } from '../utils/models'
import { PredictedClass, Predictions } from './Predictions'

const MODEL_URL = '/models/ten-classes/model.json'

const WIDTH = 224
const HEIGHT = 224

const broadcaster$ = creteModelBroadcaster$(MODEL_URL)

const classes = [
  'dog',
  'horse',
  'elephant',
  'butterfly',
  'chicken',
  'cat',
  'cow',
  'sheep',
  'spider',
  'squirrel',
]

type Predictions = Array<{ prob: number; cl: string }>

const getProbs = async (
  img: HTMLImageElement,
  model: tf.LayersModel
): Promise<Predictions> => {
  const tensor = tf.browser.fromPixels(img)
  const result = await predict(tensor, model)
  const predictedClasses = tf.tidy(() => {
    const prediction = (result as tf.Tensor).dataSync() || []
    return Array.from(prediction)
      .map((prob, i) => ({ prob, cl: classes[i] }))
      .sort((a, b) => (b.prob < a.prob ? -1 : 1))
      .slice(0, 3)
  })

  return predictedClasses
}

export const TenLayersModel: FC = () => {
  const imgSqRef = useRef<HTMLImageElement | null>(null)
  const imgCatRef = useRef<HTMLImageElement | null>(null)
  const origImageRef = useRef<HTMLImageElement | null>(null)
  const [imgSqClass, setSqClass] = useState<Predictions>([])
  const [imgCatClass, setCatClass] = useState<Predictions>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      loadModel(MODEL_URL)
    }
  }, [])

  useEffect(() => {
    const allIsLoaded$ = combineLatest([
      imageLoads$.pipe(filter(img => img === ImagesEnum.Squirrel)),
      broadcaster$,
    ])

    allIsLoaded$.subscribe({
      next: async ([_, model]) => {
        const probs = await getProbs(
          imgSqRef.current as HTMLImageElement,
          model as tf.LayersModel
        )
        setSqClass(probs)
      },
    })
  }, [])

  useEffect(() => {
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
      },
    })
  }, [])

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
    </>
  )
}

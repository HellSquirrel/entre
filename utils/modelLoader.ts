import { Subject, from } from 'rxjs'
import { tap, map } from 'rxjs/operators'
import * as tf from '@tensorflow/tfjs'

const MODEL_URL = '/models/mobilenet/model.json'

export const broadcaster$ = new Subject<tf.LayersModel>()
export let loadedModel: tf.LayersModel | null = null
let modelIsLoading = false

export const loadModel = async (): Promise<tf.LayersModel | null> => {
  if (typeof window !== 'undefined') {
    if (loadedModel) {
      broadcaster$.next(loadedModel)
      return null
    }
    if (!loadedModel && !modelIsLoading) {
      modelIsLoading = true
      const model = await tf.loadLayersModel(MODEL_URL)
      loadedModel = model
      modelIsLoading = false
      broadcaster$.next(loadedModel)
    }

    // model.summary()
  }
  return null
}

export enum ImagesEnum {
  Squirrel,
  Cat,
  Original,
}

export const imageLoads$ = new Subject<ImagesEnum>()

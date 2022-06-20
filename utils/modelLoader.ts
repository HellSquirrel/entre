import { Subject, filter, map } from 'rxjs'
import * as tf from '@tensorflow/tfjs'
import { LayersModel } from '@tensorflow/tfjs'

export enum Status {
  Created,
  Loading,
  Loaded,
  Failed,
}

type ModelAndStatus = {
  model: tf.LayersModel | null
  url: string
  status: Status
}

export const broadcaster$ = new Subject<ModelAndStatus>()

const cache: Record<string, ModelAndStatus> = {}

export let loadedModel: tf.LayersModel | null = null

const logModelInfo = (model: LayersModel) => {
  model.summary()
  const totalParams = model.countParams()
  const lastLayer = model.layers.slice(-1)[0]
  const prevLayer = model.layers.slice(-2)[0]
  const lastOutput = lastLayer.outputShape[1]
  const prevOutput = prevLayer.outputShape[1]
  const totalOnLastLayer = prevLayer.countParams()
  console.log('totalParams=', totalParams)
  console.log(
    `on the last layer = ${lastOutput} * ${prevOutput} + ${lastOutput}`
  )
}

export const loadModel = async (
  modelUrl: string
): Promise<tf.LayersModel | null> => {
  if (typeof window === 'undefined') return null
  const currentModel = cache[modelUrl]
  if (currentModel && currentModel.status == Status.Loaded) {
    broadcaster$.next(currentModel)
  }

  if (!currentModel) {
    broadcaster$.next({
      model: null,
      url: modelUrl,
      status: Status.Loading,
    })

    const model = await tf.loadLayersModel(modelUrl)

    broadcaster$.next({
      model: model,
      url: modelUrl,
      status: Status.Loaded,
    })

    logModelInfo(model)
  }

  return null
}

export enum ImagesEnum {
  Squirrel,
  Cat,
  Original,
}

export const imageLoads$ = new Subject<ImagesEnum>()

export const creteModelBroadcaster$ = (modelUrl: string) =>
  broadcaster$
    .pipe(
      filter(
        modelAndStatus =>
          modelAndStatus.url === modelUrl &&
          modelAndStatus.status === Status.Loaded
      )
    )
    .pipe(map(modelAndStatus => modelAndStatus.model))

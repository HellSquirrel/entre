import type { NextPage } from 'next'
import Head from 'next/head'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef } from 'react'
import { mod } from '@tensorflow/tfjs'

const toTensor = (arr: number[]) => tf.tensor2d(arr, [arr.length, 1])

const oneHotEncode = ({ target: ys }) => {
  switch (ys) {
    case 0:
      return [1, 0, 0]
    case 1:
      return [0, 1, 0]
    case 2:
      return [0, 0, 1]
  }
}

async function loadDataSet() {
  const data = await tf.data.csv('/model/iris.csv', {
    columnConfigs: {
      target: {
        isLabel: true,
      },
    },
  })

  const updated = data
    // @ts-ignore
    .map(({ xs, ys }) => ({
      xs: Object.values(xs),
      ys: oneHotEncode(ys),
    }))
    .batch(10)

  return updated
}

const doTraining = async () => {
  const data = await loadDataSet()
  const model = tf.sequential()
  model.add(
    tf.layers.dense({
      inputShape: [4],
      activation: 'sigmoid',
      units: 5,
    })
  )

  model.add(
    tf.layers.dense({
      activation: 'softmax',
      units: 3,
    })
  )

  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.adam(0.01),
  })

  await model.fitDataset(data, {
    epochs: 200,
    // callbacks: {
    //   onEpochEnd: async (epoch, logs) => {
    //     console.log('ep --->', epoch)
    //     console.log('loss --->', logs.loss)
    //   },
    // },
  })

  const testVal = model.predict(tf.tensor([5.1, 3.5, 1.4, 0.2], [1, 4]))
  console.log('prediction is!', testVal.dataSync())
}

// const trainModel = async

const TFTutorial = () => {
  // useEffect(() => {
  //   const model = tf.sequential()
  //   model.add(tf.layers.dense({ units: 1, inputShape: [1] }))
  //   model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' })
  //   model.summary()
  //   const xs = toTensor([1, 2, 3, 4, 5])
  //   const ys = toTensor([12, 22, 32, 42, 54])
  //   const res = model.predict(xs)
  //   console.log(res.toString())
  //   ;(async () => {
  //     await doTraining(model, xs, ys)
  //     console.log(model.predict(toTensor([10])).toString())
  //   })()
  // })

  useEffect(() => {
    doTraining()
  }, [])
  return (
    <div>
      <Head>
        <title>TF tutorial</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>tutorial</div>
    </div>
  )
}

export default TFTutorial

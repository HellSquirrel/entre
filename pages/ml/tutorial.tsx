import type { NextPage } from 'next'
import Head from 'next/head'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef } from 'react'
import { mod } from '@tensorflow/tfjs'

const toTensor = (arr: number[]) => tf.tensor2d(arr, [arr.length, 1])

async function doTraining(model, xs, ys) {
  const history = await model.fit(xs, ys, {
    epochs: 500,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        console.log('Epoch:' + epoch + ' Loss:' + logs.loss)
      },
    },
  })
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
    console.log('hey!')
    const data = tf.data.csv('/model/iris.csv', {
      columnConfigs: {
        target: {
          isLabel: true
        }
      }
    })
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

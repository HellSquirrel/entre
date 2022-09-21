import type { NextPage } from 'next'
import Head from 'next/head'
import * as tf from '@tensorflow/tfjs'
import { useEffect, useRef } from 'react'
import data from '../../../data/input-1.json'
import out from '../../../data/out.json'
import outPred from '../../../data/out_pred.json'

const runModel = async () => {
  const path = '/model/model.json'
  const model = await tf.loadGraphModel(path)
  return model
}

const toPic = (data: number[][][]): tf.Tensor =>
  tf
    .tensor(data)
    .transpose([0, 2, 3, 1])
    .slice(0, 1)
    .squeeze()
    .add(1.0)
    .mul(0.5)

const Planner: NextPage = () => {
  const w = 24
  const h = 24
  const smallCanvasRef = useRef(null)
  const bigCanvasRef = useRef(null)
  const realCanvasRef = useRef(null)

  useEffect(() => {
    ;(async () => {
      const model = await runModel()
      const res1 = await model.predict(tf.tensor(data))
      const result = res1
        .transpose([0, 2, 3, 1])
        .slice(0, 1)
        .squeeze()
        .add(1.0)
        .mul(0.5)
      tf.browser.toPixels(result, bigCanvasRef.current)
    })()
  }, [])

  useEffect(() => {
    // const context2d = smallCanvasRef.current.getContext('2d')
    const tensor = tf.tensor(data).transpose([0, 2, 3, 1]).slice(0, 1).squeeze()
    tf.browser.toPixels(tensor, smallCanvasRef.current)

    const outTensor = toPic(out)
    tf.browser.toPixels(outTensor, realCanvasRef.current)
  }, [])

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <canvas width={w} height={h} ref={smallCanvasRef} />
      <canvas width={4 * w} height={4 * h} ref={bigCanvasRef} />
      <canvas width={4 * w} height={4 * h} ref={realCanvasRef} />
    </div>
  )
}

export default Planner

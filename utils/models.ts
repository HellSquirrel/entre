import * as tf from '@tensorflow/tfjs'

const PREPROCESS_DIVISOR = tf.scalar(255 / 2)

export const processInputImage = (input: tf.Tensor) => {
  const preprocessedInput = tf.div(
    tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
    PREPROCESS_DIVISOR
  )
  return preprocessedInput.reshape([-1, ...preprocessedInput.shape])
}

export const predict = async (input: tf.Tensor, model: tf.LayersModel) =>
  model.predict(processInputImage(input))

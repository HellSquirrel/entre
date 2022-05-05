import { convolve } from './math'

addEventListener('message', ({ data: { data, kernel, width, height } }) => {
  const result = convolve(data, kernel, width, height)
  postMessage({ data: result, width, height })
})

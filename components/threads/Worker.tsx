import { useEffect, useState } from 'react'
import { a } from 'utils/sw'

export const WorkerDemo = () => {
  const [load, setLoad] = useState(false)
  const [sum, setSum] = useState(0)

  useEffect(() => {
    if (load) {
      const array = new Float32Array(200000000).fill(Math.random())
      const worker = new Worker(new URL('./workerScript.ts', import.meta.url))
      worker.onmessage = e => {
        if (e.data === 'ready') {
          console.log('worker is ready')
          worker.postMessage(array)
          console.log(array)
          worker.postMessage(array, [array.buffer])
          console.log(array)
        } else {
          setSum(e.data)
        }
      }
    }
  }, [load])

  return (
    <div>
      <button onClick={() => setLoad(s => !s)}>Calculate sum on Worker!</button>
      <br />
      <br />
      <div>The sum is: {sum}</div>
    </div>
  )
}

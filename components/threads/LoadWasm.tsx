import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

let Comp: any = () => null

export const LoadWasm = () => {
  const [load, setLoad] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (load) {
      Comp = dynamic(
        // @ts-ignore
        () =>
          import('../wasm/BlurredSquirrel').then(mod => {
            return mod.BlurredSquirrel
          }),
        {
          ssr: false,
          loading: () => <p>Loading...</p>,
        }
      )
      setLoad(true)
      setLoaded(true)
    }
  }, [load])


  return (
    <div>
      <button onClick={() => setLoad(s => !s)}>
        {load ? 'Unload' : 'Load'} blur scripts!
      </button>
      <br />
      <br />
      {load && <Comp />}
    </div>
  )
}

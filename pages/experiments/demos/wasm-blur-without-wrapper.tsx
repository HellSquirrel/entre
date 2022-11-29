import React, { useEffect, useCallback } from 'react'

const Wasm = () => {
  useEffect(() => {
    const loadModule = async () => {
      const wasmModule = await WebAssembly.instantiateStreaming(
        fetch('/wasm/squirrel_processor_bg.wasm'),
        {
          imports: {},
        }
      )

      const { blur_image, memory } = wasmModule.instance.exports
      return { blur_image, memory }
    }

    const run = async () => {
      const { blur_image, memory } = await loadModule()
    }

    run()
  }, [])

  const handleClick = useCallback(async () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const [openFileHandle] = await window.showOpenFilePicker()
      const file = await openFileHandle.getFile()
      file.arrayBuffer()
    }
  }, [])

  return (
    <div>
      <button onClick={handleClick}>Select Squirrel to blur</button>
      <canvas />
    </div>
  )
}

export default Wasm

import React, { useEffect, useCallback, useRef } from 'react'

export const BlurredSquirrelNative = () => {
  const wasmRef = useRef<WebAssembly.Exports | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const loadModule = async () => {
      const wasmModule = await WebAssembly.instantiateStreaming(
        fetch('/wasm/squirrel_processor_bg.wasm'),
        {
          imports: {},
        }
      )

      return wasmModule.instance.exports
    }

    const run = async () => {
      const wasmModule = await loadModule()
      wasmRef.current = wasmModule
    }

    run()
  }, [])

  const handleClick = useCallback(async () => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const [openFileHandle] = await window.showOpenFilePicker({
        types: [
          {
            accept: {
              'image/*': ['.png', '.jpg'],
            },
          },
        ],
      })
      const file = await openFileHandle.getFile()
      const bitmap = await createImageBitmap(file)
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx!.drawImage(bitmap, 0, 0)
      const imageData = new Uint8Array(
        ctx!.getImageData(0, 0, bitmap.width, bitmap.height).data
      )

      const {
        __wbindgen_add_to_stack_pointer: movePointer,
        blur_image,
        __wbindgen_malloc: malloc,
        memory,
      } = wasmRef.current!

      // @ts-ignore TODO: add proper types
      const retptr = movePointer(-16)
      const length = imageData.length

      // @ts-ignore TODO: add proper types
      const imagePtr = malloc(length)
      // @ts-ignore TODO: add proper types
      const buff = new Uint8Array(memory.buffer)
      buff.set(imageData, imagePtr)

      // @ts-ignore TODO: add proper types
      blur_image(retptr, imagePtr, length, bitmap.width, bitmap.height)
      // @ts-ignore TODO: add proper types

      const int32View = new Int32Array(memory.buffer)
      const readStart = int32View[retptr / 4]
      const readLength = int32View[retptr / 4 + 1]
      // @ts-ignore TODO: add proper types

      const result = new Uint8Array(memory.buffer)
        .subarray(readStart, readStart + readLength)
        .slice()

      canvasRef.current!.width = bitmap.width
      canvasRef.current!.height = bitmap.height

      const blurredImage = ctx!.createImageData(bitmap.width, bitmap.height)
      blurredImage!.data.set(result)

      canvasRef.current?.getContext('2d')?.putImageData(blurredImage, 0, 0)
    }
  }, [])

  return (
    <div>
      <div>
        <button onClick={handleClick}>Select image to blur</button>
      </div>
      <canvas ref={canvasRef} />
    </div>
  )
}

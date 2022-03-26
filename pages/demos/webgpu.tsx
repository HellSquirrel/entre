import { useEffect } from 'react'

const runDemo = async () => {
  const adapter = await navigator.gpu.requestAdapter()
  const device = await adapter.requestDevice()
  console.log(device)

  const module = device.createShaderModule({
    code: `
      @stage(compute) @workgroup_size(64)
      fn main() {
        // Pointless!
      }
    `,
  })

  const pipeline = device.createComputePipeline({
    compute: {
      module,
      entryPoint: 'main',
    },
  })
}

const WebGPUDemo = () => {
  useEffect(() => {
    runDemo()
  }, [])

  return null
}

export default WebGPUDemo

import { useEffect, useRef } from 'react'

const w = 500
const h = 500

function drawScene(balls, ctx) {
  ctx.save()
  ctx.scale(1, -1)
  ctx.translate(0, -ctx.canvas.height)
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = 'red'
  for (let i = 0; i < balls.length; i += 6) {
    const r = balls[i + 0]
    const px = balls[i + 2]
    const py = balls[i + 3]
    const vx = balls[i + 4]
    const vy = balls[i + 5]
    let angle = Math.atan(vy / (vx === 0 ? Number.EPSILON : vx))
    // Correct for Math.atan() assuming the angle is [-PI/2;PI/2].
    if (vx < 0) angle += Math.PI
    const ex = px + Math.cos(angle) * Math.sqrt(2) * r
    const ey = py + Math.sin(angle) * Math.sqrt(2) * r
    ctx.beginPath()
    ctx.arc(px, py, r, 0, 2 * Math.PI, true)
    ctx.moveTo(ex, ey)
    ctx.arc(px, py, r, angle - Math.PI / 4, angle + Math.PI / 4, true)
    ctx.lineTo(ex, ey)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}

const runDemo = async canvasRef => {
  // getting device
  const adapter = await navigator.gpu?.requestAdapter()
  if (!adapter) return
  const device = await adapter.requestDevice()

  // creating shader
  const module = device.createShaderModule({
    code: `
    
    struct Ball {
      radius: f32,
      position: vec2<f32>,
      velocity: vec2<f32>,
    }

    @group(0) @binding(1)
    var<storage, write> output: array<Ball>;

    @group(0) @binding(0)
    var<storage, read> input: array<Ball>;

    let TIME_STEP: f32 = 0.016;
    
    @stage(compute) @workgroup_size(64)
    fn main(
      @builtin(global_invocation_id) global_id : vec3<u32>,
      @builtin(local_invocation_id) local_id : vec3<u32>,
    ) {
      let num_balls = arrayLength(&output);
      if(global_id.x >= num_balls) {
        return;
      }
    
      output[global_id.x].position =
        input[global_id.x].position +
        input[global_id.x].velocity * TIME_STEP;
    }
    `,
  })

  // creating buffers
  const BUFFER_SIZE = 1000

  const output = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  })

  const input = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  })

  const stagingBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  })

  // creating bind group layout
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'read-only-storage',
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: {
          type: 'storage',
        },
      },
    ],
  })

  // creating bind group
  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: {
          buffer: input,
        },
      },
      {
        binding: 1,
        resource: {
          buffer: output,
        },
      },
    ],
  })

  // creating pipeline
  const pipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    compute: {
      module,
      entryPoint: 'main',
    },
  })

  // endoder magic
  setInterval(async () => {
    const commandEncoder = device.createCommandEncoder()
    const passEncoder = commandEncoder.beginComputePass()
    passEncoder.setBindGroup(0, bindGroup)
    passEncoder.setPipeline(pipeline)
    passEncoder.dispatch(Math.ceil(BUFFER_SIZE / 64))
    passEncoder.end()

    // Let's play!
    const NUM_BALLS = 10
    const randomBetween = (a, b) => a + Math.random() * (b - a)

    let inputBalls = new Float32Array(new ArrayBuffer(BUFFER_SIZE))
    for (let i = 0; i < NUM_BALLS; i++) {
      inputBalls[i * 6 + 0] = randomBetween(2, 10) // radius
      inputBalls[i * 6 + 1] = 0 // padding
      inputBalls[i * 6 + 2] = randomBetween(0, w) // position.x
      inputBalls[i * 6 + 3] = randomBetween(0, h) // position.y
      inputBalls[i * 6 + 4] = randomBetween(-100, 100) // velocity.x
      inputBalls[i * 6 + 5] = randomBetween(-100, 100) // velocity.y
    }

    device.queue.writeBuffer(input, 0, inputBalls)

    // copy output buffer to another buffer
    commandEncoder.copyBufferToBuffer(
      output,
      0, // Source offset
      stagingBuffer,
      0, // Destination offset
      BUFFER_SIZE
    )
    const commands = commandEncoder.finish()
    device.queue.submit([commands])

    await stagingBuffer.mapAsync(
      GPUMapMode.READ,
      0, // Offset
      BUFFER_SIZE // Length
    )
    const copyArrayBuffer = stagingBuffer.getMappedRange(0, BUFFER_SIZE)
    const data = copyArrayBuffer.slice()
    const newBalls = new Float32Array(data)
    stagingBuffer.unmap()

    inputBalls = newBalls
    drawScene(newBalls, canvasRef.getContext('2d'))
  }, 500)
}

const WebGPUDemo = () => {
  const canvas = useRef()
  useEffect(() => {
    runDemo(canvas.current)
  }, [])

  return (
    <div>
      Web GPU demo
      <canvas width={w} height={h} ref={canvas} />
    </div>
  )
}

export default WebGPUDemo

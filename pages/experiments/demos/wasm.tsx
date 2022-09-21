import React, { useEffect, useRef } from 'react'
import init, { fractal_square_points } from './pkg/entre_graph'

const Wasm = () => {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    ;(async () => {
      await init()
      const shapes = fractal_square_points(5)
      const ctx = ref.current?.getContext('2d')
      // @ts-ignore
      //   ctx?.strokeStyle = 'red'
      shapes.forEach(({ points: [p1, p2, p3, p4] }) => {
        ctx?.beginPath()
        ctx?.moveTo(p1.x, p1.y)
        ctx?.lineTo(p2.x, p2.y)
        ctx?.lineTo(p3.x, p3.y)
        ctx?.lineTo(p4.x, p4.y)
        ctx?.lineTo(p1.x, p1.y)
        ctx?.stroke()
      })
    })()
  }, [])

  return (
    <canvas ref={ref} width="100" height="100" style={{ background: '#fff' }} />
  )
}

export default Wasm

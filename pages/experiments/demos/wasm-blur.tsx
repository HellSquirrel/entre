import React, { useEffect, useRef } from 'react'
import init from '../../../components/wasm/squirrelProcessor/squirrel_processor'
import { BlurredSquirrel } from '../../../components/wasm/BluredSquirrelWasm'

const Wasm = () => {
  return (
    <div>
      <BlurredSquirrel />
    </div>
  )
}

export default Wasm

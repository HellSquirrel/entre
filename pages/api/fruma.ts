import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as wasm from './fruma_bg.wasm?module'

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const a = 1
  const b = 2
  return res.status(200).json({
    name: `Here is a sum of ${a} and ${b} from wasm: ${wasm.sum(1, 2)}`,
  })
}

export const config = {
  runtime: 'experimental-edge',
}

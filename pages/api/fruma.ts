import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse) => {
  return res.json({
    name: `Hello, from ${req.url} I'm now an Edge Function!`,
  })
}

export const config = {
  runtime: 'experimental-edge',
}

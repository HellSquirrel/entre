import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DynamicModel = dynamic(() => import('./LayersModel'), {
  ssr: false,
})

export const LayersModel = ({ ...props }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <DynamicModel {...props} />
  </Suspense>
)

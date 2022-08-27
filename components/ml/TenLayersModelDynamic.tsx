import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DynamicModel = dynamic(() => import('./TenLayersModel'), {
  ssr: false,
})

export const TenLayersModel = ({ ...props }) => (
  <Suspense fallback={<div>Loading...</div>}>
    <DynamicModel {...props} />
  </Suspense>
)

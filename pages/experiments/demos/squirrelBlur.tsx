import { FC } from 'react'
import Squirrel from '../../../blog/assets/squirrel.svg'

const SquirrelBlur: FC = () => {
  return [...Array(2)].map((_, i) => (
    <Squirrel
      key={i}
      style={{
        width: 500,
        transform: `translate(${300 * i}px)`,
        transformOrigin: '50% 50%',
        position: 'absolute',
        top: '0',
        filter: `blur(${7 * i}px)`,
      }}
    />
  ))
}

export default SquirrelBlur

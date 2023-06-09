import { useState } from 'react'
import { blockThread } from './utils'
import Squirrel from './squirrel.svg'
import { styled, keyframes } from '@styles'

const frames = keyframes({
  '0%': { transform: 'translateY(0)' },
  '25%': { transform: 'translateY(-200px) rotate(20deg)' },
  '50%': { transform: 'translateY(0)' },
  '75%': { transform: 'translateY(-200px) rotate(-20deg)' },
  '100%': { transform: 'translateY(0)' },
})

const framesPos = keyframes({
  '0%': { top: '0' },
  '50%': { top: '-200px' },
  '100%': { top: '0' },
})

const StyledDiv = styled('div', {
  animation: `${frames} 3s ease-in-out infinite`,
  width: '100px',
  height: '100px',
  border: '5px solid #fff',
  borderRadius: '50%',
  position: 'absolute',
  top: '50%',

  variants: {
    pos: {
      true: {
        animation: `${framesPos} 3s ease-in-out infinite`,
      },
    },
  },
})

const StyledSquirrel = styled(Squirrel, {
  position: 'relative',
  animation: `${frames} 3s ease-in-out infinite`,
  '& path': {
    stroke: '#fff !important',
  },

  variants: {
    pos: {
      true: {
        animation: `${framesPos} 3s ease-in-out infinite`,
      },
    },
  },
})

const StyledBlock = styled('div', {
  position: 'relative',
  padding: '$4 0',
})

const StyledButton = styled('button', {
  position: 'relative',
  zIndex: 1,
})

const Container = styled('div', {
  position: 'relative',
  minHeight: '500px',
})

export const ThreadDemo = () => {
  const [blockOption, setBlockOption] = useState('just-block')
  return (
    <Container>
      <select
        name="blocking example"
        value={blockOption}
        onChange={e => setBlockOption(e.target.value)}>
        <option value="just-block">Just block</option>
        <option value="cssAnimation" selected>
          Block + CSS animation
        </option>

        <option value="cssAnimationSVG" selected>
          Block + CSS transform animation (div + SVG)
        </option>

        <option value="cssAnimationSVGPos" selected>
          Block + CSS position animation (div + SVG)
        </option>
      </select>
      <StyledBlock>
        <StyledButton onClick={blockThread}>🛑 Block Thread</StyledButton>
      </StyledBlock>

      {blockOption === 'just-block' && 'Check Performance tab in DevTools'}
      {blockOption === 'cssAnimation' ||
      blockOption === 'cssAnimationSVG' ||
      blockOption === 'cssAnimationSVGPos' ? (
        <StyledBlock>
          <StyledDiv pos={blockOption === 'cssAnimationSVGPos'}>
            <br />
            __HTML__
          </StyledDiv>
          {blockOption !== 'cssAnimation' && (
            <StyledSquirrel pos={blockOption === 'cssAnimationSVGPos'} />
          )}
        </StyledBlock>
      ) : null}
    </Container>
  )
}

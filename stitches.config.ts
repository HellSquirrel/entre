import { createStitches } from '@stitches/react'

import * as rColors from '@radix-ui/colors'
const colors = Object.entries({ ...rColors }).reduce(
  (a, [key, v]) => (key.includes('dark') ? a : { ...a, ...v }),
  {}
)

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    space: {
      1: '4px',
      2: '12px',
      3: '24px',
      4: '36px',
    },

    sizes: {
      max: '800px',
      step: '100px',
      icon: '20px',
      unit: '1px',
      small: '3px',
    },
    fontSizes: {
      big: '36px',
      small: '12px',
      main: '20px',
      secondary: '16px',
      h1: '54px',
      h2: '32px',
    },

    fonts: {
      code: "'Fira Code', monospace",
    },

    lineHeights: {
      main: '1.3',
    },
    colors,
  },

  media: {
    bp1: '(min-width: 640px)',
  },
})

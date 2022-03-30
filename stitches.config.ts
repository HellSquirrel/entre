import { createStitches } from '@stitches/react'

import {
  gray,
  red,
  whiteA,
  grayDark,
  violet,
  violetDark,
  violetDarkA,
  violetA,
} from '@radix-ui/colors'

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
    },
    sizes: {
      max: '800px',
      step: '100px',
    },
    fontSizes: {
      main: '20px',
      secondary: '16px',
      h1: '54px',
    },
    lineHeights: {
      main: '1.3',
    },
    colors: {
      ...gray,
      ...red,
      ...whiteA,
      ...violet,
      ...violetA,
    },
  },

  media: {
    bp1: '(min-width: 480px)',
  },
})

const darkTheme = createTheme({
  colors: {
    ...grayDark,
    ...violetDark,
    ...violetDarkA,
  },
})

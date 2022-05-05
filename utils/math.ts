const convStep = (arr1: number[], kernel: number[][]): number =>
  kernel.flat().reduce((acc, v, i) => acc + v * arr1[i], 0)

export const convolve = (
  array: Uint8ClampedArray,
  kernel: number[][],
  w: number,
  h: number,
  stride = 1,
  chInImage = 4
): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(w * h * chInImage).fill(255)
  const kh = kernel.length
  const kw = kernel[0].length

  for (let i = 0; i < w - kw; i += stride) {
    for (let j = 0; j < h - kh; j += stride) {
      for (let c = 0; c < chInImage; c++) {
        const arrToConsolve: number[] = []
        for (let k = 0; k < kw; k++) {
          for (let l = 0; l < kh; l++) {
            arrToConsolve.push(
              array[
                chInImage * w * j +
                  chInImage * i +
                  c +
                  chInImage * k +
                  chInImage * l * kw
              ]
            )
          }
        }

        const convStepResult = convStep(arrToConsolve, kernel)
        result[chInImage * w * j + chInImage * i + c] = convStepResult
      }
    }
  }

  return result
}

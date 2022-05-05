// императивненько
const createValueGetter = (a, b) => x => a * x + b
const getOutput = createValueGetter(2, 5)
console.log([1, 2].map(getOutput)) // [7, 9]

const inputs = [1, 2, 3, 4]

const realOutputs = [7, 9, 11, 13] // values.map(getOutput)
// const getValueWithML =  ??

// готовим декларативность :)

const trainStep = (a, b, inputs, realOutputs, step) => {
  const outputs = layer(inputs, a, b)
  const gradL = outputs.map((y, index) => y - realOutputs[index])

  const gradA = gradL.map((gr, i) => gr * outputs[i]).reduce((a, b) => a + b, 0)
  const gradB = gradL.reduce((a, b) => a + b, 0)

  return [a - gradA * step, b - gradB * step]
}

// and here is our declarative version

// задаем начальные параметры
const learningRate = 0.001
const numberOfSteps = 10000
const initialParams = [Math.random(), Math.random()]

// задаем нашу "архитектуру"
const layer = (inputs: number[], ...params: [number, number]): number[] =>
  inputs.map(x => params[0] * x + params[1])

// задаем как сравнивать результаты
const loss = (outputs: number[], realOutputs: number[]): number =>
  outputs
    .map((y, index) => Math.pow(y - realOutputs[index], 2))
    .reduce((a, b) => a + b, 0)

// 🏋️
const doTrain = (): [number, number] =>
  [...Array(numberOfSteps)].reduce((currentParams: [number, number]) => {
    console.log(
      ...currentParams,
      loss(layer(inputs, ...currentParams), realOutputs)
    )
    return trainStep(...currentParams, inputs, realOutputs, learningRate)
  }, initialParams)

const learnedParams = doTrain()

const result = layer(inputs, ...learnedParams)
console.log(result) // [6.952457161700541, 8.9797075504127, 11.00695793912486, 13.034208327837018]

export default () => 'simple example'

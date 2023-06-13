// workerScript.ts

postMessage('ready')

onmessage = function (event) {
  const data = event.data
  const result = data.reduce((acc: number, item: number) => acc + item, 0)
  postMessage(result)
}

export {}

export const debounce = <T extends any[]>(fn: Function, ttw: number) => {
  let timeout: NodeJS.Timeout | null = null
  return function (...args: T) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      fn(...args)
    }, ttw)
  }
}

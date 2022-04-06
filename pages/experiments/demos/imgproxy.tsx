import Image from 'next/image'
import styles from './imgproxy.module.css'

type Coord = [number, number]

const digitToCoords = (char: string, text: string): Coord => {
  const index = text.indexOf(char)
  return [index % 3, Math.floor(index / 3)]
}

type GetDistance = (start: Coord, end: Coord) => number
const getDistance: GetDistance = ([x, y], [x0, y0]) =>
  Math.max(Math.abs(x - x0), Math.abs(y - y0))

const allEntries = (): Coord[] => {
  const range = [...Array(3)]
  return range.reduce(
    (acc, _, x) => acc.concat(range.map((_, y) => [x, y])),
    []
  )
}

const entryTimeForSquence = (entries: Coord[], initialPos: Coord) =>
  entries.reduce((acc, v) => acc + getDistance(v, initialPos), 0)

const maxEntryTimeForSquence = (entries: Coord[]) =>
  allEntries()
    .map(pos => entryTimeForSquence(entries, pos))
    .sort()[0]

function entryTime(seq: string, text: string): number {
  const entries = [...seq].map(char => digitToCoords(char, text))
  return maxEntryTimeForSquence(entries)
}

const seq = [...'423692'].map(char => digitToCoords(char, '923857614'))
console.log(entryTimeForSquence(seq, [0, 0]))
console.log(
  allEntries()
    .map(pos => entryTimeForSquence(seq, pos))
    .sort()
)

console.log(entryTime('423692', '923857614'))
// const min = console.log(allEntries())
// console.log(keyToCoords('123456789', '3'))
// console.log(getDistance([0, 0], [1, 2]))

const ImgproxyDemo = () => {
  const origSrc = '/demos/fish-orig.jpeg'
  const width = 2376
  const height = 1782
  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <img src={origSrc} width={width} height={height} />
      </div>
      <div className={styles.img}>
        <Image src={origSrc} width={width} height={height} />
      </div>
    </div>
  )
}

export default ImgproxyDemo

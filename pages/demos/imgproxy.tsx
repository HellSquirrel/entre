import Image from 'next/image'
import styles from './imgproxy.module.css'
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

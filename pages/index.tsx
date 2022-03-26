import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/link';

const Main: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>🐿</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <nav>
          <Link href="/planner" >Planner</Link>  |{'  '}
          <Link href="/ml" >ML</Link>  |{'  '}
          <Link href="/blog/first" >Blog</Link>  |{'  '}
          <Link href="/demos/imgproxy">Imgproxy</Link>  |{'  '}
          <Link href="/api/auth/login">Login</Link>  |{'  '}
          <Link href="/api/auth/logout">Logout</Link>


        </nav>
      </main>
        
    </div>
  )
}

export default Main

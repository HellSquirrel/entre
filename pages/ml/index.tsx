import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Planner: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/ml/get-started">Get Started</Link>
      </main>
    </div>
  )
}

export default Planner

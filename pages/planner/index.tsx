import type { NextPage } from 'next'
import Head from 'next/head'
import Editor from "@monaco-editor/react";


const Planner: NextPage = () => {
  return (
    <>
      <Head>
        <title>Planner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
      <Editor
        height="100vh"
        defaultLanguage="typescript"
        defaultValue=""
      />
      </main>
    </>
  )
}

export default Planner

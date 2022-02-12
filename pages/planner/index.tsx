import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
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
        height="90vh"
        defaultLanguage="mdx"
        defaultValue="# Start"
      />
      </main>
        
    </>
  )
}

export default Planner

import type { NextPage } from 'next'
import Head from 'next/head'
import Planner from './Planner'
import { UserProvider, useUser } from '@auth0/nextjs-auth0'
import Profile from '../../../components/Profile'

const PageWithUser = () => {
  const { user, isLoading } = useUser()
  if (isLoading) return <>...Loading</>
  return (
    <Profile name={user?.nickname as string} img={user?.picture as string} />
  )
}

const PlannerPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Planner</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <UserProvider>
          <PageWithUser />
          <Planner />
        </UserProvider>
      </main>
    </>
  )
}

export default PlannerPage

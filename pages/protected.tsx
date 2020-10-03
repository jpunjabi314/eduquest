import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'
import { logout } from 'lib/client/helpers'

import { FC } from 'react'
import Button from 'components/button'

const Protected: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading)

  const data = useAuthedData<{ message: string }>('/api/protected', user)
  if (!user) return <p> Loading... </p>

  return <>
    <h1>Protected Page</h1>
    <p>You are logged in as {user.displayName}.</p>
    <p>{data.error ? `Error loading data: ${data.error.message}` : data.data?.message ?? 'Loading...'}</p>
    <Button onClick={logout}>Logout</Button>
  </>
}

export default Protected
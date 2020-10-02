import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRedirect, useRequireNoUser } from 'lib/client/hooks'

import { FC } from 'react'

const Index: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireNoUser(user, loading, '/')

  const login = async () => {
    await loginWith(authProviders.google)()
    useRedirect('/onboard')
  }
  
  return <>
    <h1>Landing Page</h1>
    <p>
      THis is a website
    </p>
    <button onClick={login}>Login with Google</button>
  </>
}

export default Index
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { authedDataFetcher } from 'lib/client/helpers'
import { useRequireUser, useRedirect } from 'lib/client/hooks'

import { FC } from 'react'

const Onboard: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading, '/')

  const register = async (isTeacher: boolean) => {
    await authedDataFetcher('/api/users/register', user, { teacher: isTeacher })
    useRedirect('/protected')

  }

  return <>
    <h1>Are you a teacher or a student?</h1>
    <button onClick={() => register(true)}>I'm a teacher</button>
    <button onClick={() => register(false)}>I'm a student</button>
  </>
}

export default Onboard
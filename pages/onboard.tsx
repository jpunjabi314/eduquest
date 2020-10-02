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

  const joinClassroom = async (id: string) => {
    await authedDataFetcher('/api/classrooms/join', user, {
      token: id
    })
    useRedirect('/dashboard')
  }

  const newClassroom = async (name: string) => {
    await authedDataFetcher('/api/classrooms/new', user, {
      name: name
    })
    useRedirect('/dashboard')
  }

  return <>
    <h1>Are you a teacher or a student?</h1>
    <button onClick={() => newClassroom("My name")}>Create a classroom</button>
    <button onClick={() => joinClassroom('00e273')}>Join a classroom</button>
  </>
}

export default Onboard
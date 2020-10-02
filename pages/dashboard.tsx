import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRedirect, useRequireUser } from 'lib/client/hooks'

import { FC } from 'react'

const Dashboard: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading, '/')

  return <>

    <div className="topnav">
        <h2>Lorem Ipsum</h2>
    </div>
        <h1>Lorem Ipsum </h1>
        <p>
        This is a website
        </p>
  </>
}

export default Dashboard
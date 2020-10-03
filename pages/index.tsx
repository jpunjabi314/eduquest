import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'
import { loginWith } from 'lib/client/helpers'
import { useRequireNoUser } from 'lib/client/hooks'

import { FC } from 'react'
import Container from 'components/container'
import Button from 'components/button'
import { useRouter } from 'next/router'
import { FullscreenLoader } from 'components/loader'

const Index: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireNoUser(user, loading, '/dashboard')

  const router = useRouter()

  const login = async () => {
    await loginWith(authProviders.google)()
    router.push('/onboard')
  }
  if(loading) return <FullscreenLoader />
  return <>
  <Container>
    <div className = "topnav"></div>
    <h1>Educal</h1>
    <p>
      Your one stop for motivating students during online learning
    </p>
    <Button onClick={login}>Login with Google</Button>
  </Container>
  </>
}

export default Index
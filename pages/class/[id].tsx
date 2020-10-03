import { useAuthState } from 'react-firebase-hooks/auth'
import firebase, { authProviders } from 'lib/client/firebase'

import { FC } from 'react'
import Container from 'components/container'
import { useRouter } from 'next/router'

const ClassPage: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  const router = useRouter()

  const { id } = router.query; 

  return <>
  <Container>
    <h1>Class Code: {id}</h1>
  </Container>
  </>
}

export default ClassPage
import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'

import { FC } from 'react'
import Container from 'components/container'
import { useRouter } from 'next/router'

import { useAuthedData } from 'lib/client/hooks'
import { Classroom, SensoredClassroom } from 'lib/isomorphic/types'
import { FullscreenLoader } from 'components/loader'

const ClassPage: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  const router = useRouter()

  const { token } = router.query; 

  const classroom = useAuthedData<{
    relation: 'student' | 'teacher',
    data: Classroom | SensoredClassroom
  }>(`/api/classrooms/get/${token}`, user)

  if(classroom.data) {
    return <Container>
      <h1>{classroom.data.data.name}</h1>
      <h4>{classroom.data.data.id}</h4>
    </Container>
  } else if(classroom.error) {
    router.push('/')
    return <></>
  } else {
    return <FullscreenLoader />
  }
}

export default ClassPage
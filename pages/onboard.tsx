import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { authedDataFetcher } from 'lib/client/helpers'
import { useRequireUser } from 'lib/client/hooks'

import { FC, useState } from 'react'

import Modal from 'components/modal'
import Button from 'components/button'
import Input from 'components/input'
import { useRouter } from 'next/router'
import Container from 'components/container'

const Onboard: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading, '/')

  const [showCreateClassroom, setShowCreateClassroom] = useState(false)
  const [createClassroomName, setCreateClassroomName] = useState('')

  const [showJoinClassroom, setShowJoinClassroom] = useState(false)
  const [joinClassroomCode, setJoinClassroomCode] = useState('')

  const router = useRouter()

  const joinClassroom = async (id: string) => {
    await authedDataFetcher('/api/classrooms/join', user, {
      token: id
    })
    router.replace('/dashboard')
  }

  const newClassroom = async (name: string) => {
    await authedDataFetcher('/api/classrooms/new', user, {
      name: name
    })
    router.replace('/dashboard')
  }

  return <Container>
    <h1>Get set up!</h1>
    <Button onClick={() => setShowCreateClassroom(true)}>Create a classroom</Button>
    <Button onClick={() => setShowJoinClassroom(true)}>Join a classroom</Button>
    <Modal 
      title="Create a classroom"
      visible={showCreateClassroom} 
      controls={
        <Button onClick={() => newClassroom(createClassroomName)}>Create!</Button>
      }
      setVisible={()=> setShowCreateClassroom(false)}
    >
      <Input 
        placeholder='Math or something...'
        label='Class name'
        id='name'
        value={createClassroomName}
        onChange={(event) => setCreateClassroomName(event.target.value)}
      />
    </Modal>

    <Modal 
      title="Join a classroom"
      visible={showJoinClassroom} 
      controls={
        <Button onClick={() => joinClassroom(joinClassroomCode)}>Create!</Button>
      }
      setVisible={()=> setShowJoinClassroom(false)}
    >
      <Input 
        placeholder='abcdef'
        label='Class code'
        id='code'
        value={joinClassroomCode}
        onChange={(event) => setJoinClassroomCode(event.target.value)}
      />
    </Modal>
  </Container>
}

export default Onboard
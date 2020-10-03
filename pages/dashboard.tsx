import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'
import { useRequireUser, useAuthedData } from 'lib/client/hooks'

import { CgMathPlus } from 'react-icons/cg'

import { FC, useState } from 'react'
import Container from 'components/container'
import Card from 'components/card'
import Modal from 'components/modal'
import Button from 'components/button'
import Input from 'components/input'
import { Classroom } from 'lib/isomorphic/types'
import Dropdown from 'components/dropdown'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'
import { authedDataFetcher } from 'lib/client/helpers'
import { useRouter } from 'next/router'

const Dashboard: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading, '/')
  
  const [ showAddMenu, setShowAddMenu ] = useState(false)

  const [showCreateClassroom, setShowCreateClassroom] = useState(false)
  const [createClassroomName, setCreateClassroomName] = useState('')

  const [showJoinClassroom, setShowJoinClassroom] = useState(false)
  const [joinClassroomCode, setJoinClassroomCode] = useState('')

  const classes = useAuthedData<{
    member: Classroom[],
    owner: Classroom[],
  }>('/api/classrooms/list', user)

  const joinClassroom = async (id: string) => {
    await authedDataFetcher('/api/classrooms/join', user, {
      token: id
    })
  }

  const newClassroom = async (name: string) => {
    await authedDataFetcher('/api/classrooms/new', user, {
      name: name
    })
  }

  if(loading) return <div>loading...</div>
  return <>
  <style jsx>{`
.topnav {
  overflow: hidden;
  background-color: var(--color-background-alt);

  display: grid;
  grid-template-columns: 5fr 1fr;
  padding: 0 24px;
}

a {
  text-decoration: none;
  color: var(--color-foreground);
}

.options {
  display: flex;
  align-items: center;
}
.options > * {
  margin: 0 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}
`}
</style>

  <nav className="topnav">
    <h2>Educal</h2>
    <div className="options">
      <span onClick={() => setShowAddMenu(!showAddMenu)}>
        <CgMathPlus size="1.5rem" />  
      </span> 
      <Dropdown items={[
        {
          label: "Join a class",
          callback :() => setShowJoinClassroom(true)
        },
        {
          label: "Create a class",
          callback: () => setShowCreateClassroom(true)
        }
      ]} visible={showAddMenu}/>
      <p>{ user.displayName }</p> 
    </div>
  </nav>
  <Container>
    <h3>Your classes</h3>
    <div className="grid">
      { classes.data ? [...classes.data.member, ...classes.data.owner].map(classroom => (
        <Card 
          title={classroom.name} 
          subtitle={classroom.owner.name} 
          description='450/500 points' 
          link={`/class/${classroom.id}`}
          key={classroom.id}
        />
      )) : ''}
      
    </div>
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
  </>
}

export default Dashboard
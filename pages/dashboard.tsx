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
import Dropdown from 'components/dropdown'
import { FullscreenLoader } from 'components/loader'

import { Classroom, SensoredClassroom } from 'lib/isomorphic/types'
import { authedDataFetcher, logout } from 'lib/client/helpers'
import { sensorClass } from 'lib/server/helpers'
import { useRouter } from 'next/router'

const Dashboard: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  useRequireUser(user, loading, '/')
  
  const [ showAddMenu, setShowAddMenu ] = useState(false)
  const [ showProfileMenu, setShowProfileMenu ] = useState(false)


  const [showCreateClassroom, setShowCreateClassroom] = useState(false)
  const [createClassroomName, setCreateClassroomName] = useState('')

  const [showJoinClassroom, setShowJoinClassroom] = useState(false)
  const [joinClassroomCode, setJoinClassroomCode] = useState('')

  const classes = useAuthedData<{
    member: SensoredClassroom[],
    owner: Classroom[],
  }>('/api/classrooms/list', user)

  const joinClassroom = async (id: string) => {
    setShowJoinClassroom(false)
    await authedDataFetcher('/api/classrooms/join', user, {
      token: id
    })
    classes.revalidate()
  }

  const newClassroom = async (name: string) => {
    setShowCreateClassroom(false)
    await authedDataFetcher('/api/classrooms/new', user, {
      name: name
    })
    classes.revalidate()
  }

  if(loading) return <FullscreenLoader />


  const router = useRouter()
  if(!user) return <></>
  return <>
  <style jsx>{`
.topnav {
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  justify-content: flex-start;
}

div.dropdown {
  position: relative;
}

progress {
  background: var(--color-background);
  border: none;
  width: 75%;
  height: 15px;
}
progress[value]::-webkit-progress-value {
  background: var(--color-accent);
}
progress[value]::-moz-progress-bar {
  background: var(--color-accent);
}
progress[value]::-ms-fill {
  background: var(--color-accent);
}
`}
</style>

  <nav className="topnav">
    <h2>educal</h2>
    <div className="options">
      <div className="dropdown" onClick={() => setShowAddMenu(!showAddMenu)}>
          <CgMathPlus size="1.5rem" />  
          <Dropdown items={[
            {
              label: "Join a class",
              callback :() => setShowJoinClassroom(true)
            },
            {
              label: "Create a class",
              callback: () => setShowCreateClassroom(true)
            }
          ]} visible={showAddMenu} setVisible={setShowAddMenu}/>
      </div>
      <div className="dropdown" onClick={() => setShowProfileMenu(!showProfileMenu)}>
          <p>{ user.displayName }</p> 
          <Dropdown items={[
            {
              label: "Logout",
              callback: logout
            }
          ]} visible={showProfileMenu} setVisible={setShowProfileMenu}/>
      </div>
    </div>
  </nav>
  <Container>
    <div> 
    { classes.data && (classes.data.member.length > 0 || classes.data.owner.length > 0)? (
      <>
        <h3>Your classes</h3>
        <div className="grid">
          { classes.data.member.map(classroom => (
            <Card 
              title={classroom.name} 
              subtitle={classroom.owner.name} 
              link={`/class/${classroom.id}`}
              key={classroom.id}
            >
              <>
              <div className="progress">
              <p>{Math.min(classroom.points, 500)}/500 points</p>
              <progress value={classroom.points} max ={500}></progress>
              </div>
              { classroom.points >= 500 ? (
                <Button bg="background-light" fg="accent" m={{y: 16}} onClick={() => router.push(`/class/${classroom.id}`)}>Redeem points!</Button>
              ): ""}
              </>
            </Card>
            ))}
        { classes.data.owner.map(classroom => (
            <Card 
            title={classroom.name} 
            subtitle={classroom.owner.name} 
            description={`Join at ${classroom.id}`}
            link={`/class/${classroom.id}`}
            key={classroom.id}
            />
            ))}
        </div>
      </>
    ) : (
      <>
        <h3>You don't have any classes yet, maybe try joining or adding one</h3>
        <Button onClick={() => setShowCreateClassroom(true)}>Create a classroom</Button>
        <Button onClick={() => setShowJoinClassroom(true)}>Join a classroom</Button>
      </>
    )}
      
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
        <Button onClick={() => joinClassroom(joinClassroomCode)}>Join!</Button>
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
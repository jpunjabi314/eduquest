import { useAuthState } from 'react-firebase-hooks/auth'
import firebase from 'lib/client/firebase'

import { FC, useState } from 'react'
import Container from 'components/container'
import Card from 'components/card'
import { useRouter } from 'next/router'

import { useAuthedData } from 'lib/client/hooks'
import { Classroom, GiftCard, SensoredClassroom } from 'lib/isomorphic/types'
import { FullscreenLoader } from 'components/loader'
import Button from 'components/button'
import { authedDataFetcher } from 'lib/client/helpers'
import Input from 'components/input'
import Modal from 'components/modal'

const ClassPage: FC = () => {
  const [ user, loading ] = useAuthState(firebase.auth())
  const [pointsToGive, setPointsToGive] = useState("")
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [redeemedCard, setRedeemedCard] = useState<GiftCard>(null)

  const router = useRouter()

  const { token } = router.query; 

  const classroom = useAuthedData<{
    relation: 'student' | 'teacher',
    data: Classroom | SensoredClassroom
  }>(`/api/classrooms/get/${token}`, user)

  if(classroom.data) {
    if(classroom.data.relation == 'teacher') {

      const addPoints = async (points: number, member: string) => {
        if(points){
          await authedDataFetcher('/api/points/update', user, {
            token: classroom.data.data.id,
            points,
            member: member
          })
          classroom.revalidate()
        }
      }

      return <Container>
        <h1>{classroom.data.data.name}</h1>
        <p>Invite more students: {classroom.data.data.id}</p>

        <div className="student-list">
          {(classroom.data.data as Classroom).complex.map(student => (
            <Card 
              title={student.name}
              subtitle={`${student.points}/500 points`}
              children={<>
                <Button bg="background-light" onClick={() => addPoints(1, student.uid)}>Quick add 1 point</Button>
                <br/>
                <Input id="points" label="Points to add" value={pointsToGive} onChange={value =>setPointsToGive(value.target.value)} border={true}/>
                <Button bg="background-light" onClick={() => addPoints(parseInt(pointsToGive), student.uid)} m={{y: 6}}>Add custom points</Button>
              </>}
            />
          ))}
        </div>

        <style jsx>{`
        .student-list {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
        }
        `}</style>
      </Container>
    } else {

      const redeemPoints = async (kind: string) => {
        const card = await authedDataFetcher('/api/redeem', user, {
          token: classroom.data.data.id,
          kind
        })
        setRedeemedCard(card)
        classroom.revalidate()
      }

      return <Container>
        <h1>{classroom.data.data.name}</h1>
        <h3>{classroom.data.data.owner.name}</h3>

        <p>You have {(classroom.data.data as SensoredClassroom).points}/500 points</p>
        { (classroom.data.data as SensoredClassroom).points >= 500 ? 
        <>
          <Button bg="background-light" fg="accent" m={{y: 16}} onClick={() => setShowRedeemModal(true)}>Redeem points...</Button>
        </> : 
        <p>{['Keep working at it!', 'Don\'t worry, you\'ll get there', 'You can do this!'][Math.floor(Math.random() * 3)]}</p>
        }

      <Modal 
        title="Redeem a card..."
        visible={showRedeemModal} 
        controls={''}
        setVisible={()=> setShowRedeemModal(false)}
      >
        {redeemedCard ? <>
          <p>Your card info is:</p>
          <ul>
            <li>Card Number: {redeemedCard.card}</li>
            <li>Pin Number: {redeemedCard.pin}</li>
            <li>Type of Card: {redeemedCard.kind}</li>
          </ul>
        </> : <>
          <p>Your options are:</p>
          <div>
          <Button onClick={() => redeemPoints('Amazon')}>Amazon</Button>
          <Button onClick={() => redeemPoints('Apple')}>Apple</Button>
          <Button onClick={() => redeemPoints('Visa')}>Visa</Button>
          </div>
          <small>disclamer: card numbers are for demonstration purposes only and don't function</small>
        </>}
      </Modal>
      </Container>
    }
  } else if(classroom.error) {
    router.push('/')
    return <></>
  } else {
    return <FullscreenLoader />
  }
}

export default ClassPage
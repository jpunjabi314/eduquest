import { authenticate, sendError, sensorClass } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Classroom, SensoredClassroom } from 'lib/isomorphic/types'


export default authenticate(async (req, res, user) => {

  const classrooms = firebase.firestore().collection('classrooms')
  const memberClassrooms = await classrooms.where('members', 'array-contains', user.uid).get()
  const ownedClassrooms = await classrooms.where('owner.uid', '==', user.uid).get()

  return res.status(200).json({
    member: memberClassrooms.docs.map(classroom => {
      return sensorClass(classroom.data() as Classroom)
    }),
    owner: ownedClassrooms.docs.map(classroom => {
      return classroom.data() as Classroom
    }),
  })
})
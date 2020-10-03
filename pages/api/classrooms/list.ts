import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

// import { firestore } from 'firebase/app'

export default authenticate(async (req, res, user) => {

  const classrooms = firebase.firestore().collection('classrooms')
  const memberClassrooms = await classrooms.where('members', 'array-contains', user.uid).get()
  const ownedClassrooms = await classrooms.where('owner.uid', '==', user.uid).get()

  console.log(ownedClassrooms.size)

  return res.status(200).json({
    member: memberClassrooms.docs.map(classroom => {
      return classroom.data()
    }),
    owner: ownedClassrooms.docs.map(classroom => {
      return classroom.data()
    }),
  })
})
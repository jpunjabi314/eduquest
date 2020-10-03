import { authenticate, sendError, sensorClass } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Classroom } from 'lib/isomorphic/types';

export default authenticate(async (req, res, user) => {

  const token = req.query.token as string;
  
  if (!token) return sendError({ message: "No token provided"}, req, res)

  const classrooms = firebase.firestore().collection('classrooms')
  const queried = await classrooms.doc(token).get()

  if(!queried.exists) {
    return res.status(404).json({
      message: 'Class not found'
    })
  }
  const classroom = await queried.data() as Classroom

  if(classroom?.owner?.uid === user.uid) {
    return res.status(200).json({
      relation: 'teacher',
      data: classroom
    })
  }
  if(classroom.members.includes(user.uid)) {
    return res.status(200).json({
      relation: 'student',
      data: sensorClass(classroom)
    })
  }

  return res.status(404).json({
    message: 'Class not found'
  })
})
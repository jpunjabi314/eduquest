import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

// import { firestore } from 'firebase/app'

export default authenticate(async (req, res, user) => {

  const { token } = req.body;
  if (!token) sendError({ message: "No token provided"}, req, res)

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

  const ref = firebase.firestore().collection('classrooms').doc(token)

  await ref.update({
    members: arrayUnion(user.uid)
  })

  return res.status(200).json({
    message: `Successfully joined classroom`
  })
})
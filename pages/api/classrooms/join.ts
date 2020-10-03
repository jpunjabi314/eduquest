import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

export default authenticate(async (req, res, user) => {

  const { token } = req.body;
  if (!token) return sendError({ message: "No token provided"}, req, res)

  const arrayUnion = firebase.firestore.FieldValue.arrayUnion;

  const ref = firebase.firestore().collection('classrooms').doc(token)

  if((await ref.get()).data().owner.uid == user.uid) {
    return sendError({
      status: 400,
      message: "The class that you're trying to join is owned by you"
    }, req, res)
  }

  await ref.update({
    members: arrayUnion(user.uid)
  })

  return res.status(200).json({
    message: `Successfully joined classroom`
  })
})
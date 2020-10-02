import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

import { customAlphabet } from 'nanoid'

export default authenticate(async (req, res, user) => {

  const name = req.body.name;
  if (!name) sendError({ message: "No name provided"}, req, res)

  // TODO: add check for if the code exists
  const nanoid = customAlphabet('0123456789abcdef', 6)

  const token =  nanoid()

  firebase.firestore().collection('classrooms').doc(token).set({
    id: token,
    name,
    owner: user.uid,
    members: []
  })

  return res.status(200).json({
    message: `This came from an authenticated API request by ${user.displayName}.`
  })
})
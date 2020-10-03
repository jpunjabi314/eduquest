import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

import { customAlphabet } from 'nanoid'

export default authenticate(async (req, res, user) => {

  const name = req.body.name;
  if (!name) return sendError({ message: "No name provided"}, req, res)

  // TODO: add check for if the code exists
  const nanoid = customAlphabet('0123456789abcdef', 6)

  const token =  nanoid()

  await (firebase.firestore().collection('classrooms').doc(token).set({
    id: token,
    name,
    owner: {
      uid: user.uid,
      name: user.displayName
    },
    members: []
  }))

  return res.status(200).json({
    token
  })
})
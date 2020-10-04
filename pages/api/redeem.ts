import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Classroom } from 'lib/isomorphic/types';
import { customAlphabet } from 'nanoid';

export default authenticate(async (req, res, user) => {

  const { token, kind } = req.body;
  if (!token) return sendError({ message: "No token provided"}, req, res)
  if (!kind) return sendError({ message: "No kind provided"}, req, res)

  const card = customAlphabet('0123456789', 16)
  const pin = customAlphabet('0123456789', 3)


  try {
    const classroom = await firebase.firestore().collection('classrooms').doc(token).get()
    const data = (await classroom.data()) as Classroom
    if(data.complex.some(member => member.uid === user.uid && member.points >= 500)) {

      let updated = data.complex.map(complexMember => {
        if(complexMember.uid === user.uid) complexMember.points = complexMember.points - 500
        return complexMember
      })
      classroom.ref.update({
        complex: updated
      })

      return res.status(200).json({
        card: card(),
        pin: pin(),
        kind: kind
      })
    } else {
      return res.status(400).json({
        message: "You do not have enough points"
      })
    }
  } catch {
    return res.status(404).json({
      message: "Class not found"
    })
  }
})
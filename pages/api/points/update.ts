import { authenticate, sendError } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'
import { Classroom } from 'lib/isomorphic/types';

export default authenticate(async (req, res, user) => {

  const { token, member, points } = req.body;
  if (!token) return sendError({ message: "No token provided"}, req, res)
  if (!member) return sendError({ message: "No member provided"}, req, res)
  if (!points) return sendError({ message: "No point count provided"}, req, res)

  try {
    const classroom = await (await firebase.firestore().collection('classrooms').doc(token).get())

    if(classroom.data().owner.uid === user.uid) {
      const complexMembers = (classroom.data() as Classroom).complex;

      let updated = complexMembers.map(complexMember => {
        if(complexMember.uid === member) complexMember.points = complexMember.points + parseInt(points)
        return complexMember
      })
      classroom.ref.update({
        complex: updated
      })

      return res.status(200).json({})
    } else {
      return res.status(403).json({
        message: "You do not own this class"
      })
    }
  } catch {
    return res.status(404).json({
      message: "Class not found"
    })
  }
})
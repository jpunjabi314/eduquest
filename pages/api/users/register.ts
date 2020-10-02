import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

export default authenticate(async (req, res, user) => {
  const users = await firebase.firestore().collection('users')
  const count = (await users.where('uid', '==', user.uid).get()).size

  if (count == 0) {
    await users.add({
      uid: user.uid,
      type: req.body.teacher ? 'teacher' : 'student'
    })
    
    return res.status(200).json({
      message: `User has been successfully registered`
    })
  } else {
    return res.status(400).json({
      message: `User already registered`
    })
  }

})
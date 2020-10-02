import { authenticate } from 'lib/server/helpers'
import firebase from 'lib/server/firebase'

export default authenticate(async (req, res, user) => {
  return res.status(200).json({
    message: `This came from an authenticated API request by ${user.displayName}.`
  })
})
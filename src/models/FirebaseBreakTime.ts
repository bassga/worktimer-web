import { Timestamp } from 'firebase/firestore'

type FirebaseBreakTime = {
  breakStart: Timestamp | null
  breakEnd: Timestamp | null
}

export default FirebaseBreakTime

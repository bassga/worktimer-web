import { Timestamp } from 'firebase/firestore'
import { WorkStatus } from 'src/models/Type/WorkStatus'
import FirebaseBreakTime from './FirebaseBreakTime'

type FirebaseWorkTime = {
  startTime: Timestamp | null
  endTime: Timestamp | null
  restTimeList: Array<FirebaseBreakTime>
  workStatus: WorkStatus
} | null

export default FirebaseWorkTime

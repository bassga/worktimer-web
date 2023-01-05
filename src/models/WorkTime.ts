import BreakTime from 'src/models/BreakTime'
import { WorkStatus } from './Type/WorkStatus'

type WorkTime = {
  startTime: Date | null
  endTime: Date | null
  restTimeList: Array<BreakTime>
  workStatus: WorkStatus
} | null

export default WorkTime

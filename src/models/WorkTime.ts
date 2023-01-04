import BreakTime from 'src/models/BreakTime'
import { RestStatus } from './Type/RestStatus'
import { WorkStatus } from './Type/WorkStatus'

type WorkTime = {
  startTime: Date | null
  endTime: Date | null
  restTimeList: Array<BreakTime>
  restStatus: RestStatus
  workStatus: WorkStatus
} | null

export default WorkTime

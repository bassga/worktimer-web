import BreakTime from 'src/models/BreakTime'

type WorkTime = {
  startTime: String
  endTime: String
  restTimeList: Array<BreakTime>
}

export default WorkTime

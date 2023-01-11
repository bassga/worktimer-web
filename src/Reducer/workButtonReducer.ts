import { WorkStatus } from '../models/Type/WorkStatus'
import WorkButton from '../models/WorkButton'

const initButtonStatus: WorkButton = {
  workButtonText: '出勤',
  workButtonColor: 'primary',
  workButtonEnable: true,
  restButtonText: '休憩',
  restButtonColor: 'success',
  restButtonEnable: false,
}

const workButtonReducer = (
  workState: WorkButton,
  action: String | undefined,
): WorkButton => {
  switch (action) {
    case WorkStatus.WORKING:
      return {
        ...workState,
        workButtonText: '退勤',
        workButtonColor: 'danger',
        workButtonEnable: true,
        restButtonText: '休憩開始',
        restButtonColor: 'warning',
        restButtonEnable: true,
      }
    case WorkStatus.BREAK_TIME:
      return {
        ...workState,
        workButtonText: '退勤',
        workButtonColor: 'danger',
        workButtonEnable: false,
        restButtonText: '休憩終了',
        restButtonColor: 'success',
        restButtonEnable: true,
      }
    case WorkStatus.GO_HOME:
      return {
        ...workState,
        workButtonText: '退勤済み',
        workButtonColor: 'danger',
        workButtonEnable: false,
        restButtonText: '休憩開始',
        restButtonColor: 'warning',
        restButtonEnable: false,
      }
    default:
      return {
        ...workState,
        workButtonText: '出勤',
        workButtonColor: 'primary',
        workButtonEnable: true,
        restButtonText: '休憩開始',
        restButtonColor: 'success',
        restButtonEnable: false,
      }
  }
}

export { workButtonReducer, initButtonStatus }

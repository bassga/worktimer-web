import { getAuth, signOut, User } from 'firebase/auth'
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useReducer } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getFirebaseAuth } from 'src/firebase'
import WorkTime from 'src/models/WorkTime'
import TodaysWorkDataAPI from 'src/TodaysWorkDataAPI'
import { WorkStatus } from '../models/Type/WorkStatus'
import {
  initButtonStatus,
  workButtonReducer,
} from '../Reducer/workButtonReducer'

const Home = () => {
  const auth = getAuth()
  const user = (auth.currentUser as User)?.uid
  const date = new Date()
  const today = date.toLocaleDateString().replaceAll('/', '-')
  const yearMonth = `${String(date.getFullYear())}-${String(
    date.getMonth() + 1,
  )}`
  const navigation = useNavigate()
  const { todaysWorkData } = TodaysWorkDataAPI()

  const [workButtonStatus, workButtonDispatch] = useReducer(
    workButtonReducer,
    initButtonStatus,
  )

  useEffect(() => {
    workButtonDispatch(todaysWorkData?.workStatus)
  }, [todaysWorkData])

  const db = getFirestore()
  const docRef = doc(db, 'users', user, yearMonth, today)

  const handleLogout = () => {
    signOut(getFirebaseAuth())
    navigation('/login')
  }
  const timeCard = async (event: React.MouseEvent) => {
    event.preventDefault()
    if (todaysWorkData) {
      // 退勤
      todaysWorkData.endTime = new Date()
      const endWork: WorkTime = {
        startTime: todaysWorkData.startTime,
        endTime: new Date(),
        restTimeList: todaysWorkData.restTimeList,
        workStatus: WorkStatus.GO_HOME,
      }
      updateDoc(docRef, { [today]: endWork }).then(() => {
        window.location.reload()
      })
    } else {
      // 出勤
      const startWork: WorkTime = {
        startTime: new Date(),
        endTime: null,
        restTimeList: [],
        workStatus: WorkStatus.WORKING,
      }

      setDoc(docRef, { [today]: startWork }).then(() => {
        window.location.reload()
      })
    }
  }

  const handleRest = async (event: React.MouseEvent) => {
    event.preventDefault()
    if (todaysWorkData == null) return
    switch (todaysWorkData.workStatus) {
      case WorkStatus.WORKING: {
        todaysWorkData.restTimeList.push({
          breakStart: new Date(),
          breakEnd: null,
        })
        const restWork: WorkTime = {
          startTime: todaysWorkData.startTime,
          endTime: null,
          restTimeList: todaysWorkData.restTimeList,
          workStatus: WorkStatus.BREAK_TIME,
        }
        updateDoc(docRef, { [today]: restWork }).then(() => {
          window.location.reload()
        })
        break
      }
      case WorkStatus.BREAK_TIME: {
        const lastRestIndex = todaysWorkData.restTimeList.length - 1
        todaysWorkData.restTimeList[lastRestIndex].breakEnd = new Date()
        const restWork: WorkTime = {
          startTime: todaysWorkData.startTime,
          endTime: null,
          restTimeList: todaysWorkData.restTimeList,
          workStatus: WorkStatus.WORKING,
        }
        updateDoc(docRef, { [today]: restWork }).then(() => {
          window.location.reload()
        })
        break
      }
      default:
        break
    }
  }

  return (
    <React.Fragment>
      <div> Home Component</div>
      <Button
        variant={workButtonStatus.workButtonColor}
        disabled={!workButtonStatus.workButtonEnable}
        onClick={(event) => timeCard(event)}
      >
        {workButtonStatus.workButtonText}
      </Button>
      <Button
        disabled={!workButtonStatus.restButtonEnable}
        onClick={handleRest}
        variant={workButtonStatus.restButtonColor}
      >
        {workButtonStatus.restButtonText}
      </Button>
      <Button onClick={handleLogout} variant="secondary">
        ログアウト
      </Button>
    </React.Fragment>
  )
}

export default Home

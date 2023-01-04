import { getAuth, signOut, User } from 'firebase/auth'
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getFirebaseAuth } from 'src/firebase'
import BreakTime from 'src/models/BreakTime'
import WorkTime from 'src/models/WorkTime'
import { RestStatus } from '../models/Type/RestStatus'
import { WorkStatus } from '../models/Type/WorkStatus'
const Home = () => {
  const auth = getAuth()
  const user = (auth.currentUser as User)?.uid
  const today: string = new Date().toLocaleDateString().replaceAll('/', '-')

  const navigation = useNavigate()
  const [buttonText, setButtonText] = useState('出勤')
  const [buttonColor, setButtonColor] = useState('primary')

  // 退勤済みか
  const [isWorkFinish, setWorkFinishStatus] = useState(false)
  const testBreakItem: BreakTime = {
    breakStart: null,
    breakEnd: null,
  }

  const [todaysWorkData, setTodaysWorkData] = useState(null as WorkTime)
  useEffect(() => {
    const fetchResult = async () => {
      const todayData: WorkTime = (await getDoc(docRef)).get(today) ?? null
      setTodaysWorkData(todayData)
      if (todayData) {
        if (todayData.endTime) {
          setWorkFinishStatus(true)
          return
        }
        if (todayData.startTime) {
          setButtonText('退勤')
          setButtonColor('danger')
        }
      }
    }
    fetchResult()
  }, [isWorkFinish, buttonText, buttonColor])

  const db = getFirestore()
  const docRef = doc(db, 'users', user)

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
        restStatus: RestStatus.HOME,
        workStatus: WorkStatus.HOME,
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
        restStatus: RestStatus.WORKING,
        workStatus: WorkStatus.WORKING,
      }
      setDoc(docRef, { [today]: startWork }).then(() => {
        window.location.reload()
      })
    }
  }

  return (
    <React.Fragment>
      <div> Home Component</div>
      <Button
        variant={buttonColor}
        disabled={isWorkFinish}
        onClick={(event) => timeCard(event)}
      >
        {buttonText}
      </Button>
      <button onClick={handleLogout}>ログアウト</button>
    </React.Fragment>
  )
}

export default Home

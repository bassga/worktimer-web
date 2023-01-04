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
const Home = () => {
  const auth = getAuth()
  const user = (auth.currentUser as User)?.uid
  const today: string = new Date().toLocaleDateString().replaceAll('/', '-')

  console.dir(today)
  const navigation = useNavigate()
  const [buttonText, setButtonText] = useState('出勤')
  const [buttonColor, setButtonColor] = useState('primary')
  // const buttonColor = isWorking ? 'danger' : 'primary'

  // 退勤済みか
  const [isWorkFinish, setWorkFinishStatus] = useState(false)
  const testBreakItem: BreakTime = {
    breakStart: new Date(),
    breakEnd: null,
  }

  const testWorkTime: WorkTime = {
    startTime: '',
    endTime: '',
    restTimeList: [testBreakItem],
  }

  const [todaysWorkData, setTodaysWorkData] = useState(testWorkTime)
  useEffect(() => {
    const fetchResult = async () => {
      const todayData: WorkTime = (await getDoc(docRef)).get(today) ?? null
      setTodaysWorkData(todayData)
      console.dir(today)
      if (todayData) {
        if (todayData.endTime) {
          setWorkFinishStatus(true)
          return
        }
        if (todayData.startTime) {
          console.dir('start is exist')
          setButtonText('退勤')
          setButtonColor('danger')
        }
      }
    }
    fetchResult()
  }, [isWorkFinish, buttonText, buttonColor])
  console.dir(todaysWorkData)

  const db = getFirestore()
  const docRef = doc(db, 'users', user)
  console.dir(docRef)

  const handleLogout = () => {
    signOut(getFirebaseAuth())
    navigation('/login')
  }
  const timeCard = async (event: React.MouseEvent) => {
    event.preventDefault()
    console.dir(todaysWorkData)
    if (todaysWorkData.startTime) {
      console.dir(todaysWorkData.endTime)
      todaysWorkData.endTime = String(new Date())
      console.dir(todaysWorkData)
      updateDoc(docRef, { [today]: todaysWorkData }).then(() => {
        window.location.reload()
      })
    } else {
      todaysWorkData.startTime = String(new Date())
      setDoc(docRef, { [today]: todaysWorkData }).then(() => {
        console.dir('success')
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

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
import WorkTime from 'src/models/WorkTime'
import { WorkStatus } from '../models/Type/WorkStatus'
const Home = () => {
  const auth = getAuth()
  const user = (auth.currentUser as User)?.uid
  const today: string = new Date().toLocaleDateString().replaceAll('/', '-')

  const navigation = useNavigate()
  const [buttonText, setButtonText] = useState('出勤')
  const [buttonColor, setButtonColor] = useState('primary')
  const [buttonEnable, setButtonEnable] = useState(true)
  const [restButtonText, setRestButtonText] = useState('休憩')
  const [restButtonColor, setRestButtonColor] = useState('success')
  const [restButtonEnable, setRestButtonEnable] = useState(false)

  const [todaysWorkData, setTodaysWorkData] = useState(null as WorkTime)
  useEffect(() => {
    const fetchResult = async () => {
      const todayData: WorkTime = (await getDoc(docRef)).get(today) ?? null
      setTodaysWorkData(todayData)

      if (todayData) {
        switch (todayData.workStatus) {
          case WorkStatus.BREAK_TIME:
            // 休憩中
            setButtonText('退勤')
            setButtonEnable(false)
            setButtonColor('danger')
            setRestButtonText('休憩終了')
            setRestButtonEnable(true)
            setRestButtonColor('warning')
            return
          case WorkStatus.WORKING:
            // 作業中
            setButtonText('退勤')
            setButtonEnable(true)
            setButtonColor('danger')
            setRestButtonText('休憩開始')
            setRestButtonEnable(true)
            setRestButtonColor('success')
            return
          case WorkStatus.GO_HOME:
            setButtonText('退勤済み')
            setButtonEnable(false)
            setButtonColor('danger')
            setRestButtonText('休憩終了')
            setRestButtonEnable(false)
            setRestButtonColor('warning')
            return
          default:
            break
        }
      } else {
        setButtonText('出勤')
        setButtonEnable(true)
        setButtonColor('primary')
        setRestButtonText('休憩')
        setRestButtonEnable(false)
        setRestButtonColor('success')
        return
      }
    }
    fetchResult()
  })

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
        variant={buttonColor}
        disabled={!buttonEnable}
        onClick={(event) => timeCard(event)}
      >
        {buttonText}
      </Button>
      <Button
        disabled={!restButtonEnable}
        onClick={handleRest}
        variant={restButtonColor}
      >
        {restButtonText}
      </Button>
      <Button onClick={handleLogout} variant="secondary">
        ログアウト
      </Button>
    </React.Fragment>
  )
}

export default Home

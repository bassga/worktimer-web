import { getAuth, User } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import WorkTime from './models/WorkTime'

export default function TodaysWorkDataAPI() {
  const [todaysWorkData, setTodaysWorkData] = useState<WorkTime | null>(null)
  const auth = getAuth()
  const user = (auth.currentUser as User)?.uid
  const date = new Date()
  const today = date.toLocaleDateString().replaceAll('/', '-')
  const yearMonth = `${String(date.getFullYear())}-${String(
    date.getMonth() + 1,
  )}`
  const db = getFirestore()
  const docRef = doc(db, 'users', user, yearMonth, today)
  useEffect(() => {
    getDoc(docRef).then((result) => {
      setTodaysWorkData(result.get(today))
    })
  }, [])
  return { todaysWorkData, setData: setTodaysWorkData }
}

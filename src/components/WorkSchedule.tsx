import { getAuth, User } from 'firebase/auth'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { ReactElement, useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { WorkStatus } from 'src/models/Type/WorkStatus'
import WorkTime from 'src/models/WorkTime'
import BreakTime from '../models/BreakTime'
import FirebaseBreakTime from '../models/FirebaseBreakTime'
import FirebaseWorkTime from '../models/FirebaseWorkTIme'

const WorkSchedule = () => {
  const date = new Date()
  const dateCount: number = new Date(
    Number(date.getFullYear()),
    Number(date.getMonth() + 1),
    0,
  ).getDate()
  // const schedule: Array<WorkTime> = []
  const [schedule, setSchedule] = useState<Array<WorkTime>>([])
  const [list, setList] = useState<Array<ReactElement>>()
  const baseSchedule: Array<WorkTime> = []
  for (let index = 0; index < dateCount; index++) {
    baseSchedule.push({
      startTime: null,
      endTime: null,
      restTimeList: [],
      workStatus: WorkStatus.NO_WORK,
    })
  }
  const auth = getAuth()
  const user = (auth.currentUser as User)?.uid
  const db = getFirestore()
  const yearMonth = `${String(date.getFullYear())}-${String(
    date.getMonth() + 1,
  )}`
  const collectionRef = collection(db, 'users', user, yearMonth)
  useEffect(() => {
    getDocs(collectionRef).then((result) => {
      result.forEach((doc) => {
        const index = Number(Object.keys(doc.data())[0].split('-')[2]) - 1
        const targetDay = Object.keys(doc.data())[0]
        const workTimeData: FirebaseWorkTime = doc.data()[targetDay]
        baseSchedule[index] = {
          startTime: workTimeData?.startTime?.toDate() ?? null,
          endTime: workTimeData?.endTime?.toDate() ?? null,
          restTimeList:
            workTimeData?.restTimeList.map((restTime: FirebaseBreakTime) => {
              return {
                breakStart: restTime.breakStart?.toDate(),
                breakEnd: restTime.breakEnd?.toDate(),
              } as BreakTime
            }) ?? [],
          workStatus: workTimeData?.workStatus ?? WorkStatus.NO_WORK,
        }
      })
      setSchedule(baseSchedule)
    })
  }, [])
  console.dir(schedule)
  useEffect(() => {
    let list
    list = schedule.map((work: WorkTime, index) => (
      <tr key={index}>
        <td>{index}</td>
        <td>{work?.startTime?.toString()}</td>
        <td>{work?.endTime?.toString()}</td>
        <td>{work?.workStatus?.toString()}</td>
      </tr>
    ))
    setList(list)
  }, [schedule])

  return (
    <>
      <div> Work Schedule</div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </Table>
    </>
  )
}
export default WorkSchedule

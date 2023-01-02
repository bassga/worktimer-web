import { signOut } from 'firebase/auth'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getFirebaseAuth } from 'src/firebase'
const Home = () => {
  const navigation = useNavigate()
  const handleLogout = () => {
    signOut(getFirebaseAuth())
    navigation('/login')
  }
  return (
    <React.Fragment>
      <div> Home Component</div>
      <button onClick={handleLogout}>ログアウト</button>
    </React.Fragment>
  )
}

export default Home

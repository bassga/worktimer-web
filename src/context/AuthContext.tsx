import { getAuth } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'src/firebase'

type AuthContextProps = {
  user: User | null
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
})

export function useAuthContext() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<Boolean>(true)

  const value = {
    user,
    loading,
  }

  useEffect(() => {
    const auth = getAuth()
    const unsubscribed = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return () => {
      unsubscribed()
    }
  }, [])

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

import { Navigate, RouteProps } from 'react-router-dom'
import { useAuthContext } from 'src/context/AuthContext'

const PublicRoute = (props: RouteProps) => {
  const { children } = props
  const { user } = useAuthContext()
  return user ? (
    <>
      <Navigate to={'/'} />
    </>
  ) : (
    <>{children}</>
  )
}

export default PublicRoute

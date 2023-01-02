import { Navigate, RouteProps } from 'react-router-dom'
import { useAuthContext } from 'src/context/AuthContext'

const PrivateRoute = (props: RouteProps) => {
  const { user } = useAuthContext()
  const { children } = props
  if (!user) {
    return (
      <>
        <Navigate to="/login" />
      </>
    )
  }
  return <>{children}</>
}

export default PrivateRoute

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import 'src/App.css'
import { AuthProvider } from 'src/context/AuthContext'
import SignUp from 'src/context/SignUp'
import { NotFound } from 'src/routes/NotFound'
import PrivateRoute from 'src/routes/PrivateRoute'
import PublicRoute from 'src/routes/PublicRoute'
import Home from './components/Home'
import Login from './context/Login'

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: '2em' }}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  )
}

export default App

import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'

import PublicRoute from './routes/PublicRoute'
import ProtectedRoute from './routes/ProtectedRoute'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute>
        <Home />
      </ProtectedRoute>} />
      <Route path='/sign-up' element={<PublicRoute>
        <Signup />
      </PublicRoute>} />
      <Route path='/login' element={<PublicRoute>
        <Login />
      </PublicRoute>} />

     
    </Routes>
  )
}

export default App
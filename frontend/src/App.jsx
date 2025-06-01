import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute>
        <Home />
      </ProtectedRoute>} />
      <Route path='/signup' element={<PublicRoute>
        <Signup />
      </PublicRoute>} />
      <Route path='/login' element={<PublicRoute>
        <Login />
      </PublicRoute>} />

     
    </Routes>
  )
}

export default App
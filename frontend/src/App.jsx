import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LostFound from './pages/LostFound'
import Events from './pages/Events'
import Feedback from './pages/Feedback'
import Clubs from './pages/Clubs'
import Profile from './pages/Profile'
import Announcements from './pages/Announcements'

function App() {
  const { token } = useAuthStore()

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  try {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="events" element={<Events />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    )
  } catch (error) {
    console.error('App error:', error)
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Error loading application</h1>
        <p>Please refresh the page or check the console for details.</p>
        <pre>{error.message}</pre>
      </div>
    )
  }
}

export default App

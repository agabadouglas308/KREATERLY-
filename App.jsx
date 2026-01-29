import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import CreatorDashboardPage from './pages/CreatorDashboardPage'
import CampaignsPage from './pages/CampaignsPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import NotFoundPage from './pages/NotFoundPage'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth()
    
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>
    }
    
    if (!user) {
        return <Navigate to="/" replace />
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />
    }
    
    return children
}

function App() {
    return (
        <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['creator', 'admin']}>
            <CreatorDashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/campaigns" element={
          <ProtectedRoute allowedRoles={['creator']}>
            <CampaignsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        
        {/* Fallback Routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
    )
}

export default App
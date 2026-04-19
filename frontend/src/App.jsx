import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import UnauthorizedPage from './pages/UnauthorizedPage.jsx'
import { useAuth, ROLES } from './context/AuthContext.jsx'
import { useBookingContext } from './context/BookingContext.jsx'

function App() {
  const { currentUser } = useAuth()
  const { toast } = useBookingContext()

  return (
    <div className="app">
      <Navbar />

      {/* Global notification toast */}
      {toast && (
        <div
          className={`notification notification-${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <main className="main-content">
        <Routes>
          {/* Public — any logged-in user */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole={ROLES.ADMIN}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Unauthorized landing */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

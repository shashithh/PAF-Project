import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { useBookingContext } from './context/BookingContext.jsx'

// Mock current user — swap to test different roles:
// { id: 'u1', name: 'Alice Tan',  role: 'USER'  }
// { id: 'u5', name: 'Eve Rahman', role: 'ADMIN' }
const currentUser = { id: 'u1', name: 'Alice Tan', role: 'USER' }

function App() {
  const { toast } = useBookingContext()

  return (
    <div className="app">
      <Navbar currentUser={currentUser} />

      {/* Global notification toast — state lives in context */}
      {toast && (
        <div className={`notification notification-${toast.type}`} role="status" aria-live="polite">
          {toast.type === 'success' ? '✅' : '❌'} {toast.message}
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<BookingPage currentUser={currentUser} />}
          />
          <Route
            path="/admin"
            element={
              currentUser.role === 'ADMIN'
                ? <AdminPage />
                : <Navigate to="/" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

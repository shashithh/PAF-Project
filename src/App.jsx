import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { useBookings } from './hooks/useBookings.js'

// Mock current user — swap to any mockUsers entry to test different roles/views
// { id: 'u1', name: 'Alice Tan', role: 'USER'  }
// { id: 'u5', name: 'Eve Rahman', role: 'ADMIN' }
const currentUser = { id: 'u1', name: 'Alice Tan', role: 'USER' }

function App() {
  const {
    bookings,
    loading,
    addBooking,
    updateBookingStatus,
    getMyBookings,
    stats,
  } = useBookings()

  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="app">
      <Navbar currentUser={currentUser} />

      {/* Global notification toast */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? '✅' : '❌'} {notification.message}
        </div>
      )}

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <BookingPage
                bookings={bookings}
                myBookings={getMyBookings(currentUser.id)}
                loading={loading}
                currentUser={currentUser}
                onAddBooking={addBooking}
                onUpdateStatus={updateBookingStatus}
                onNotify={showNotification}
              />
            }
          />
          <Route
            path="/admin"
            element={
              currentUser.role === 'ADMIN'
                ? <AdminPage
                    bookings={bookings}
                    loading={loading}
                    stats={stats}
                    onUpdateStatus={updateBookingStatus}
                    onNotify={showNotification}
                  />
                : <Navigate to="/" replace />
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

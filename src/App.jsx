import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import BookingPage from './pages/BookingPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { useBookings } from './hooks/useBookings.js'

// Mock current user — swap role to 'ADMIN' to test admin view
const currentUser = { id: 'u1', name: 'Alice', role: 'USER' }

function App() {
  const { bookings, addBooking, updateBookingStatus } = useBookings()
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
                    onUpdateStatus={updateBookingStatus}
                    onNotify={showNotification}
                  />
                : <Navigate to="/" replace />
            }
          />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

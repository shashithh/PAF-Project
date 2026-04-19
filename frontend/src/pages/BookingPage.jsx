import React from 'react'
import BookingForm from '../components/BookingForm.jsx'
import BookingList from '../components/BookingList.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

function BookingPage() {
  const { currentUser } = useAuth()
  const { bookings } = useBookingContext()

  const myBookings   = bookings.filter((b) => b.userId === currentUser.id)
  const pendingCount = myBookings.filter((b) => b.status === 'PENDING').length
  const today        = new Date().toISOString().split('T')[0]
  const todayCount   = myBookings.filter(
    (b) => b.date === today && (b.status === 'APPROVED' || b.status === 'PENDING')
  ).length

  return (
    <div className="page">
      <div className="page-header booking-page-header">
        <div className="page-header-text">
          <h1 className="page-title">Book a Resource</h1>
          <p className="page-subtitle">
            Reserve labs, rooms, and equipment on campus.
          </p>
        </div>

        {myBookings.length > 0 && (
          <div className="page-header-stats">
            {todayCount > 0 && (
              <span className="header-stat header-stat-today">📅 {todayCount} today</span>
            )}
            {pendingCount > 0 && (
              <span className="header-stat header-stat-pending">⏳ {pendingCount} pending</span>
            )}
            <span className="header-stat">📋 {myBookings.length} total</span>
          </div>
        )}
      </div>

      <div className="page-layout">
        <section className="form-section" aria-label="New booking form">
          <BookingForm currentUser={currentUser} />
        </section>

        <section className="list-section" aria-label="My bookings">
          <BookingList
            scope="user"
            currentUserId={currentUser.id}
            title="My Bookings"
          />
        </section>
      </div>
    </div>
  )
}

export default BookingPage

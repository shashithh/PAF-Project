import React from 'react'
import BookingForm from '../components/BookingForm.jsx'
import BookingList from '../components/BookingList.jsx'

function BookingPage({
  bookings,
  myBookings,
  loading,
  currentUser,
  onAddBooking,
  onUpdateStatus,
  onNotify,
}) {
  const handleCancel = (id) => {
    onUpdateStatus(id, 'CANCELLED')
    onNotify('Booking cancelled.')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Book a Resource</h1>
        <p className="page-subtitle">
          Reserve labs, rooms, and equipment on campus.
        </p>
      </div>

      <div className="page-layout">
        {/* Left: booking form */}
        <section className="form-section">
          <BookingForm
            bookings={bookings}
            currentUser={currentUser}
            onAddBooking={onAddBooking}
            onNotify={onNotify}
          />
        </section>

        {/* Right: my bookings */}
        <section className="list-section">
          <h2 className="section-title">My Bookings</h2>
          <BookingList
            bookings={myBookings}
            loading={loading}
            onCancel={handleCancel}
            showAdminControls={false}
          />
        </section>
      </div>
    </div>
  )
}

export default BookingPage

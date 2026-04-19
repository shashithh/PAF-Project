import React from 'react'
import BookingForm from '../components/BookingForm.jsx'
import BookingList from '../components/BookingList.jsx'

function BookingPage({ currentUser }) {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Book a Resource</h1>
        <p className="page-subtitle">
          Reserve labs, rooms, and equipment on campus.
        </p>
      </div>

      <div className="page-layout">
        <section className="form-section">
          <BookingForm currentUser={currentUser} />
        </section>

        <section className="list-section">
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

import React, { useState } from 'react'
import BookingCard from './BookingCard.jsx'
import '../styles/card.css'

const STATUS_FILTERS = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']

function BookingList({ bookings, onCancel, onApprove, onReject, showAdminControls }) {
  const [filter, setFilter] = useState('ALL')

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  return (
    <div className="booking-list">
      {/* Filter bar */}
      <div className="filter-bar">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            className={`filter-btn ${filter === s ? 'filter-active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={onCancel}
              onApprove={onApprove}
              onReject={onReject}
              showAdminControls={showAdminControls}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default BookingList

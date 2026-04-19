import React from 'react'
import '../styles/card.css'

const STATUS_CONFIG = {
  APPROVED:  { label: 'Approved',  className: 'status-approved'  },
  PENDING:   { label: 'Pending',   className: 'status-pending'   },
  REJECTED:  { label: 'Rejected',  className: 'status-rejected'  },
  CANCELLED: { label: 'Cancelled', className: 'status-cancelled' },
}

function BookingCard({ booking, onCancel, onApprove, onReject, showAdminControls }) {
  const { label, className } = STATUS_CONFIG[booking.status] || {}
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED'

  return (
    <div className="booking-card">
      <div className="card-header">
        <h3 className="card-resource">{booking.resourceName}</h3>
        <span className={`status-badge ${className}`}>{label}</span>
      </div>

      <div className="card-body">
        <div className="card-detail">
          <span className="detail-icon">📅</span>
          <span>{booking.date}</span>
        </div>
        <div className="card-detail">
          <span className="detail-icon">🕐</span>
          <span>{booking.startTime} – {booking.endTime}</span>
        </div>
        <div className="card-detail">
          <span className="detail-icon">📝</span>
          <span className="card-purpose">{booking.purpose}</span>
        </div>
      </div>

      <div className="card-actions">
        {/* User cancel button */}
        {!showAdminControls && canCancel && (
          <button className="btn-cancel" onClick={() => onCancel(booking.id)}>
            Cancel
          </button>
        )}

        {/* Admin approve / reject buttons */}
        {showAdminControls && booking.status === 'PENDING' && (
          <>
            <button className="btn-approve" onClick={() => onApprove(booking.id)}>
              Approve
            </button>
            <button className="btn-reject" onClick={() => onReject(booking.id)}>
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default BookingCard

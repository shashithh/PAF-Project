import React, { useState } from 'react'
import { useBookingContext } from '../context/BookingContext.jsx'
import '../styles/card.css'

/* ── Status config ─────────────────────────────────────────── */
const STATUS_CONFIG = {
  APPROVED:  { label: 'Approved',  className: 'status-approved',  icon: '✅', accent: 'accent-approved'  },
  PENDING:   { label: 'Pending',   className: 'status-pending',   icon: '⏳', accent: 'accent-pending'   },
  REJECTED:  { label: 'Rejected',  className: 'status-rejected',  icon: '❌', accent: 'accent-rejected'  },
  CANCELLED: { label: 'Cancelled', className: 'status-cancelled', icon: '🚫', accent: 'accent-cancelled' },
}

/* ── Resource icon map ─────────────────────────────────────── */
const RESOURCE_ICONS = {
  'Computer Lab A':      '🖥️',
  'Computer Lab B':      '🖥️',
  'Conference Room 101': '🏢',
  'Physics Lab':         '🔬',
  'Projector Kit #3':    '📽️',
}

/* ── Helpers ───────────────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function calcDuration(start, end) {
  if (!start || !end) return null
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const mins = (eh * 60 + em) - (sh * 60 + sm)
  if (mins <= 0) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

/* ── Component ─────────────────────────────────────────────── */
function BookingCard({ booking, showAdminControls = false }) {
  const { updateBookingStatus, notify } = useBookingContext()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const config    = STATUS_CONFIG[booking.status] || {}
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED'
  const duration  = calcDuration(booking.startTime, booking.endTime)
  const resIcon   = RESOURCE_ICONS[booking.resourceName] ?? '📦'

  /* ── Action handlers — dispatch directly to context ── */
  const handleCancel = () => {
    if (confirmCancel) {
      updateBookingStatus(booking.id, 'CANCELLED')
      notify('Booking cancelled.')
    } else {
      setConfirmCancel(true)
    }
  }

  const handleApprove = () => {
    updateBookingStatus(booking.id, 'APPROVED')
    notify(`Booking for ${booking.resourceName} approved.`)
  }

  const handleReject = () => {
    updateBookingStatus(booking.id, 'REJECTED')
    notify(`Booking for ${booking.resourceName} rejected.`, 'error')
  }

  return (
    <article className={`booking-card ${config.accent ?? ''}`}>

      {/* ── Accent bar ── */}
      <div className="card-accent-bar" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="card-header">
        <div className="card-resource-row">
          <span className="card-resource-icon" aria-hidden="true">{resIcon}</span>
          <h3 className="card-resource">{booking.resourceName}</h3>
        </div>
        <span
          className={`status-badge ${config.className}`}
          aria-label={`Status: ${config.label}`}
        >
          <span aria-hidden="true">{config.icon}</span> {config.label}
        </span>
      </div>

      {/* ── Body ── */}
      <div className="card-body">
        <div className="card-meta">
          <div className="card-detail">
            <span className="detail-icon" aria-hidden="true">📅</span>
            <span className="detail-text">{formatDate(booking.date)}</span>
          </div>
          <div className="card-detail">
            <span className="detail-icon" aria-hidden="true">🕐</span>
            <span className="detail-text">
              {booking.startTime} – {booking.endTime}
            </span>
            {duration && (
              <span className="duration-pill" aria-label={`Duration: ${duration}`}>
                {duration}
              </span>
            )}
          </div>
          {/* Show submitter name in admin view */}
          {showAdminControls && booking.userName && (
            <div className="card-detail">
              <span className="detail-icon" aria-hidden="true">👤</span>
              <span className="detail-text">{booking.userName}</span>
            </div>
          )}
        </div>

        <div className="card-purpose-row">
          <span className="detail-icon" aria-hidden="true">📝</span>
          <p className="card-purpose">{booking.purpose}</p>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="card-footer">
        <span className="card-id" aria-label={`Booking ID: ${booking.id}`}>
          #{booking.id}
        </span>

        <div className="card-actions">
          {/* User: cancel with confirm step */}
          {!showAdminControls && canCancel && (
            confirmCancel ? (
              <div className="confirm-row" role="group" aria-label="Confirm cancellation">
                <span className="confirm-label">Cancel booking?</span>
                <button
                  className="btn-confirm-yes"
                  onClick={handleCancel}
                  aria-label="Yes, cancel this booking"
                >
                  Yes
                </button>
                <button
                  className="btn-confirm-no"
                  onClick={() => setConfirmCancel(false)}
                  aria-label="No, keep this booking"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                className="btn-cancel"
                onClick={handleCancel}
                aria-label={`Cancel booking for ${booking.resourceName}`}
              >
                Cancel
              </button>
            )
          )}

          {/* Admin: approve / reject */}
          {showAdminControls && booking.status === 'PENDING' && (
            <>
              <button
                className="btn-approve"
                onClick={handleApprove}
                aria-label={`Approve booking for ${booking.resourceName}`}
              >
                ✓ Approve
              </button>
              <button
                className="btn-reject"
                onClick={handleReject}
                aria-label={`Reject booking for ${booking.resourceName}`}
              >
                ✕ Reject
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default BookingCard

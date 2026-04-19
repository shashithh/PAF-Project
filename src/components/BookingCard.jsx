import React, { useState } from 'react'
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
function BookingCard({ booking, onCancel, onApprove, onReject, showAdminControls }) {
  const [confirmCancel, setConfirmCancel] = useState(false)

  const config    = STATUS_CONFIG[booking.status] || {}
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED'
  const duration  = calcDuration(booking.startTime, booking.endTime)
  const resIcon   = RESOURCE_ICONS[booking.resourceName] ?? '📦'

  const handleCancelClick = () => {
    if (confirmCancel) {
      onCancel(booking.id)
    } else {
      setConfirmCancel(true)
    }
  }

  return (
    <article className={`booking-card ${config.accent ?? ''}`}>

      {/* ── Accent bar (top border colour by status) ── */}
      <div className="card-accent-bar" aria-hidden="true" />

      {/* ── Header: resource name + status badge ── */}
      <div className="card-header">
        <div className="card-resource-row">
          <span className="card-resource-icon" aria-hidden="true">{resIcon}</span>
          <h3 className="card-resource">{booking.resourceName}</h3>
        </div>
        <span className={`status-badge ${config.className}`} aria-label={`Status: ${config.label}`}>
          <span aria-hidden="true">{config.icon}</span> {config.label}
        </span>
      </div>

      {/* ── Body: date, time, duration, purpose ── */}
      <div className="card-body">
        <div className="card-meta">
          {/* Date */}
          <div className="card-detail">
            <span className="detail-icon" aria-hidden="true">📅</span>
            <span className="detail-text">{formatDate(booking.date)}</span>
          </div>

          {/* Time + duration pill */}
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
        </div>

        {/* Purpose */}
        <div className="card-purpose-row">
          <span className="detail-icon" aria-hidden="true">📝</span>
          <p className="card-purpose">{booking.purpose}</p>
        </div>
      </div>

      {/* ── Footer: booking ID + actions ── */}
      <div className="card-footer">
        <span className="card-id" aria-label={`Booking ID: ${booking.id}`}>
          #{booking.id}
        </span>

        <div className="card-actions">
          {/* ── User: cancel with confirm step ── */}
          {!showAdminControls && canCancel && (
            confirmCancel ? (
              <div className="confirm-row" role="group" aria-label="Confirm cancellation">
                <span className="confirm-label">Cancel booking?</span>
                <button
                  className="btn-confirm-yes"
                  onClick={handleCancelClick}
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
                onClick={handleCancelClick}
                aria-label={`Cancel booking for ${booking.resourceName}`}
              >
                Cancel
              </button>
            )
          )}

          {/* ── Admin: approve / reject ── */}
          {showAdminControls && booking.status === 'PENDING' && (
            <>
              <button
                className="btn-approve"
                onClick={() => onApprove(booking.id)}
                aria-label={`Approve booking for ${booking.resourceName}`}
              >
                ✓ Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => onReject(booking.id)}
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

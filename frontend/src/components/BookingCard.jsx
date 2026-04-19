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

function getTemporalTag(dateStr) {
  if (!dateStr) return null
  const today = new Date().toISOString().split('T')[0]
  if (dateStr === today) return { label: 'Today',    className: 'tag-today'    }
  if (dateStr  > today)  return { label: 'Upcoming', className: 'tag-upcoming' }
  return                        { label: 'Past',     className: 'tag-past'     }
}

/* ── Component ─────────────────────────────────────────────── */
function BookingCard({ booking, showAdminControls = false, currentUserId }) {
  const { cancelBooking, updateBookingStatus } = useBookingContext()

  // Cancel flow
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelling,    setCancelling]    = useState(false)

  // Approve / reject flow
  const [confirmReject, setConfirmReject] = useState(false)
  const [approving,     setApproving]     = useState(false)
  const [rejecting,     setRejecting]     = useState(false)

  const config     = STATUS_CONFIG[booking.status] || {}
  const canCancel  = booking.status === 'PENDING' || booking.status === 'APPROVED'
  const isTerminal = booking.status === 'REJECTED' || booking.status === 'CANCELLED'
  const duration   = calcDuration(booking.startTime, booking.endTime)
  const resIcon    = RESOURCE_ICONS[booking.resourceName] ?? '📦'
  const temporalTag = !showAdminControls ? getTemporalTag(booking.date) : null

  // ── Handlers ──────────────────────────────────────────────

  const handleCancelConfirm = async () => {
    setCancelling(true)
    setConfirmCancel(false)
    await cancelBooking(booking.id, currentUserId ?? booking.userId)
    setCancelling(false)
  }

  const handleApprove = async () => {
    setApproving(true)
    await updateBookingStatus(booking.id, 'APPROVED')
    setApproving(false)
  }

  const handleRejectConfirm = async () => {
    setRejecting(true)
    setConfirmReject(false)
    await updateBookingStatus(booking.id, 'REJECTED')
    setRejecting(false)
  }

  // Any action in-flight — disable all buttons on this card
  const busy = cancelling || approving || rejecting

  return (
    <article
      className={`booking-card ${config.accent ?? ''} ${isTerminal ? 'card-terminal' : ''} ${busy ? 'card-busy' : ''}`}
      aria-label={`${booking.resourceName}, ${config.label}`}
      aria-busy={busy}
    >
      {/* ── Accent bar ── */}
      <div className="card-accent-bar" aria-hidden="true" />

      {/* ── Header ── */}
      <div className="card-header">
        <div className="card-resource-row">
          <span className="card-resource-icon" aria-hidden="true">{resIcon}</span>
          <h3 className="card-resource">{booking.resourceName}</h3>
        </div>
        <div className="card-header-badges">
          {temporalTag && (
            <span className={`temporal-tag ${temporalTag.className}`}>
              {temporalTag.label}
            </span>
          )}
          <span
            className={`status-badge ${config.className}`}
            aria-label={`Status: ${config.label}`}
          >
            <span aria-hidden="true">{config.icon}</span> {config.label}
          </span>
        </div>
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
            <span className="detail-text">{booking.startTime} – {booking.endTime}</span>
            {duration && (
              <span className="duration-pill" aria-label={`Duration: ${duration}`}>
                {duration}
              </span>
            )}
          </div>
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
        <span className="card-submitted" aria-label="Submitted on">
          {booking.createdAt
            ? `Submitted ${new Date(booking.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
            : `#${booking.id}`
          }
        </span>

        <div className="card-actions">

          {/* ── User: cancel ── */}
          {!showAdminControls && canCancel && (
            cancelling ? (
              <span className="action-loading" aria-live="polite">
                <span className="spinner-sm" aria-hidden="true" /> Cancelling…
              </span>
            ) : confirmCancel ? (
              <div className="confirm-row" role="group" aria-label="Confirm cancellation">
                <span className="confirm-label">Cancel booking?</span>
                <button className="btn-confirm-yes" onClick={handleCancelConfirm}
                  aria-label="Yes, cancel this booking">Yes</button>
                <button className="btn-confirm-no" onClick={() => setConfirmCancel(false)}
                  aria-label="No, keep this booking">No</button>
              </div>
            ) : (
              <button
                className="btn-cancel"
                onClick={() => setConfirmCancel(true)}
                disabled={busy}
                aria-label={`Cancel booking for ${booking.resourceName}`}
              >
                Cancel
              </button>
            )
          )}

          {/* Terminal state label */}
          {!showAdminControls && isTerminal && (
            <span className="card-terminal-label">
              {booking.status === 'CANCELLED' ? 'You cancelled this' : 'Not approved'}
            </span>
          )}

          {/* ── Admin: approve / reject ── */}
          {showAdminControls && booking.status === 'PENDING' && (
            approving ? (
              <span className="action-loading action-loading-approve" aria-live="polite">
                <span className="spinner-sm spinner-sm-approve" aria-hidden="true" /> Approving…
              </span>
            ) : rejecting ? (
              <span className="action-loading action-loading-reject" aria-live="polite">
                <span className="spinner-sm spinner-sm-reject" aria-hidden="true" /> Rejecting…
              </span>
            ) : confirmReject ? (
              <div className="confirm-row" role="group" aria-label="Confirm rejection">
                <span className="confirm-label">Reject booking?</span>
                <button className="btn-confirm-yes" onClick={handleRejectConfirm}
                  aria-label="Yes, reject this booking">Yes</button>
                <button className="btn-confirm-no" onClick={() => setConfirmReject(false)}
                  aria-label="No, keep pending">No</button>
              </div>
            ) : (
              <>
                <button
                  className="btn-approve"
                  onClick={handleApprove}
                  disabled={busy}
                  aria-label={`Approve booking for ${booking.resourceName}`}
                >
                  ✓ Approve
                </button>
                <button
                  className="btn-reject"
                  onClick={() => setConfirmReject(true)}
                  disabled={busy}
                  aria-label={`Reject booking for ${booking.resourceName}`}
                >
                  ✕ Reject
                </button>
              </>
            )
          )}

          {/* Admin: already-actioned label */}
          {showAdminControls && booking.status === 'APPROVED' && (
            <span className="card-actioned-label card-actioned-approved">✅ Approved</span>
          )}
          {showAdminControls && booking.status === 'REJECTED' && (
            <span className="card-actioned-label card-actioned-rejected">❌ Rejected</span>
          )}
          {showAdminControls && booking.status === 'CANCELLED' && (
            <span className="card-actioned-label">🚫 Cancelled by user</span>
          )}
        </div>
      </div>
    </article>
  )
}

export default BookingCard

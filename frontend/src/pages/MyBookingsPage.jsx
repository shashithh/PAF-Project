import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

const STATUSES = ['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']

const statusBadge = s => ({
  APPROVED: 'badge-green', PENDING: 'badge-warn',
  REJECTED: 'badge-red', CANCELLED: 'badge-gray',
}[s] || 'badge-gray')

const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const { currentUser, isAdmin } = useAuth()
  const { bookings, loading, cancelBooking, updateBookingStatus } = useBookingContext()
  const [status, setStatus] = useState('')
  const [confirming, setConfirming] = useState(null)
  const [selected, setSelected] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showReject, setShowReject] = useState(false)

  const displayed = useMemo(() => {
    const list = isAdmin ? bookings : bookings.filter(b => b.userId === currentUser?.id)
    return status ? list.filter(b => b.status === status) : list
  }, [bookings, currentUser, isAdmin, status])

  const handleCancel = async (id) => {
    await cancelBooking(id, currentUser.id)
    setConfirming(null)
  }

  const handleReview = async (id, approved, reason = '') => {
    await updateBookingStatus(id, approved ? 'APPROVED' : 'REJECTED', reason || null)
    setSelected(null)
    setShowReject(false)
    setRejectReason('')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">📅 Bookings</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 4 }}>
            {isAdmin ? 'Manage all booking requests' : 'Your booking history'}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/book')}>
          <CalendarDays size={16} /> New Booking
        </button>
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-ghost'}`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <div className="spinner" /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {isAdmin && <th>User</th>}
                <th>Resource</th>
                <th>Date</th>
                <th>Time</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 8 : 7} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 40 }}>
                    No bookings found
                  </td>
                </tr>
              ) : displayed.map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                    #{b.id?.slice(-6)}
                  </td>
                  {isAdmin && <td style={{ fontWeight: 600 }}>{b.userName}</td>}
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.resourceName}</div>
                  </td>
                  <td>{fmtDate(b.date)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)}
                  </td>
                  <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {b.purpose}
                  </td>
                  <td>
                    <span className={`badge ${statusBadge(b.status)}`}>{b.status}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(b)}>
                        View
                      </button>
                      {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                        confirming === b.id ? (
                          <>
                            <button className="btn btn-sm" style={{ background: 'var(--danger)', color: '#fff' }}
                              onClick={() => handleCancel(b.id)}>Yes</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(null)}>No</button>
                          </>
                        ) : (
                          <button className="btn btn-sm" style={{ background: 'var(--danger)', color: '#fff' }}
                            onClick={() => setConfirming(b.id)}>
                            Cancel
                          </button>
                        )
                      )}
                      {isAdmin && b.status === 'PENDING' && (
                        <>
                          <button className="btn btn-sm btn-accent"
                            onClick={() => handleReview(b.id, true)}>✓</button>
                          <button className="btn btn-sm btn-danger"
                            onClick={() => { setSelected(b); setShowReject(true) }}>✗</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.1rem' }}>Booking #{selected.id?.slice(-6)}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(null); setShowReject(false); setRejectReason('') }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${statusBadge(selected.status)}`}>{selected.status}</span>
              </div>

              {[
                { label: 'Resource',   value: selected.resourceName },
                { label: 'Requested by', value: selected.userName },
                { label: 'Date',       value: fmtDate(selected.date) },
                { label: 'Time',       value: `${selected.startTime?.slice(0,5)} – ${selected.endTime?.slice(0,5)}` },
                { label: 'Purpose',    value: selected.purpose },
                { label: 'Attendees',  value: selected.attendees || '—' },
                ...(selected.rejectionReason ? [{ label: 'Rejection reason', value: selected.rejectionReason }] : []),
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 12, fontSize: '0.875rem' }}>
                  <div style={{ width: 130, color: 'var(--text-3)', flexShrink: 0 }}>{label}</div>
                  <div style={{ fontWeight: 500 }}>{value}</div>
                </div>
              ))}

              {isAdmin && selected.status === 'PENDING' && (
                <div style={{ marginTop: 8 }}>
                  {showReject ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <textarea rows={2} placeholder="Reason for rejection…"
                        value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" onClick={() => setShowReject(false)}>Back</button>
                        <button className="btn btn-danger" onClick={() => handleReview(selected.id, false, rejectReason)}>
                          Confirm Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-accent" onClick={() => handleReview(selected.id, true)}>
                        ✓ Approve
                      </button>
                      <button className="btn btn-danger" onClick={() => setShowReject(true)}>
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

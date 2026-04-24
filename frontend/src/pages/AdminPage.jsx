import React, { useState, useMemo } from 'react'
import { LayoutDashboard, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useBookingContext } from '../context/BookingContext.jsx'

const statusBadge = s => ({
  APPROVED: 'badge-green', PENDING: 'badge-warn',
  REJECTED: 'badge-red', CANCELLED: 'badge-gray',
}[s] || 'badge-gray')

const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function AdminPage() {
  const { bookings, loading, stats, updateBookingStatus } = useBookingContext()
  const [filter, setFilter] = useState('')
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const displayed = useMemo(() =>
    filter ? bookings.filter(b => b.status === filter) : bookings,
    [bookings, filter]
  )

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ Admin Panel</h1>
          <p style={{ color: 'var(--text-2)', marginTop: 4 }}>Review and manage all campus bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: 'Total',    value: stats.TOTAL,    Icon: LayoutDashboard, color: 'var(--primary)' },
          { label: 'Pending',  value: stats.PENDING,  Icon: Clock,           color: 'var(--warn)'    },
          { label: 'Approved', value: stats.APPROVED, Icon: CheckCircle,     color: 'var(--accent)'  },
          { label: 'Rejected', value: stats.REJECTED, Icon: XCircle,         color: 'var(--danger)'  },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-label">{label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {['', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`}>
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
                <th>User</th>
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
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-3)', padding: 40 }}>No bookings found</td></tr>
              ) : displayed.map(b => (
                <tr key={b.id}>
                  <td style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontFamily: 'monospace' }}>#{b.id?.slice(-6)}</td>
                  <td style={{ fontWeight: 600 }}>{b.userName}</td>
                  <td>{b.resourceName}</td>
                  <td>{fmtDate(b.date)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)}</td>
                  <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.purpose}</td>
                  <td><span className={`badge ${statusBadge(b.status)}`}>{b.status}</span></td>
                  <td>
                    {b.status === 'PENDING' && (
                      rejectingId === b.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
                          <input
                            placeholder="Rejection reason…"
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                            autoFocus
                          />
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => { updateBookingStatus(b.id, 'REJECTED', rejectReason || null); setRejectingId(null); setRejectReason('') }}>
                              Confirm
                            </button>
                            <button className="btn btn-ghost btn-sm"
                              onClick={() => { setRejectingId(null); setRejectReason('') }}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-sm btn-accent"
                            onClick={() => updateBookingStatus(b.id, 'APPROVED', null)}>✓ Approve</button>
                          <button className="btn btn-sm btn-danger"
                            onClick={() => setRejectingId(b.id)}>✗ Reject</button>
                        </div>
                      )
                    )}
                    {b.rejectionReason && b.status === 'REJECTED' && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: 4 }}>
                        Reason: {b.rejectionReason}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

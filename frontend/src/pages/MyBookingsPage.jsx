import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Eye, X, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

const STATUS_OPTS = ['All', 'Pending', 'Approved', 'Rejected', 'Cancelled']

const fmtDate = d => {
  if (!d) return ''
  const dt = new Date(d + 'T00:00:00')
  return dt.toISOString().split('T')[0]   // YYYY-MM-DD like the screenshot
}
const fmtTime = t => t ? t.slice(0, 5) : ''

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { bookings, loading, cancelBooking } = useBookingContext()
  const [filter, setFilter]         = useState('All')
  const [confirming, setConfirming] = useState(null)
  const [dropOpen, setDropOpen]     = useState(false)

  const mine = useMemo(() =>
    bookings.filter(b => b.userId === currentUser?.id),
    [bookings, currentUser]
  )

  const displayed = useMemo(() =>
    filter === 'All' ? mine : mine.filter(b => b.status === filter.toUpperCase()),
    [mine, filter]
  )

  const handleCancel = async (id) => {
    await cancelBooking(id, currentUser.id)
    setConfirming(null)
  }

  return (
    <div style={{ maxWidth: 960, animation: 'fadeUp .3s ease both' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text)', marginBottom:'.2rem' }}>My bookings</h1>
          <p style={{ fontSize:'.875rem', color:'var(--muted)' }}>Track and manage your booking requests.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/new-booking')}>
          <PlusCircle size={15} strokeWidth={2.5} />
          New booking
        </button>
      </div>

      {/* Filter dropdown — matches screenshot style */}
      <div style={{ marginBottom:'1.25rem', position:'relative', display:'inline-block' }}>
        <button
          onClick={() => setDropOpen(o => !o)}
          style={{
            display:'flex', alignItems:'center', gap:'.5rem',
            padding:'.5rem 1rem', background:'var(--bg-card)',
            border:'1px solid var(--border)', borderRadius:'var(--radius-sm)',
            fontSize:'.875rem', fontWeight:500, color:'var(--text)',
            cursor:'pointer', minWidth:120,
          }}
        >
          {filter} ({filter === 'All' ? mine.length : displayed.length})
          <ChevronDown size={14} strokeWidth={2} style={{ marginLeft:'auto' }} />
        </button>
        {dropOpen && (
          <div style={{
            position:'absolute', top:'calc(100% + 4px)', left:0,
            background:'var(--bg-card)', border:'1px solid var(--border)',
            borderRadius:'var(--radius-sm)', boxShadow:'var(--shadow-md)',
            zIndex:100, minWidth:160, padding:'.3rem',
            animation:'slideDown .15s ease both',
          }}>
            {STATUS_OPTS.map(s => (
              <button
                key={s}
                onClick={() => { setFilter(s); setDropOpen(false) }}
                style={{
                  display:'block', width:'100%', textAlign:'left',
                  padding:'.45rem .75rem', border:'none', borderRadius:'var(--radius-xs)',
                  background: s === filter ? 'var(--primary-light)' : 'transparent',
                  color: s === filter ? 'var(--primary)' : 'var(--text)',
                  fontSize:'.875rem', fontWeight: s === filter ? 600 : 400,
                  cursor:'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table card */}
      <div className="card" style={{ overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:'3rem', textAlign:'center', color:'var(--muted)' }}>
            <div className="spinner-dark" style={{ margin:'0 auto 1rem' }} />
            Loading bookings…
          </div>
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CalendarDays size={22} strokeWidth={1.5} />
            </div>
            <p className="empty-title">No {filter.toLowerCase()} bookings</p>
            <p style={{ fontSize:'.875rem', color:'var(--muted)', marginTop:'.25rem' }}>
              {filter === 'All' ? 'Make your first booking to get started.' : `No ${filter.toLowerCase()} bookings to show.`}
            </p>
            {filter === 'All' && (
              <button className="btn btn-primary" style={{ marginTop:'1rem' }} onClick={() => navigate('/book')}>
                Browse resources
              </button>
            )}
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)', background:'var(--bg-muted)' }}>
                {['Resource', 'Date / Time', 'Purpose', 'Status', ''].map(h => (
                  <th key={h} style={{
                    padding:'.75rem 1.1rem', textAlign:'left',
                    fontSize:'.72rem', fontWeight:700, textTransform:'uppercase',
                    letterSpacing:'.07em', color:'var(--muted)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayed.map((b, i) => (
                <tr
                  key={b.id}
                  style={{
                    borderBottom: i < displayed.length - 1 ? '1px solid var(--border-2)' : 'none',
                    transition:'background var(--t-fast)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Resource */}
                  <td style={{ padding:'.9rem 1.1rem', fontWeight:600, color:'var(--text)', fontSize:'.9rem' }}>
                    {b.resourceName}
                  </td>

                  {/* Date / Time */}
                  <td style={{ padding:'.9rem 1.1rem' }}>
                    <div style={{ fontWeight:600, color:'var(--text)', fontSize:'.875rem' }}>{fmtDate(b.date)}</div>
                    <div style={{ fontSize:'.8rem', color:'var(--muted)', marginTop:'.1rem' }}>
                      {fmtTime(b.startTime)}–{fmtTime(b.endTime)}
                    </div>
                  </td>

                  {/* Purpose */}
                  <td style={{ padding:'.9rem 1.1rem', color:'var(--text-2)', fontSize:'.875rem', maxWidth:200 }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {b.purpose || '—'}
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding:'.9rem 1.1rem' }}>
                    <span className={`badge badge-${b.status.toLowerCase()}`}>
                      {b.status.charAt(0) + b.status.slice(1).toLowerCase()}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding:'.9rem 1.1rem', textAlign:'right' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'.4rem' }}>
                      <button
                        onClick={() => navigate(`/book/${b.resourceId}`)}
                        style={{
                          display:'flex', alignItems:'center', gap:'.3rem',
                          padding:'.3rem .75rem', border:'none', borderRadius:'var(--radius-xs)',
                          background:'none', color:'var(--primary)', fontSize:'.82rem',
                          fontWeight:600, cursor:'pointer', transition:'all var(--t-fast)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        View
                      </button>

                      {(b.status === 'PENDING' || b.status === 'APPROVED') && (
                        confirming === b.id ? (
                          <div style={{ display:'flex', alignItems:'center', gap:'.35rem' }}>
                            <span style={{ fontSize:'.78rem', color:'var(--muted)' }}>Cancel?</span>
                            <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Yes</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(null)}>No</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirming(b.id)}
                            style={{
                              display:'flex', alignItems:'center', gap:'.3rem',
                              padding:'.3rem .6rem', border:'none', borderRadius:'var(--radius-xs)',
                              background:'none', color:'var(--muted)', fontSize:'.82rem',
                              cursor:'pointer', transition:'all var(--t-fast)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.color='var(--red)'; e.currentTarget.style.background='var(--red-light)' }}
                            onMouseLeave={e => { e.currentTarget.style.color='var(--muted)'; e.currentTarget.style.background='none' }}
                          >
                            <X size={13} strokeWidth={2.5} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

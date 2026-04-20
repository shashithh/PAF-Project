import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'
import '../styles/flow.css'

const TYPE_ICONS = { lab:'🔬', room:'🏢', equipment:'📽️' }
const RES_ICONS  = {
  'Computer Lab A':'🖥️','Computer Lab B':'🖥️',
  'Conference Room 101':'🏢','Physics Lab':'🔬','Projector Kit #3':'📽️',
}
const TABS = ['All','Pending','Approved','Rejected','Cancelled']

const fmtDate = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) : ''

export default function MyBookingsPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { bookings, loading, cancelBooking } = useBookingContext()
  const [tab, setTab] = useState('All')
  const [confirming, setConfirming] = useState(null)

  const mine = useMemo(() =>
    bookings.filter(b => b.userId === currentUser?.id),
    [bookings, currentUser]
  )

  const counts = useMemo(() => {
    const c = { All: mine.length }
    mine.forEach(b => { c[b.status.charAt(0)+b.status.slice(1).toLowerCase()] = (c[b.status.charAt(0)+b.status.slice(1).toLowerCase()]??0)+1 })
    return c
  }, [mine])

  const displayed = useMemo(() =>
    tab === 'All' ? mine : mine.filter(b => b.status === tab.toUpperCase()),
    [mine, tab]
  )

  const handleCancel = async (id) => {
    await cancelBooking(id, currentUser.id)
    setConfirming(null)
  }

  return (
    <div className="flow-page">
      <div className="flow-inner">
        {/* Header */}
        <div className="my-bookings-header">
          <div>
            <h1 className="page-title">My bookings</h1>
            <p className="page-sub">Everything you've reserved, neatly in one place.</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/book')}>
            🗓 New booking
          </button>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs" style={{marginBottom:'1.5rem'}}>
          {TABS.map(t => (
            <button key={t} className={`filter-tab${tab===t?' active':''}`} onClick={() => setTab(t)}>
              {t}
              {counts[t] > 0 && <span className="filter-tab-count">{counts[t]}</span>}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bookings-grid">
            {[1,2,3].map(i=><div key={i} className="res-skel" style={{height:180}} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && displayed.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p className="empty-title">No {tab.toLowerCase()} bookings</p>
            <p style={{color:'var(--muted)',fontSize:'.875rem',marginTop:'.25rem'}}>
              {tab==='All' ? 'Use the form to reserve a resource.' : `No ${tab.toLowerCase()} bookings to show.`}
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && displayed.length > 0 && (
          <div className="bookings-grid">
            {displayed.map(b => (
              <div key={b.id} className="bk-card">
                <div className="bk-card-top">
                  <div className="bk-res-row">
                    <div className="bk-res-icon">{RES_ICONS[b.resourceName]??'📦'}</div>
                    <div>
                      <div className="bk-res-name">{b.resourceName}</div>
                      <div className="bk-res-loc">📍 Campus</div>
                    </div>
                  </div>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>
                    {b.status==='APPROVED'?'✓ ':b.status==='PENDING'?'⏳ ':''}{b.status.charAt(0)+b.status.slice(1).toLowerCase()}
                  </span>
                </div>

                <div className="bk-date">{fmtDate(b.date)}</div>
                <div className="bk-time">🕐 {b.startTime} – {b.endTime}</div>
                {b.purpose && <div className="bk-purpose">"{b.purpose}"</div>}

                <div className="bk-footer">
                  <span className="bk-user">{b.userName}</span>
                  <div className="bk-actions">
                    {(b.status==='PENDING'||b.status==='APPROVED') && (
                      confirming===b.id ? (
                        <div style={{display:'flex',alignItems:'center',gap:'.4rem'}}>
                          <span style={{fontSize:'.78rem',color:'var(--muted)'}}>Cancel?</span>
                          <button className="btn btn-danger btn-sm" onClick={() => handleCancel(b.id)}>Yes</button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setConfirming(null)}>No</button>
                        </div>
                      ) : (
                        <button className="bk-cancel-btn" onClick={() => setConfirming(b.id)}>Cancel</button>
                      )
                    )}
                    <button className="bk-more-btn" title="More options">···</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import React, { useState, useMemo } from 'react'
import { useBookingContext } from '../context/BookingContext.jsx'
import '../styles/flow.css'

const fmtDate = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}) : ''
const RES_ICONS = { 'Computer Lab A':'🖥️','Computer Lab B':'🖥️','Conference Room 101':'🏢','Physics Lab':'🔬','Projector Kit #3':'📽️' }

export default function AdminPage() {
  const { bookings, loading, stats, updateBookingStatus } = useBookingContext()
  const [filter, setFilter] = useState('All')

  const displayed = useMemo(() =>
    filter==='All' ? bookings : bookings.filter(b=>b.status===filter.toUpperCase()),
    [bookings, filter]
  )

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <div className="page-header">
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-sub">Review and manage all campus bookings.</p>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          {[['Total',stats.TOTAL,''],['Pending',stats.PENDING,'stat-pending'],['Approved',stats.APPROVED,'stat-approved'],['Rejected',stats.REJECTED,'stat-rejected']].map(([l,n,cls])=>(
            <div key={l} className={`stat-card ${cls}`}>
              <span className="stat-num">{n}</span>
              <span className="stat-lbl">{l}</span>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="filter-tabs" style={{marginBottom:'1.5rem'}}>
          {['All','Pending','Approved','Rejected','Cancelled'].map(t=>(
            <button key={t} className={`filter-tab${filter===t?' active':''}`} onClick={()=>setFilter(t)}>
              {t}
              {t!=='All' && stats[t.toUpperCase()]>0 && <span className="filter-tab-count">{stats[t.toUpperCase()]}</span>}
            </button>
          ))}
        </div>

        {loading && <div className="bookings-grid">{[1,2,3].map(i=><div key={i} className="res-skel" style={{height:180}} />)}</div>}

        {!loading && displayed.length===0 && (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p className="empty-title">No {filter.toLowerCase()} bookings</p>
          </div>
        )}

        {!loading && displayed.length>0 && (
          <div className="bookings-grid">
            {displayed.map(b=>(
              <div key={b.id} className="bk-card">
                <div className="bk-card-top">
                  <div className="bk-res-row">
                    <div className="bk-res-icon">{RES_ICONS[b.resourceName]??'📦'}</div>
                    <div>
                      <div className="bk-res-name">{b.resourceName}</div>
                      <div className="bk-res-loc">👤 {b.userName}</div>
                    </div>
                  </div>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status.charAt(0)+b.status.slice(1).toLowerCase()}</span>
                </div>
                <div className="bk-date">{fmtDate(b.date)}</div>
                <div className="bk-time">🕐 {b.startTime} – {b.endTime}</div>
                {b.purpose && <div className="bk-purpose">"{b.purpose}"</div>}
                {b.status==='PENDING' && (
                  <div style={{display:'flex',gap:'.5rem',marginTop:'.25rem'}}>
                    <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={()=>updateBookingStatus(b.id,'APPROVED')}>✓ Approve</button>
                    <button className="btn btn-danger btn-sm" style={{flex:1}} onClick={()=>updateBookingStatus(b.id,'REJECTED')}>✕ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

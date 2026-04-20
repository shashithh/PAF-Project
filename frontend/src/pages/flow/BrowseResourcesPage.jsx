import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchResources } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import '../../styles/flow.css'

const TYPE_ICONS  = { lab:'🔬', room:'🏢', equipment:'📽️' }
const TYPE_LABELS = { lab:'LAB', room:'MEETING ROOM', equipment:'EQUIPMENT' }
const DESCS = {
  r1: 'Workstations with developer tooling and dual monitors.',
  r2: 'Workstations with developer tooling and dual monitors.',
  r3: 'Quiet collaboration room with whiteboard and display.',
  r4: 'Fully equipped physics laboratory for experiments.',
  r5: 'Portable 4K projector kit with screen and HDMI adapters.',
}

export default function BrowseResourcesPage() {
  const navigate = useNavigate()
  const { setSelectedResource, reset } = useBookingFlow()
  const [resources, setResources] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [filter, setFilter]       = useState('all')
  const [search, setSearch]       = useState('')

  useEffect(() => {
    reset()
    fetchResources()
      .then(setResources)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [reset])

  const displayed = useMemo(() =>
    resources.filter(r =>
      (filter === 'all' || r.type === filter) &&
      r.name.toLowerCase().includes(search.toLowerCase())
    ), [resources, filter, search])

  const handleBook = (r) => {
    setSelectedResource(r)
    navigate(`/book/${r.id}`)
  }

  return (
    <div className="flow-page">
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-tag">🏛 Smart campus booking</div>
        <h1 className="hero-title">
          Find a space.<br />
          <span className="hero-title-italic">Book it in a breeze.</span>
        </h1>
        <p className="hero-sub">
          From labs to meeting rooms, reserve any campus resource in under a minute.
          Track your requests in one calm, simple place.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/new-booking')}>
            Create a booking →
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/')}>
            View my bookings
          </button>
        </div>
      </div>

      {/* Resources */}
      <div className="resources-section">
        <h2 className="resources-heading">Available resources</h2>
        <p className="resources-sub">
          {loading ? 'Loading…' : `${displayed.length} curated space${displayed.length !== 1 ? 's' : ''} and kit${displayed.length !== 1 ? 's' : ''}, ready to reserve.`}
        </p>

        {/* Filters */}
        <div style={{ display:'flex', gap:'.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
          {['all','lab','room','equipment'].map(k => (
            <button
              key={k}
              className={`filter-tab${filter === k ? ' active' : ''}`}
              onClick={() => setFilter(k)}
            >
              {k === 'all' ? 'All' : TYPE_LABELS[k]}
            </button>
          ))}
          <input
            style={{ marginLeft:'auto', padding:'.38rem .9rem', border:'1.5px solid var(--border)', borderRadius:'var(--radius-pill)', fontSize:'.85rem', background:'var(--surface)', outline:'none', width:'200px' }}
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {error && <div className="error-box">⚠️ {error}</div>}

        {loading ? (
          <div className="resources-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="res-skel" />)}
          </div>
        ) : (
          <div className="resources-grid">
            {displayed.map(r => (
              <div key={r.id} className="res-card">
                <div className="res-card-top">
                  <div className="res-icon-wrap">{TYPE_ICONS[r.type] ?? '📦'}</div>
                  <span className="res-type-tag">{TYPE_LABELS[r.type] ?? r.type}</span>
                </div>
                <div className="res-name">{r.name}</div>
                <div className="res-desc">{DESCS[r.id] ?? 'Campus resource available for booking.'}</div>
                <div className="res-meta">
                  <div className="res-meta-row">
                    <span className="res-meta-icon">📍</span>
                    <span>Building · Floor 1</span>
                  </div>
                  <div className="res-meta-row">
                    <span className="res-meta-icon">👥</span>
                    <span>{r.capacity > 1 ? `Capacity · ${r.capacity}` : 'Single unit'}</span>
                  </div>
                </div>
                <button className="res-book-btn" onClick={() => handleBook(r)}>
                  Book this →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

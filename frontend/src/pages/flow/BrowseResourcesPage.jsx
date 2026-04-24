import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, MapPin, Users, ArrowRight, Zap,
  Monitor, FlaskConical, Projector, DoorOpen, ImageIcon
} from 'lucide-react'
import { fetchResources } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import '../../styles/flow.css'

const TYPE_META = {
  lab:       { label: 'Lab',          Icon: FlaskConical },
  room:      { label: 'Meeting Room', Icon: DoorOpen     },
  equipment: { label: 'Equipment',    Icon: Projector    },
}

const RESOURCE_DESCS = {
  r1: 'High-performance workstations with developer tooling, dual monitors, and fast internet.',
  r2: 'Fully equipped computer lab with software suites for data science and engineering.',
  r3: 'Quiet collaboration room with a large display, whiteboard, and video conferencing.',
  r4: 'Fully equipped physics laboratory for experiments and research sessions.',
  r5: 'Portable 4K projector kit with screen, HDMI adapters, and carry case.',
}

const RESOURCE_BUILDING = {
  r1: 'Block A · Floor 2', r2: 'Block B · Floor 1',
  r3: 'Block C · Floor 3', r4: 'Block D · Ground', r5: 'Equipment Store',
}

function ResourceIcon({ type, size = 28 }) {
  const meta = TYPE_META[type] ?? { Icon: Monitor }
  return <meta.Icon size={size} strokeWidth={1.75} />
}

function ResourceCard({ resource, onBook, delay = 0 }) {
  const meta = TYPE_META[resource.type] ?? { label: resource.type, Icon: Monitor }
  return (
    <div className="res-card" style={{ animationDelay: `${delay}ms` }}>
      {/* Image holder */}
      <div className="res-card-img">
        <div className="res-img-placeholder">
          <ResourceIcon type={resource.type} size={36} />
          <span>Add image</span>
        </div>
        <span className="res-type-badge">{meta.label}</span>
      </div>

      <div className="res-card-body">
        <div className="res-name">{resource.name}</div>
        <div className="res-desc">{RESOURCE_DESCS[resource.id] ?? 'Campus resource available for booking.'}</div>
        <div className="res-meta">
          <div className="res-meta-row">
            <MapPin size={13} strokeWidth={2} />
            <span>{RESOURCE_BUILDING[resource.id] ?? 'Campus'}</span>
          </div>
          <div className="res-meta-row">
            <Users size={13} strokeWidth={2} />
            <span>{resource.capacity > 1 ? `Capacity: ${resource.capacity}` : 'Single unit'}</span>
          </div>
        </div>
      </div>

      <div className="res-card-footer">
        <button className="res-book-btn" onClick={() => onBook(resource)}>
          Book this resource
          <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
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
      {/* ── Hero ── */}
      <div className="hero-section">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        <div className="hero-badge">
          <Zap size={12} strokeWidth={2.5} />
          Smart Campus Booking
        </div>

        <h1 className="hero-title">
          Find a space.<br />
          <span className="hero-title-accent">Book it instantly.</span>
        </h1>
        <p className="hero-sub">
          Reserve labs, meeting rooms, and equipment across campus in under a minute.
          Track every request from one clean dashboard.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/new-booking')}>
            Create a booking
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
          <button className="btn btn-outline btn-lg" onClick={() => navigate('/')}>
            View my bookings
          </button>
        </div>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-num">{resources.length || 5}</div>
            <div className="hero-stat-lbl">Resources available</div>
          </div>
          <div>
            <div className="hero-stat-num">3</div>
            <div className="hero-stat-lbl">Resource types</div>
          </div>
          <div>
            <div className="hero-stat-num">24/7</div>
            <div className="hero-stat-lbl">Online booking</div>
          </div>
        </div>
      </div>

      {/* ── Resources ── */}
      <div className="resources-section">
        <div className="resources-header">
          <div>
            <h2 className="resources-heading">Available resources</h2>
            <p className="resources-sub">
              {loading ? 'Loading resources…' : `${displayed.length} resource${displayed.length !== 1 ? 's' : ''} ready to reserve`}
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar">
          <div className="filter-tabs">
            {[
              { key: 'all',       label: 'All' },
              { key: 'lab',       label: 'Labs' },
              { key: 'room',      label: 'Rooms' },
              { key: 'equipment', label: 'Equipment' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`filter-tab${filter === key ? ' active' : ''}`}
                onClick={() => setFilter(key)}
              >
                {label}
                {key !== 'all' && (
                  <span className="filter-tab-count">
                    {resources.filter(r => r.type === key).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="search-input-wrap">
            <Search size={14} strokeWidth={2} />
            <input
              className="search-input"
              placeholder="Search resources…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="error-box" style={{ marginBottom: '1.5rem' }}>
            <Zap size={15} /> {error}
          </div>
        )}

        {loading ? (
          <div className="resources-grid">
            {[1,2,3,4,5,6].map(i => <div key={i} className="res-skel" />)}
          </div>
        ) : displayed.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Search size={24} /></div>
            <p className="empty-title">No resources found</p>
            <p style={{ color: 'var(--muted)', fontSize: '.875rem' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="resources-grid">
            {displayed.map((r, i) => (
              <ResourceCard key={r.id} resource={r} onBook={handleBook} delay={i * 60} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

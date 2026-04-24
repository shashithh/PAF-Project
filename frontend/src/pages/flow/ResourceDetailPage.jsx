import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Clock, Timer, CalendarDays, Users,
  MapPin, ArrowRight, ImageIcon, FlaskConical,
  DoorOpen, Projector, Monitor
} from 'lucide-react'
import { fetchResources } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import { useBookingContext } from '../../context/BookingContext.jsx'
import '../../styles/flow.css'

const TYPE_META = {
  lab:       { label: 'Lab',          Icon: FlaskConical },
  room:      { label: 'Meeting Room', Icon: DoorOpen     },
  equipment: { label: 'Equipment',    Icon: Projector    },
}

const RESOURCE_DESCS = {
  r1: 'High-performance workstations with developer tooling, dual monitors, and fast internet. Ideal for software projects, coding sessions, and technical workshops.',
  r2: 'Fully equipped computer lab with software suites for data science, machine learning, and engineering. Supports up to 30 concurrent users.',
  r3: 'Quiet collaboration room with a large 4K display, whiteboard, and video conferencing setup. Perfect for team meetings and presentations.',
  r4: 'Fully equipped physics laboratory for experiments, research sessions, and practical demonstrations. Includes all standard lab equipment.',
  r5: 'Portable 4K projector kit with screen, HDMI adapters, and carry case. Available for pickup and use in any campus room.',
}

const RESOURCE_BUILDING = {
  r1: 'Block A · Floor 2', r2: 'Block B · Floor 1',
  r3: 'Block C · Floor 3', r4: 'Block D · Ground', r5: 'Equipment Store',
}

const fmtDate = d => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  : ''

export default function ResourceDetailPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { setSelectedResource, selectedResource } = useBookingFlow()
  const { bookings } = useBookingContext()
  const [resource, setResource] = useState(selectedResource?.id === resourceId ? selectedResource : null)
  const [loading, setLoading]   = useState(!resource)

  useEffect(() => {
    if (resource) return
    fetchResources()
      .then(list => {
        const found = list.find(r => r.id === resourceId)
        if (found) { setSelectedResource(found); setResource(found) }
      })
      .finally(() => setLoading(false))
  }, [resourceId, resource, setSelectedResource])

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings
    .filter(b => b.resourceId === resourceId && ['APPROVED', 'PENDING'].includes(b.status) && b.date >= today)
    .sort((a, b) => (`${a.date}T${a.startTime}` < `${b.date}T${b.startTime}` ? -1 : 1))
    .slice(0, 5)

  if (loading) {
    return (
      <div className="flow-page">
        <div className="flow-inner">
          <div className="res-skel" style={{ height: 280, marginBottom: '1.5rem' }} />
          <div className="res-skel" style={{ height: 120 }} />
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="flow-page">
        <div className="flow-inner">
          <div className="error-box">
            Resource not found.
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/book')}>Go back</button>
          </div>
        </div>
      </div>
    )
  }

  const meta = TYPE_META[resource.type] ?? { label: resource.type, Icon: Monitor }

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <button className="back-link" onClick={() => navigate('/book')}>
          <ArrowLeft size={15} strokeWidth={2} />
          Back to resources
        </button>

        {/* Image hero */}
        <div className="detail-hero">
          <div className="detail-hero-placeholder">
            <meta.Icon size={48} strokeWidth={1.25} />
            <span>Add a photo of {resource.name}</span>
          </div>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <div>
            <span className="section-label">
              <meta.Icon size={12} />
              {meta.label}
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '.3rem' }}>{resource.name}</h1>
            <p style={{ color: 'var(--muted)', marginTop: '.4rem', maxWidth: 560, lineHeight: 1.65 }}>
              {RESOURCE_DESCS[resource.id] ?? 'Campus resource available for booking.'}
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(`/book/${resourceId}/slots`)}
            style={{ flexShrink: 0 }}
          >
            Book this resource
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Info cards */}
        <div className="detail-info-grid">
          {[
            { Icon: Clock,       label: 'Operating Hours',  val: '7:00 AM – 10:00 PM' },
            { Icon: Timer,       label: 'Booking Duration', val: '30 min – 8 hours'   },
            { Icon: CalendarDays,label: 'Advance Booking',  val: 'Up to 30 days'      },
            { Icon: Users,       label: 'Capacity',         val: resource.capacity > 1 ? `${resource.capacity} people` : 'Single unit' },
            { Icon: MapPin,      label: 'Location',         val: RESOURCE_BUILDING[resource.id] ?? 'Campus' },
          ].map(({ Icon, label, val }) => (
            <div key={label} className="detail-info-card">
              <div className="detail-info-icon"><Icon size={16} strokeWidth={2} /></div>
              <div>
                <div className="detail-info-label">{label}</div>
                <div className="detail-info-val">{val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming bookings */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '.85rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <CalendarDays size={16} strokeWidth={2} />
            Upcoming bookings
          </h2>
          {upcoming.length === 0 ? (
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem', color: 'var(--muted)', fontSize: '.9rem', textAlign: 'center' }}>
              No upcoming bookings — this resource is wide open.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              {upcoming.map(b => (
                <div key={b.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '.7rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '.875rem' }}>
                  <span style={{ fontWeight: 600, minWidth: 110, color: 'var(--text)' }}>{fmtDate(b.date)}</span>
                  <span style={{ color: 'var(--muted)', flex: 1 }}>{b.startTime} – {b.endTime}</span>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>{b.status.charAt(0) + b.status.slice(1).toLowerCase()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate(`/book/${resourceId}/slots`)}>
          Select a time slot
          <ArrowRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

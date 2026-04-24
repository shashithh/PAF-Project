import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CalendarDays, Clock, Building2,
  Users, FileText, User, Mail, ArrowRight
} from 'lucide-react'
import { submitBooking } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import { useBookingContext } from '../../context/BookingContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import '../../styles/flow.css'

const fmtDate = d => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  : ''
const fmtT = t => {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export default function BookingFormPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { addBooking } = useBookingContext()
  const { selectedResource, selectedDate, selectedSlot, setConfirmedBooking } = useBookingFlow()

  const [purpose, setPurpose]       = useState('')
  const [attendees, setAttendees]   = useState('')
  const [name, setName]             = useState(currentUser?.name ?? '')
  const [email, setEmail]           = useState(currentUser?.email ?? '')
  const [errors, setErrors]         = useState({})
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)

  if (!selectedResource || !selectedDate || !selectedSlot) {
    navigate(`/book/${resourceId ?? ''}`)
    return null
  }

  const validate = () => {
    const e = {}
    if (!purpose.trim() || purpose.trim().length < 5)
      e.purpose = 'Please describe the purpose (min 5 characters).'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (inFlight.current) return
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    inFlight.current = true
    setSubmitting(true)
    try {
      const saved = await submitBooking({
        userId:       currentUser.id,
        userName:     currentUser.name,
        resourceId:   selectedResource.id,
        resourceName: selectedResource.name,
        date:         selectedDate,
        startTime:    selectedSlot.startTime,
        endTime:      selectedSlot.endTime,
        purpose:      purpose.trim(),
        attendees:    attendees ? parseInt(attendees, 10) : 0,
      })
      addBooking(saved)
      setConfirmedBooking(saved)
      navigate(`/book/${resourceId}/confirmation`)
    } catch (err) {
      setErrors({ submit: err?.message ?? 'Submission failed. Please try again.' })
      inFlight.current = false
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <button className="back-link" onClick={() => navigate(`/book/${resourceId}/slots`)}>
          <ArrowLeft size={15} strokeWidth={2} />
          Back to time slots
        </button>

        <div className="page-header">
          <h1 className="page-title">Reserve a resource</h1>
          <p className="page-sub">Fill in the details below. Conflicts are checked automatically.</p>
        </div>

        <div className="booking-form-layout">
          {/* ── Form ── */}
          <div className="booking-form-card">
            <form onSubmit={handleSubmit} noValidate>

              {/* Resource */}
              <div className="form-group">
                <label className="label">Resource</label>
                <div className="prefilled-field">
                  <Building2 size={15} strokeWidth={2} color="var(--muted-2)" />
                  {selectedResource.name}
                </div>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="label">Date</label>
                <div className="prefilled-field">
                  <CalendarDays size={15} strokeWidth={2} color="var(--muted-2)" />
                  {fmtDate(selectedDate)}
                </div>
              </div>

              {/* Times */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label">Start time</label>
                  <div className="prefilled-field">
                    <Clock size={15} strokeWidth={2} color="var(--muted-2)" />
                    {fmtT(selectedSlot.startTime)}
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">End time</label>
                  <div className="prefilled-field">
                    <Clock size={15} strokeWidth={2} color="var(--muted-2)" />
                    {fmtT(selectedSlot.endTime)}
                  </div>
                </div>
              </div>

              {/* Purpose */}
              <div className="form-group">
                <label className="label" htmlFor="purpose">
                  <FileText size={13} strokeWidth={2} style={{ display: 'inline', marginRight: '.3rem', verticalAlign: 'middle' }} />
                  Purpose <span style={{ color: 'var(--red)' }}>*</span>
                </label>
                <textarea
                  id="purpose"
                  className={`textarea${errors.purpose ? ' input-error' : ''}`}
                  placeholder="What is this booking for? (e.g. Final year project sprint)"
                  value={purpose}
                  onChange={e => { setPurpose(e.target.value); setErrors(p => ({ ...p, purpose: '' })) }}
                  rows={4}
                />
                {errors.purpose && <span className="error-msg">{errors.purpose}</span>}
              </div>

              {/* Attendees */}
              <div className="form-group">
                <label className="label" htmlFor="attendees">
                  <Users size={13} strokeWidth={2} style={{ display: 'inline', marginRight: '.3rem', verticalAlign: 'middle' }} />
                  Number of attendees
                </label>
                <input
                  id="attendees"
                  className="input"
                  type="number"
                  min={1}
                  max={selectedResource.capacity}
                  placeholder={`1 – ${selectedResource.capacity}`}
                  value={attendees}
                  onChange={e => setAttendees(e.target.value)}
                />
                <span className="field-hint">Max capacity: {selectedResource.capacity}</span>
              </div>

              {/* Name + Email */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label" htmlFor="bk-name">
                    <User size={13} strokeWidth={2} style={{ display: 'inline', marginRight: '.3rem', verticalAlign: 'middle' }} />
                    Your name
                  </label>
                  <input
                    id="bk-name" className="input"
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="bk-email">
                    <Mail size={13} strokeWidth={2} style={{ display: 'inline', marginRight: '.3rem', verticalAlign: 'middle' }} />
                    Email
                  </label>
                  <input
                    id="bk-email" className="input" type="email"
                    value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="jane@university.edu"
                  />
                </div>
              </div>

              {errors.submit && (
                <div className="error-box" style={{ marginBottom: '1rem' }}>
                  {errors.submit}
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button" className="btn btn-outline"
                  onClick={() => navigate(`/book/${resourceId}/slots`)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting
                    ? <><span className="spinner" />Submitting…</>
                    : <>Submit booking <ArrowRight size={15} strokeWidth={2.5} /></>}
                </button>
              </div>
            </form>
          </div>

          {/* ── Summary sidebar ── */}
          <div className="booking-summary-card">
            <div className="booking-summary-title">Booking summary</div>
            {[
              { Icon: Building2,    key: 'Resource', val: selectedResource.name },
              { Icon: CalendarDays, key: 'Date',     val: fmtDate(selectedDate) },
              { Icon: Clock,        key: 'Time',     val: `${fmtT(selectedSlot.startTime)} – ${fmtT(selectedSlot.endTime)}` },
              { Icon: Users,        key: 'Capacity', val: `Up to ${selectedResource.capacity}` },
            ].map(({ Icon, key, val }) => (
              <div key={key} className="summary-row">
                <span className="summary-key">
                  <Icon size={13} strokeWidth={2} />
                  {key}
                </span>
                <span className="summary-val">{val}</span>
              </div>
            ))}

            <div style={{ marginTop: '1.25rem', padding: '.85rem', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', fontSize: '.82rem', color: 'var(--primary)', lineHeight: 1.55 }}>
              Your booking will be pending admin approval. You'll be notified once reviewed.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

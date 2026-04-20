import React, { useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { submitBooking } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import { useBookingContext } from '../../context/BookingContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import '../../styles/flow.css'

const fmt = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) : ''
const fmtT = t => { if(!t) return ''; const [h,m]=t.split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}` }

export default function BookingFormPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { addBooking } = useBookingContext()
  const { selectedResource, selectedDate, selectedSlot, setConfirmedBooking } = useBookingFlow()

  const [purpose, setPurpose]     = useState('')
  const [name, setName]           = useState(currentUser?.name ?? '')
  const [email, setEmail]         = useState(currentUser?.email ?? '')
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const inFlight = useRef(false)

  if (!selectedResource || !selectedDate || !selectedSlot) {
    navigate(`/book/${resourceId ?? ''}`)
    return null
  }

  const validate = () => {
    const e = {}
    if (!purpose.trim() || purpose.trim().length < 5) e.purpose = 'Please describe the purpose (min 5 chars).'
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
        userId: currentUser.id, userName: currentUser.name,
        resourceId: selectedResource.id, resourceName: selectedResource.name,
        date: selectedDate, startTime: selectedSlot.startTime, endTime: selectedSlot.endTime,
        purpose: purpose.trim(),
      })
      addBooking(saved)
      setConfirmedBooking(saved)
      navigate(`/book/${resourceId}/confirmation`)
    } catch (err) {
      setErrors({ submit: err?.message ?? 'Submission failed.' })
      inFlight.current = false
    } finally { setSubmitting(false) }
  }

  return (
    <div className="flow-page">
      <div className="flow-inner flow-narrow">
        <button className="back-link" onClick={() => navigate(`/book/${resourceId}/slots`)}>
          ← Back to resources
        </button>

        <div className="page-header">
          <h1 className="page-title">Reserve a resource</h1>
          <p className="page-sub">Tell us what you need and when. We'll check for conflicts automatically.</p>
        </div>

        <div className="booking-form-card">
          <form onSubmit={handleSubmit} noValidate>

            {/* Resource (pre-filled, read-only) */}
            <div className="form-group">
              <label className="label">Resource</label>
              <div className="input" style={{background:'var(--surface-2)',color:'var(--muted)',cursor:'default'}}>
                {selectedResource.name}
              </div>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="label">Date</label>
              <div className="input" style={{background:'var(--surface-2)',color:'var(--muted)',cursor:'default',display:'flex',alignItems:'center',gap:'.5rem'}}>
                <span>📅</span> {fmt(selectedDate)}
              </div>
            </div>

            {/* Times */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="label">Start time</label>
                <div className="input" style={{background:'var(--surface-2)',color:'var(--muted)',cursor:'default',display:'flex',alignItems:'center',gap:'.5rem'}}>
                  <span>🕐</span> {fmtT(selectedSlot.startTime)}
                </div>
              </div>
              <div className="form-group">
                <label className="label">End time</label>
                <div className="input" style={{background:'var(--surface-2)',color:'var(--muted)',cursor:'default',display:'flex',alignItems:'center',gap:'.5rem'}}>
                  <span>🕐</span> {fmtT(selectedSlot.endTime)}
                </div>
              </div>
            </div>

            {/* Purpose */}
            <div className="form-group">
              <label className="label" htmlFor="purpose">Purpose</label>
              <textarea
                id="purpose"
                className={`textarea${errors.purpose ? ' input-error' : ''}`}
                placeholder="What is this booking for?"
                value={purpose}
                onChange={e => { setPurpose(e.target.value); setErrors(p=>({...p,purpose:''})) }}
                rows={4}
              />
              {errors.purpose && <span className="error-msg">{errors.purpose}</span>}
            </div>

            {/* Name + Email */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="label" htmlFor="bk-name">Your name</label>
                <input id="bk-name" className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div className="form-group">
                <label className="label" htmlFor="bk-email">Email</label>
                <input id="bk-email" className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="jane@university.edu" />
              </div>
            </div>

            {errors.submit && <div className="error-box" style={{marginBottom:'1rem'}}>⚠️ {errors.submit}</div>}

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={() => navigate(`/book/${resourceId}/slots`)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <><span className="spinner" />Submitting…</> : 'Submit booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

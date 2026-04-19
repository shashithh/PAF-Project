import React, { useState } from 'react'
import { resources } from '../data/mockBookings.js'
import '../styles/form.css'

// Icon map for resource types — extend as needed
const RESOURCE_ICONS = {
  r1: '🖥️',
  r2: '🖥️',
  r3: '🏢',
  r4: '🔬',
  r5: '📽️',
}

const PURPOSE_MAX = 200

function BookingForm({ bookings, currentUser, onAddBooking, onNotify }) {
  const [form, setForm] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
  })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedResource = resources.find((r) => r.id === form.resourceId)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    if (errors.conflict) setErrors((prev) => ({ ...prev, conflict: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.resourceId) newErrors.resourceId = 'Please select a resource.'
    if (!form.date)       newErrors.date       = 'Please select a date.'
    if (!form.startTime)  newErrors.startTime  = 'Please enter a start time.'
    if (!form.endTime)    newErrors.endTime    = 'Please enter an end time.'
    if (!form.purpose.trim()) newErrors.purpose = 'Please describe the purpose.'

    if (form.startTime && form.endTime && form.endTime <= form.startTime)
      newErrors.endTime = 'End time must be after start time.'

    const today = new Date().toISOString().split('T')[0]
    if (form.date && form.date < today)
      newErrors.date = 'Date cannot be in the past.'

    return newErrors
  }

  const hasConflict = () => {
    const newStart = `${form.date}T${form.startTime}`
    const newEnd   = `${form.date}T${form.endTime}`
    return bookings
      .filter(
        (b) =>
          b.resourceId === form.resourceId &&
          (b.status === 'PENDING' || b.status === 'APPROVED')
      )
      .find((b) => {
        const existStart = `${b.date}T${b.startTime}`
        const existEnd   = `${b.date}T${b.endTime}`
        return existStart < newEnd && existEnd > newStart
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const conflict = hasConflict()
    if (conflict) {
      setErrors({
        conflict: `This resource is already booked from ${conflict.startTime} to ${conflict.endTime} on ${conflict.date}.`,
      })
      return
    }

    setLoading(true)
    // Simulate async API call — replace with real fetch when backend is ready
    await new Promise((r) => setTimeout(r, 900))

    const newBooking = {
      id: `b${Date.now()}`,
      userId: currentUser.id,
      resourceId: form.resourceId,
      resourceName: selectedResource?.name || form.resourceId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      purpose: form.purpose,
      status: 'PENDING',
    }

    onAddBooking(newBooking)
    onNotify('Booking submitted successfully!')
    setSubmitted(true)
    setLoading(false)

    // Reset after brief success flash
    setTimeout(() => {
      setForm({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '' })
      setErrors({})
      setSubmitted(false)
    }, 1800)
  }

  // Derived: show summary preview when resource + date + both times are filled
  const showPreview =
    form.resourceId && form.date && form.startTime && form.endTime &&
    form.endTime > form.startTime

  const formattedDate = form.date
    ? new Date(form.date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      })
    : ''

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>

      {/* ── Header ── */}
      <div className="form-header">
        <div className="form-header-icon">📋</div>
        <div>
          <h2 className="form-title">New Booking</h2>
          <p className="form-subtitle">Fill in the details to reserve a campus resource.</p>
        </div>
      </div>

      {/* ── Success state ── */}
      {submitted && (
        <div className="form-success">
          <span className="form-success-icon">✅</span>
          <div>
            <strong>Booking submitted!</strong>
            <p>Your request is pending admin approval.</p>
          </div>
        </div>
      )}

      {/* ── Section: Resource ── */}
      <fieldset className="form-section">
        <legend className="form-section-label">
          <span className="section-step">1</span> Resource
        </legend>

        <div className="form-group">
          <label htmlFor="resourceId">Select a resource</label>
          <div className="select-wrapper">
            <select
              id="resourceId"
              name="resourceId"
              value={form.resourceId}
              onChange={handleChange}
              className={errors.resourceId ? 'input-error' : ''}
              aria-describedby={errors.resourceId ? 'resourceId-error' : undefined}
            >
              <option value="">— Choose a resource —</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {RESOURCE_ICONS[r.id] ?? '📦'} {r.name}
                </option>
              ))}
            </select>
            <span className="select-chevron" aria-hidden="true">▾</span>
          </div>
          {errors.resourceId && (
            <span id="resourceId-error" className="error-msg" role="alert">
              {errors.resourceId}
            </span>
          )}
        </div>

        {/* Resource chip — shown once selected */}
        {selectedResource && (
          <div className="resource-chip">
            <span className="resource-chip-icon">
              {RESOURCE_ICONS[selectedResource.id] ?? '📦'}
            </span>
            <span className="resource-chip-name">{selectedResource.name}</span>
            <span className="resource-chip-badge">Available</span>
          </div>
        )}
      </fieldset>

      {/* ── Section: Date & Time ── */}
      <fieldset className="form-section">
        <legend className="form-section-label">
          <span className="section-step">2</span> Date &amp; Time
        </legend>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={errors.date ? 'input-error' : ''}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && (
            <span id="date-error" className="error-msg" role="alert">
              {errors.date}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className={errors.startTime ? 'input-error' : ''}
              aria-describedby={errors.startTime ? 'startTime-error' : undefined}
            />
            {errors.startTime && (
              <span id="startTime-error" className="error-msg" role="alert">
                {errors.startTime}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className={errors.endTime ? 'input-error' : ''}
              aria-describedby={errors.endTime ? 'endTime-error' : undefined}
            />
            {errors.endTime && (
              <span id="endTime-error" className="error-msg" role="alert">
                {errors.endTime}
              </span>
            )}
          </div>
        </div>

        {/* Inline duration hint */}
        {showPreview && (
          <div className="duration-hint">
            🕐 Duration:{' '}
            <strong>
              {(() => {
                const [sh, sm] = form.startTime.split(':').map(Number)
                const [eh, em] = form.endTime.split(':').map(Number)
                const mins = (eh * 60 + em) - (sh * 60 + sm)
                const h = Math.floor(mins / 60)
                const m = mins % 60
                return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}`.trim() : `${m}m`
              })()}
            </strong>
          </div>
        )}
      </fieldset>

      {/* ── Section: Purpose ── */}
      <fieldset className="form-section">
        <legend className="form-section-label">
          <span className="section-step">3</span> Purpose
        </legend>

        <div className="form-group">
          <label htmlFor="purpose">Describe your booking</label>
          <textarea
            id="purpose"
            name="purpose"
            rows={3}
            maxLength={PURPOSE_MAX}
            placeholder="e.g. Final year project meeting, lab session for CS301…"
            value={form.purpose}
            onChange={handleChange}
            className={errors.purpose ? 'input-error' : ''}
            aria-describedby={errors.purpose ? 'purpose-error' : 'purpose-count'}
          />
          <div className="textarea-footer">
            {errors.purpose
              ? <span id="purpose-error" className="error-msg" role="alert">{errors.purpose}</span>
              : <span />
            }
            <span
              id="purpose-count"
              className={`char-count ${form.purpose.length >= PURPOSE_MAX * 0.9 ? 'char-count-warn' : ''}`}
            >
              {form.purpose.length}/{PURPOSE_MAX}
            </span>
          </div>
        </div>
      </fieldset>

      {/* ── Conflict error ── */}
      {errors.conflict && (
        <div className="error-banner" role="alert">
          <span className="error-banner-icon">⚠️</span>
          <div>
            <strong>Scheduling conflict</strong>
            <p>{errors.conflict}</p>
          </div>
        </div>
      )}

      {/* ── Booking summary preview ── */}
      {showPreview && !errors.conflict && (
        <div className="booking-preview">
          <p className="preview-label">Booking summary</p>
          <div className="preview-grid">
            <span className="preview-icon">📦</span>
            <span>{selectedResource?.name}</span>
            <span className="preview-icon">📅</span>
            <span>{formattedDate}</span>
            <span className="preview-icon">🕐</span>
            <span>{form.startTime} – {form.endTime}</span>
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        className="btn-primary"
        disabled={loading || submitted}
        aria-busy={loading}
      >
        {loading
          ? <><span className="spinner" aria-hidden="true" /> Submitting…</>
          : submitted
            ? '✅ Submitted'
            : 'Submit Booking'
        }
      </button>
    </form>
  )
}

export default BookingForm

import React, { useState } from 'react'
import { resources } from '../data/mockBookings.js'
import '../styles/form.css'

function BookingForm({ bookings, currentUser, onAddBooking, onNotify }) {
  const [form, setForm] = useState({
    resourceId: '',
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.resourceId) newErrors.resourceId = 'Please select a resource.'
    if (!form.date) newErrors.date = 'Please select a date.'
    if (!form.startTime) newErrors.startTime = 'Please enter a start time.'
    if (!form.endTime) newErrors.endTime = 'Please enter an end time.'
    if (!form.purpose.trim()) newErrors.purpose = 'Please enter a purpose.'
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      newErrors.endTime = 'End time must be after start time.'
    }
    const today = new Date().toISOString().split('T')[0]
    if (form.date && form.date < today) {
      newErrors.date = 'Date cannot be in the past.'
    }
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
        conflict: `Conflict with existing booking (${conflict.startTime}–${conflict.endTime} on ${conflict.date}).`,
      })
      return
    }

    setLoading(true)
    // Simulate async API call — replace with real fetch when backend is ready
    await new Promise((r) => setTimeout(r, 800))

    const resource = resources.find((r) => r.id === form.resourceId)
    const newBooking = {
      id: `b${Date.now()}`,
      userId: currentUser.id,
      resourceId: form.resourceId,
      resourceName: resource?.name || form.resourceId,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      purpose: form.purpose,
      status: 'PENDING',
    }

    onAddBooking(newBooking)
    onNotify('Booking submitted successfully!')
    setForm({ resourceId: '', date: '', startTime: '', endTime: '', purpose: '' })
    setErrors({})
    setLoading(false)
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <h2 className="form-title">New Booking</h2>

      {/* Resource */}
      <div className="form-group">
        <label htmlFor="resourceId">Resource</label>
        <select
          id="resourceId"
          name="resourceId"
          value={form.resourceId}
          onChange={handleChange}
          className={errors.resourceId ? 'input-error' : ''}
        >
          <option value="">— Select a resource —</option>
          {resources.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {errors.resourceId && <span className="error-msg">{errors.resourceId}</span>}
      </div>

      {/* Date */}
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className={errors.date ? 'input-error' : ''}
        />
        {errors.date && <span className="error-msg">{errors.date}</span>}
      </div>

      {/* Time row */}
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
          />
          {errors.startTime && <span className="error-msg">{errors.startTime}</span>}
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
          />
          {errors.endTime && <span className="error-msg">{errors.endTime}</span>}
        </div>
      </div>

      {/* Purpose */}
      <div className="form-group">
        <label htmlFor="purpose">Purpose</label>
        <textarea
          id="purpose"
          name="purpose"
          rows={3}
          placeholder="Describe the purpose of your booking…"
          value={form.purpose}
          onChange={handleChange}
          className={errors.purpose ? 'input-error' : ''}
        />
        {errors.purpose && <span className="error-msg">{errors.purpose}</span>}
      </div>

      {/* Conflict error */}
      {errors.conflict && (
        <div className="error-banner">⚠️ {errors.conflict}</div>
      )}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? <span className="spinner" /> : null}
        {loading ? 'Submitting…' : 'Submit Booking'}
      </button>
    </form>
  )
}

export default BookingForm

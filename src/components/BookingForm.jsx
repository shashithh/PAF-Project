import React from 'react'
import { resources } from '../data/mockBookings.js'
import { useBookingForm, PURPOSE_MAX } from '../hooks/useBookingForm.js'
import '../styles/form.css'

const RESOURCE_ICONS = {
  r1: '🖥️',
  r2: '🖥️',
  r3: '🏢',
  r4: '🔬',
  r5: '📽️',
}

function BookingForm({ currentUser }) {
  const {
    form,
    errors,
    submitting,
    submitted,
    handleChange,
    handleSubmit,
    selectedResource,
    duration,
    formattedDate,
    showPreview,
    purposeLength,
  } = useBookingForm(currentUser)

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>

      {/* ── Header ── */}
      <div className="form-header">
        <div className="form-header-icon">📋</div>
        <div>
          <h2 className="form-title">New Booking</h2>
          <p className="form-subtitle">
            Fill in the details to reserve a campus resource.
          </p>
        </div>
      </div>

      {/* ── Success banner ── */}
      {submitted && (
        <div className="form-success" role="status">
          <span className="form-success-icon">✅</span>
          <div>
            <strong>Booking submitted!</strong>
            <p>Your request is pending admin approval.</p>
          </div>
        </div>
      )}

      {/* ══ Section 1: Resource ══ */}
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
              aria-invalid={!!errors.resourceId}
            >
              <option value="">— Choose a resource —</option>
              {resources.map((r) => (
                <option key={r.id} value={r.id}>
                  {RESOURCE_ICONS[r.id] ?? '📦'} {r.name}
                  {r.capacity ? ` (cap. ${r.capacity})` : ''}
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

        {selectedResource && (
          <div className="resource-chip">
            <span className="resource-chip-icon" aria-hidden="true">
              {RESOURCE_ICONS[selectedResource.id] ?? '📦'}
            </span>
            <span className="resource-chip-name">{selectedResource.name}</span>
            {selectedResource.capacity && (
              <span className="resource-chip-meta">
                Cap. {selectedResource.capacity}
              </span>
            )}
            <span className="resource-chip-badge">Available</span>
          </div>
        )}
      </fieldset>

      {/* ══ Section 2: Date & Time ══ */}
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
            aria-invalid={!!errors.date}
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
              aria-invalid={!!errors.startTime}
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
              aria-invalid={!!errors.endTime}
            />
            {errors.endTime && (
              <span id="endTime-error" className="error-msg" role="alert">
                {errors.endTime}
              </span>
            )}
          </div>
        </div>

        {duration && (
          <div className="duration-hint">
            🕐 Duration: <strong>{duration}</strong>
          </div>
        )}
      </fieldset>

      {/* ══ Section 3: Purpose ══ */}
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
            aria-describedby={
              errors.purpose ? 'purpose-error' : 'purpose-count'
            }
            aria-invalid={!!errors.purpose}
          />
          <div className="textarea-footer">
            {errors.purpose ? (
              <span id="purpose-error" className="error-msg" role="alert">
                {errors.purpose}
              </span>
            ) : (
              <span />
            )}
            <span
              id="purpose-count"
              className={`char-count ${
                purposeLength >= PURPOSE_MAX * 0.9 ? 'char-count-warn' : ''
              }`}
              aria-live="polite"
            >
              {purposeLength}/{PURPOSE_MAX}
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
        <div className="booking-preview" aria-label="Booking summary">
          <p className="preview-label">Booking summary</p>
          <div className="preview-grid">
            <span className="preview-icon" aria-hidden="true">📦</span>
            <span>{selectedResource?.name}</span>
            <span className="preview-icon" aria-hidden="true">📅</span>
            <span>{formattedDate}</span>
            <span className="preview-icon" aria-hidden="true">🕐</span>
            <span>
              {form.startTime} – {form.endTime}
              {duration && (
                <span className="preview-duration"> · {duration}</span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        className="btn-primary"
        disabled={submitting || submitted}
        aria-busy={submitting}
      >
        {submitting ? (
          <><span className="spinner" aria-hidden="true" /> Submitting…</>
        ) : submitted ? (
          '✅ Submitted'
        ) : (
          'Submit Booking'
        )}
      </button>
    </form>
  )
}

export default BookingForm

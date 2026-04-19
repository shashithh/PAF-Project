import React from 'react'
import { resources } from '../data/mockBookings.js'
import {
  useBookingForm,
  PURPOSE_MAX,
  OPERATING_START,
  OPERATING_END,
  MIN_DURATION_MINS,
  MAX_DURATION_MINS,
  formatDuration,
} from '../hooks/useBookingForm.js'
import '../styles/form.css'

const RESOURCE_ICONS = {
  r1: '🖥️',
  r2: '🖥️',
  r3: '🏢',
  r4: '🔬',
  r5: '📽️',
}

/** Convert 24-h hour number → "H am/pm" label */
function fmtHour(h) {
  const ampm = h < 12 ? 'am' : 'pm'
  return `${h % 12 || 12}${ampm}`
}

function BookingForm({ currentUser }) {
  const {
    form,
    errors,
    touched,
    submitting,
    submitted,
    submitErr,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    selectedResource,
    duration,
    durationMins,
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
          <div className="form-success-body">
            <strong>Booking submitted!</strong>
            <p>Your request is pending admin approval.</p>
          </div>
          <button
            type="button"
            className="btn-success-reset"
            onClick={reset}
            aria-label="Submit another booking"
          >
            Book another
          </button>
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
              onBlur={handleBlur}
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

        {/* Operating hours hint */}
        <p className="field-hint">
          Bookings available {fmtHour(OPERATING_START)} – {fmtHour(OPERATING_END)},
          {' '}{MIN_DURATION_MINS} min – {formatDuration(MAX_DURATION_MINS)} per session.
        </p>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            onBlur={handleBlur}
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
              onBlur={handleBlur}
              min={`${String(OPERATING_START).padStart(2, '0')}:00`}
              max={`${String(OPERATING_END  ).padStart(2, '0')}:00`}
              className={errors.startTime ? 'input-error' : ''}
              aria-describedby={errors.startTime ? 'startTime-error' : 'time-constraints'}
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
              onBlur={handleBlur}
              min={form.startTime || `${String(OPERATING_START).padStart(2, '0')}:00`}
              max={`${String(OPERATING_END).padStart(2, '0')}:00`}
              className={errors.endTime ? 'input-error' : ''}
              aria-describedby={errors.endTime ? 'endTime-error' : 'time-constraints'}
              aria-invalid={!!errors.endTime}
            />
            {errors.endTime && (
              <span id="endTime-error" className="error-msg" role="alert">
                {errors.endTime}
              </span>
            )}
          </div>
        </div>

        {/* Duration feedback — shown as soon as both times are valid */}
        {durationMins !== null && (
          <div
            id="time-constraints"
            className={`duration-hint ${
              durationMins < MIN_DURATION_MINS || durationMins > MAX_DURATION_MINS
                ? 'duration-hint-warn'
                : 'duration-hint-ok'
            }`}
          >
            {durationMins < MIN_DURATION_MINS ? '⚠️' :
             durationMins > MAX_DURATION_MINS ? '⚠️' : '🕐'}{' '}
            Duration: <strong>{duration}</strong>
            {durationMins < MIN_DURATION_MINS && (
              <span className="duration-rule">
                {' '}· min {MIN_DURATION_MINS} min
              </span>
            )}
            {durationMins > MAX_DURATION_MINS && (
              <span className="duration-rule">
                {' '}· max {formatDuration(MAX_DURATION_MINS)}
              </span>
            )}
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
            onBlur={handleBlur}
            className={errors.purpose ? 'input-error' : ''}
            aria-describedby={errors.purpose ? 'purpose-error' : 'purpose-count'}
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

      {/* ── Server / submission error ── */}
      {submitErr && !errors.conflict && (
        <div className="error-banner" role="alert">
          <span className="error-banner-icon">🚫</span>
          <div>
            <strong>Submission failed</strong>
            <p>{submitErr}</p>
          </div>
        </div>
      )}

      {/* ── Booking summary preview ── */}
      {showPreview && !errors.conflict && !errors.startTime && !errors.endTime && (
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

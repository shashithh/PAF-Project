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
    conflictWarn,
    checkingConflict,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    dismissConflictWarn,
    selectedResource,
    duration,
    durationMins,
    formattedDate,
    showPreview,
    purposeLength,
  } = useBookingForm(currentUser)

  // True when a live conflict warning is active (not yet dismissed, not a submit error)
  const hasLiveConflict  = Boolean(conflictWarn && !errors.conflict)
  // True when a hard conflict error was returned at submit time
  const hasSubmitConflict = Boolean(errors.conflict)
  // Disable submit while checking or while a live conflict is unresolved
  const submitBlocked = submitting || submitted || checkingConflict || hasLiveConflict

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

        {/* Resource chip — availability reflects conflict state */}
        {selectedResource && (
          <div className={`resource-chip ${hasLiveConflict || hasSubmitConflict ? 'resource-chip-conflict' : ''}`}>
            <span className="resource-chip-icon" aria-hidden="true">
              {RESOURCE_ICONS[selectedResource.id] ?? '📦'}
            </span>
            <span className="resource-chip-name">{selectedResource.name}</span>
            {selectedResource.capacity && (
              <span className="resource-chip-meta">Cap. {selectedResource.capacity}</span>
            )}
            {checkingConflict ? (
              <span className="resource-chip-badge resource-chip-checking">
                <span className="spinner-sm" aria-hidden="true" /> Checking…
              </span>
            ) : hasLiveConflict || hasSubmitConflict ? (
              <span className="resource-chip-badge resource-chip-unavailable">
                Unavailable
              </span>
            ) : (
              <span className="resource-chip-badge">Available</span>
            )}
          </div>
        )}
      </fieldset>

      {/* ══ Section 2: Date & Time ══ */}
      <fieldset className="form-section">
        <legend className="form-section-label">
          <span className="section-step">2</span> Date &amp; Time
        </legend>

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
              max={`${String(OPERATING_END).padStart(2, '0')}:00`}
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

        {/* Duration feedback */}
        {durationMins !== null && (
          <div
            id="time-constraints"
            className={`duration-hint ${
              durationMins < MIN_DURATION_MINS || durationMins > MAX_DURATION_MINS
                ? 'duration-hint-warn'
                : 'duration-hint-ok'
            }`}
          >
            {durationMins < MIN_DURATION_MINS || durationMins > MAX_DURATION_MINS ? '⚠️' : '🕐'}{' '}
            Duration: <strong>{duration}</strong>
            {durationMins < MIN_DURATION_MINS && (
              <span className="duration-rule"> · min {MIN_DURATION_MINS} min</span>
            )}
            {durationMins > MAX_DURATION_MINS && (
              <span className="duration-rule"> · max {formatDuration(MAX_DURATION_MINS)}</span>
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
            ) : <span />}
            <span
              id="purpose-count"
              className={`char-count ${purposeLength >= PURPOSE_MAX * 0.9 ? 'char-count-warn' : ''}`}
              aria-live="polite"
            >
              {purposeLength}/{PURPOSE_MAX}
            </span>
          </div>
        </div>
      </fieldset>

      {/* ── Live conflict warning (amber — detected on blur, before submit) ── */}
      {hasLiveConflict && (
        <div className="conflict-warning" role="alert" aria-live="assertive">
          <div className="conflict-warning-body">
            <span className="conflict-warning-icon" aria-hidden="true">⚠️</span>
            <div>
              <strong>This slot is already taken</strong>
              <p>{conflictWarn}</p>
            </div>
          </div>
          <div className="conflict-warning-actions">
            <p className="conflict-warning-hint">
              Choose a different time or resource to continue.
            </p>
            <button
              type="button"
              className="btn-conflict-dismiss"
              onClick={dismissConflictWarn}
              aria-label="Dismiss conflict warning"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ── Hard conflict error (red — returned at submit time) ── */}
      {hasSubmitConflict && (
        <div className="error-banner" role="alert">
          <span className="error-banner-icon">🚫</span>
          <div>
            <strong>Scheduling conflict</strong>
            <p>{errors.conflict}</p>
            <p className="error-banner-hint">
              Please select a different time slot or resource.
            </p>
          </div>
        </div>
      )}

      {/* ── Server / submission error ── */}
      {submitErr && !hasSubmitConflict && (
        <div className="error-banner" role="alert">
          <span className="error-banner-icon">🚫</span>
          <div>
            <strong>Submission failed</strong>
            <p>{submitErr}</p>
          </div>
        </div>
      )}

      {/* ── Booking summary preview ── */}
      {showPreview && !hasLiveConflict && !hasSubmitConflict && !errors.startTime && !errors.endTime && (
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
              {duration && <span className="preview-duration"> · {duration}</span>}
            </span>
          </div>
        </div>
      )}

      {/* ── Submit ── */}
      <button
        type="submit"
        className="btn-primary"
        disabled={submitBlocked}
        aria-busy={submitting || checkingConflict}
        aria-describedby={hasLiveConflict ? 'live-conflict-block' : undefined}
      >
        {submitting ? (
          <><span className="spinner" aria-hidden="true" /> Submitting…</>
        ) : checkingConflict ? (
          <><span className="spinner" aria-hidden="true" /> Checking availability…</>
        ) : submitted ? (
          '✅ Submitted'
        ) : hasLiveConflict ? (
          '⚠️ Slot unavailable'
        ) : (
          'Submit Booking'
        )}
      </button>

      {/* Screen-reader description for blocked submit */}
      {hasLiveConflict && (
        <p id="live-conflict-block" className="sr-only">
          Submit is disabled because this time slot has a conflict. Please choose different times.
        </p>
      )}
    </form>
  )
}

export default BookingForm

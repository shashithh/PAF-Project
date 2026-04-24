import React from 'react'

const RESOURCE_TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'PROJECTOR', 'CAMERA', 'OTHER']

const TYPE_LABELS = {
  LECTURE_HALL: 'Lecture Hall', LAB: 'Lab', MEETING_ROOM: 'Meeting Room',
  PROJECTOR: 'Projector', CAMERA: 'Camera', OTHER: 'Other',
}

export default function ResourceForm({ formData, onChange, onSubmit, errors = {}, loading = false, submitLabel = 'Save', onCancel }) {
  const field = (name) => ({
    value: formData[name] ?? '',
    onChange: (e) => onChange(name, e.target.value),
  })

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-0">

      {/* Section 1: Identity */}
      <FormSection title="Resource Identity" subtitle="Basic identification details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Resource Code" required error={errors.resourceCode}>
            <input
              type="text"
              className={`input ${errors.resourceCode ? 'input-error' : ''}`}
              placeholder="e.g. LH-001"
              {...field('resourceCode')}
              required
            />
          </Field>
          <Field label="Resource Name" required error={errors.resourceName}>
            <input
              type="text"
              className={`input ${errors.resourceName ? 'input-error' : ''}`}
              placeholder="e.g. Main Auditorium"
              {...field('resourceName')}
              required
            />
          </Field>
        </div>
      </FormSection>

      <div className="h-px bg-surface-border my-6" />

      {/* Section 2: Classification */}
      <FormSection title="Classification" subtitle="Type, capacity, and location">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Resource Type" required error={errors.resourceType}>
            <select
              className={`input ${errors.resourceType ? 'input-error' : ''}`}
              {...field('resourceType')}
              required
            >
              <option value="">Select type…</option>
              {RESOURCE_TYPES.map(t => (
                <option key={t} value={t}>{TYPE_LABELS[t]}</option>
              ))}
            </select>
          </Field>
          <Field label="Capacity" required error={errors.capacity}>
            <input
              type="number" min="0"
              className={`input ${errors.capacity ? 'input-error' : ''}`}
              placeholder="e.g. 100"
              {...field('capacity')}
              required
            />
          </Field>
        </div>
        <Field label="Location" required error={errors.location} className="mt-5">
          <input
            type="text"
            className={`input ${errors.location ? 'input-error' : ''}`}
            placeholder="e.g. Block A, Ground Floor"
            {...field('location')}
            required
          />
        </Field>
      </FormSection>

      <div className="h-px bg-surface-border my-6" />

      {/* Section 3: Availability & Status */}
      <FormSection title="Availability & Status" subtitle="Operating hours and current status">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Available From" error={errors.availableFrom}>
            <input type="time" className={`input ${errors.availableFrom ? 'input-error' : ''}`} {...field('availableFrom')} />
          </Field>
          <Field label="Available To" error={errors.availableTo}>
            <input type="time" className={`input ${errors.availableTo ? 'input-error' : ''}`} {...field('availableTo')} />
          </Field>
        </div>
        <Field label="Status" className="mt-5">
          <select className="input" {...field('status')}>
            <option value="ACTIVE">Active</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
        </Field>
      </FormSection>

      <div className="h-px bg-surface-border my-6" />

      {/* Section 4: Description */}
      <FormSection title="Description" subtitle="Optional additional details">
        <Field label="Description" error={errors.description}>
          <textarea
            rows={4}
            className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            placeholder="Optional: additional notes, features, or usage guidelines…"
            {...field('description')}
          />
        </Field>
      </FormSection>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-6 border-t border-surface-border mt-6">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Saving…
            </span>
          ) : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        )}
      </div>
    </form>
  )
}

function FormSection({ title, subtitle, children }) {
  return (
    <div>
      <div className="mb-5">
        <h3 className="text-sm font-bold text-ink">{title}</h3>
        {subtitle && <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-500 mt-1.5 font-medium">{error}</p>}
    </div>
  )
}

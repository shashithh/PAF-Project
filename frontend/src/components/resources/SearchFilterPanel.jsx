import React from 'react'

const RESOURCE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'LECTURE_HALL', label: 'Lecture Hall' },
  { value: 'LAB', label: 'Lab' },
  { value: 'MEETING_ROOM', label: 'Meeting Room' },
  { value: 'PROJECTOR', label: 'Projector' },
  { value: 'CAMERA', label: 'Camera' },
  { value: 'OTHER', label: 'Other' },
]

const STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
]

export default function SearchFilterPanel({ filters, onChange, onReset }) {
  const hasFilters = filters.type || filters.location || filters.status || filters.minCapacity

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-ink">Filter Resources</h2>
        </div>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-rose-50"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="label text-xs">Type</label>
          <select value={filters.type || ''} onChange={e => onChange('type', e.target.value)} className="input text-sm">
            {RESOURCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label text-xs">Location</label>
          <input
            type="text" value={filters.location || ''}
            onChange={e => onChange('location', e.target.value)}
            placeholder="e.g. Block A"
            className="input text-sm"
          />
        </div>
        <div>
          <label className="label text-xs">Status</label>
          <select value={filters.status || ''} onChange={e => onChange('status', e.target.value)} className="input text-sm">
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="label text-xs">Min Capacity</label>
          <input
            type="number" value={filters.minCapacity || ''}
            onChange={e => onChange('minCapacity', e.target.value)}
            placeholder="e.g. 50" min="0"
            className="input text-sm"
          />
        </div>
      </div>

      {hasFilters && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-xs text-ink-muted font-medium">Active filters:</span>
          {filters.type && <FilterChip label={`Type: ${filters.type}`} onRemove={() => onChange('type', '')} />}
          {filters.location && <FilterChip label={`Location: ${filters.location}`} onRemove={() => onChange('location', '')} />}
          {filters.status && <FilterChip label={`Status: ${filters.status}`} onRemove={() => onChange('status', '')} />}
          {filters.minCapacity && <FilterChip label={`Min cap: ${filters.minCapacity}`} onRemove={() => onChange('minCapacity', '')} />}
        </div>
      )}
    </div>
  )
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 border border-primary-200 px-2.5 py-1 rounded-full text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900 transition-colors">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}

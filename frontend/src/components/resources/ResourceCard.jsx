import React from 'react'
import { useNavigate } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'
import ResourceTypeBadge from '../common/ResourceTypeBadge'

export default function ResourceCard({ resource, isAdmin, onDelete, onStatusToggle }) {
  const navigate = useNavigate()

  const handleDelete = (e) => { e.stopPropagation(); onDelete(resource.id) }
  const handleToggle = (e) => {
    e.stopPropagation()
    const ns = resource.status === 'ACTIVE' ? 'OUT_OF_SERVICE' : 'ACTIVE'
    onStatusToggle(resource.id, ns)
  }

  return (
    <div
      onClick={() => navigate(`/resources/${resource.id}`)}
      className="card-hover cursor-pointer group p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-mono text-ink-muted mb-1 truncate">{resource.resourceCode}</p>
          <h3 className="text-sm font-bold text-ink group-hover:text-primary-700 transition-colors truncate">
            {resource.resourceName}
          </h3>
        </div>
        <StatusBadge status={resource.status} />
      </div>

      {/* Type + meta */}
      <div className="space-y-2.5">
        <ResourceTypeBadge type={resource.resourceType} />

        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <svg className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{resource.location}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-ink-secondary">
          <svg className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Capacity: <span className="font-semibold text-ink">{resource.capacity}</span></span>
        </div>

        {resource.availableFrom && resource.availableTo && (
          <div className="flex items-center gap-2 text-xs text-ink-secondary">
            <svg className="w-3.5 h-3.5 text-ink-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{resource.availableFrom} – {resource.availableTo}</span>
          </div>
        )}
      </div>

      {/* Admin actions */}
      {isAdmin && (
        <div
          className="flex items-center gap-1 pt-3 border-t border-surface-border"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => navigate(`/resources/${resource.id}/edit`)}
            title="Edit"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold
                       text-ink-secondary hover:text-primary-700 hover:bg-primary-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>

          <button
            onClick={handleToggle}
            title="Toggle status"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold
                       text-ink-secondary hover:text-gold-700 hover:bg-gold-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Toggle
          </button>

          <button
            onClick={handleDelete}
            title="Delete"
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold
                       text-ink-secondary hover:text-rose-600 hover:bg-rose-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

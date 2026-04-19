import React, { useState, useMemo } from 'react'
import BookingCard from './BookingCard.jsx'
import '../styles/list.css'

/* ── Constants ─────────────────────────────────────────────── */
const STATUS_FILTERS = [
  { key: 'ALL',       label: 'All',       icon: '📋' },
  { key: 'PENDING',   label: 'Pending',   icon: '⏳' },
  { key: 'APPROVED',  label: 'Approved',  icon: '✅' },
  { key: 'REJECTED',  label: 'Rejected',  icon: '❌' },
  { key: 'CANCELLED', label: 'Cancelled', icon: '🚫' },
]

const SORT_OPTIONS = [
  { key: 'date-desc', label: 'Newest first'  },
  { key: 'date-asc',  label: 'Oldest first'  },
  { key: 'name-asc',  label: 'Resource A–Z'  },
  { key: 'name-desc', label: 'Resource Z–A'  },
]

/* ── Empty-state messages per filter ───────────────────────── */
const EMPTY_MESSAGES = {
  ALL:       { icon: '📭', title: 'No bookings yet',          sub: 'Submitted bookings will appear here.' },
  PENDING:   { icon: '⏳', title: 'No pending bookings',      sub: 'Nothing is waiting for approval.'     },
  APPROVED:  { icon: '✅', title: 'No approved bookings',     sub: 'Approved bookings will show here.'    },
  REJECTED:  { icon: '❌', title: 'No rejected bookings',     sub: 'Rejected bookings will show here.'    },
  CANCELLED: { icon: '🚫', title: 'No cancelled bookings',    sub: 'Cancelled bookings will show here.'   },
}

/* ── Sort helper ────────────────────────────────────────────── */
function sortBookings(list, sortKey) {
  return [...list].sort((a, b) => {
    switch (sortKey) {
      case 'date-asc':
        return `${a.date}T${a.startTime}` < `${b.date}T${b.startTime}` ? -1 : 1
      case 'date-desc':
        return `${a.date}T${a.startTime}` > `${b.date}T${b.startTime}` ? -1 : 1
      case 'name-asc':
        return a.resourceName.localeCompare(b.resourceName)
      case 'name-desc':
        return b.resourceName.localeCompare(a.resourceName)
      default:
        return 0
    }
  })
}

/* ── Component ─────────────────────────────────────────────── */
function BookingList({ bookings, onCancel, onApprove, onReject, showAdminControls }) {
  const [filter,   setFilter]   = useState('ALL')
  const [sort,     setSort]     = useState('date-desc')
  const [viewMode, setViewMode] = useState('grid')   // 'grid' | 'list'

  /* counts per status for filter badges */
  const counts = useMemo(() => {
    const map = { ALL: bookings.length }
    bookings.forEach((b) => {
      map[b.status] = (map[b.status] ?? 0) + 1
    })
    return map
  }, [bookings])

  /* filtered + sorted list */
  const displayed = useMemo(() => {
    const filtered = filter === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === filter)
    return sortBookings(filtered, sort)
  }, [bookings, filter, sort])

  const empty = EMPTY_MESSAGES[filter]

  return (
    <section className="booking-list" aria-label="Bookings list">

      {/* ── Toolbar ── */}
      <div className="list-toolbar">

        {/* Filter pills */}
        <div className="filter-bar" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map(({ key, label, icon }) => (
            <button
              key={key}
              className={`filter-btn ${filter === key ? 'filter-active' : ''}`}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
              {counts[key] > 0 && (
                <span className={`filter-count ${filter === key ? 'filter-count-active' : ''}`}>
                  {counts[key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Sort + view toggle */}
        <div className="list-controls">
          <label htmlFor="sort-select" className="sr-only">Sort bookings</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort bookings"
          >
            {SORT_OPTIONS.map(({ key, label }) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'view-btn-active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              title="Grid view"
            >
              ⊞
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'view-btn-active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              title="List view"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* ── Result count ── */}
      {displayed.length > 0 && (
        <p className="result-count" aria-live="polite">
          Showing <strong>{displayed.length}</strong>{' '}
          {displayed.length === 1 ? 'booking' : 'bookings'}
          {filter !== 'ALL' && <> · <span className="result-filter-tag">{filter.toLowerCase()}</span></>}
        </p>
      )}

      {/* ── Cards / Empty state ── */}
      {displayed.length === 0 ? (
        <div className="empty-state" role="status">
          <span className="empty-icon" aria-hidden="true">{empty.icon}</span>
          <p className="empty-title">{empty.title}</p>
          <p className="empty-sub">{empty.sub}</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'cards-grid' : 'cards-list'}>
          {displayed.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={onCancel}
              onApprove={onApprove}
              onReject={onReject}
              showAdminControls={showAdminControls}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default BookingList

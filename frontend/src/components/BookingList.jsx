import React, { useState, useMemo } from 'react'
import BookingCard from './BookingCard.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'
import '../styles/list.css'

/* ── Constants ─────────────────────────────────────────────── */
const STATUS_FILTERS = [
  { key: 'ALL',       label: 'All',       icon: '📋', colorClass: ''                   },
  { key: 'PENDING',   label: 'Pending',   icon: '⏳', colorClass: 'filter-btn-pending'  },
  { key: 'APPROVED',  label: 'Approved',  icon: '✅', colorClass: 'filter-btn-approved' },
  { key: 'REJECTED',  label: 'Rejected',  icon: '❌', colorClass: 'filter-btn-rejected' },
  { key: 'CANCELLED', label: 'Cancelled', icon: '🚫', colorClass: 'filter-btn-cancelled'},
]

const SORT_OPTIONS = [
  { key: 'date-desc', label: 'Newest first' },
  { key: 'date-asc',  label: 'Oldest first' },
  { key: 'name-asc',  label: 'Resource A–Z' },
  { key: 'name-desc', label: 'Resource Z–A' },
]

const EMPTY_MESSAGES = {
  user: {
    ALL:       { icon: '📅', title: 'No bookings yet',       sub: 'Use the form to reserve a resource.' },
    PENDING:   { icon: '⏳', title: 'No pending bookings',   sub: 'Nothing is waiting for approval.'    },
    APPROVED:  { icon: '✅', title: 'No approved bookings',  sub: 'Approved bookings will show here.'   },
    REJECTED:  { icon: '❌', title: 'No rejected bookings',  sub: 'Rejected bookings will show here.'   },
    CANCELLED: { icon: '🚫', title: 'No cancelled bookings', sub: 'Cancelled bookings will show here.'  },
  },
  admin: {
    ALL:       { icon: '📭', title: 'No bookings yet',       sub: 'Submitted bookings will appear here.' },
    PENDING:   { icon: '⏳', title: 'No pending bookings',   sub: 'Nothing is waiting for approval.'     },
    APPROVED:  { icon: '✅', title: 'No approved bookings',  sub: 'Approved bookings will show here.'    },
    REJECTED:  { icon: '❌', title: 'No rejected bookings',  sub: 'Rejected bookings will show here.'    },
    CANCELLED: { icon: '🚫', title: 'No cancelled bookings', sub: 'Cancelled bookings will show here.'   },
  },
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

/**
 * Group a sorted list into { upcoming, past } buckets.
 * "Upcoming" = today or later; "Past" = before today.
 */
function groupByTime(list) {
  const today = new Date().toISOString().split('T')[0]
  const upcoming = list.filter((b) => b.date >= today)
  const past     = list.filter((b) => b.date  < today)
  return { upcoming, past }
}

/* ── Component ─────────────────────────────────────────────── */
function BookingList({ scope = 'user', currentUserId, title }) {
  const { bookings, loading } = useBookingContext()

  const [filter,   setFilter]   = useState('ALL')
  const [sort,     setSort]     = useState('date-desc')
  const [viewMode, setViewMode] = useState('grid')

  const showAdminControls = scope === 'admin'

  /* ── Source list ── */
  const sourceBookings = useMemo(() => {
    if (scope === 'admin') return bookings
    return bookings.filter((b) => b.userId === currentUserId)
  }, [bookings, scope, currentUserId])

  /* ── Per-status counts ── */
  const counts = useMemo(() => {
    const map = { ALL: sourceBookings.length }
    sourceBookings.forEach((b) => {
      map[b.status] = (map[b.status] ?? 0) + 1
    })
    return map
  }, [sourceBookings])

  /* ── Filtered + sorted list ── */
  const displayed = useMemo(() => {
    const filtered = filter === 'ALL'
      ? sourceBookings
      : sourceBookings.filter((b) => b.status === filter)
    return sortBookings(filtered, sort)
  }, [sourceBookings, filter, sort])

  /* ── Date groups (user scope only, grid view only) ── */
  const groups = useMemo(() => {
    if (scope !== 'user' || viewMode !== 'grid') return null
    return groupByTime(displayed)
  }, [displayed, scope, viewMode])

  const empty = EMPTY_MESSAGES[scope][filter]

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <section className="booking-list" aria-label="Bookings list" aria-busy="true">
        {title && <h2 className="list-title">{title}</h2>}
        <div className="skeleton-toolbar">
          <div className="skeleton skeleton-bar" />
          <div className="skeleton skeleton-bar skeleton-bar-sm" />
        </div>
        <div className="cards-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-line skeleton-line-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line skeleton-line-sm" />
              <div className="skeleton skeleton-line skeleton-line-sm" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="booking-list" aria-label="Bookings list">

      {title && <h2 className="list-title">{title}</h2>}

      {/* ── Toolbar ── */}
      <div className="list-toolbar">
        <div className="filter-bar" role="group" aria-label="Filter by status">
          {STATUS_FILTERS.map(({ key, label, icon, colorClass }) => (
            <button
              key={key}
              className={`filter-btn ${colorClass} ${filter === key ? 'filter-active' : ''}`}
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
          {filter !== 'ALL' && (
            <> · <span className={`result-filter-tag result-filter-tag-${filter.toLowerCase()}`}>
              {filter.toLowerCase()}
            </span></>
          )}
        </p>
      )}

      {/* ── Empty state ── */}
      {displayed.length === 0 && (
        <div className="empty-state" role="status">
          <span className="empty-icon" aria-hidden="true">{empty.icon}</span>
          <p className="empty-title">{empty.title}</p>
          <p className="empty-sub">{empty.sub}</p>
        </div>
      )}

      {/* ── Grouped user view (grid only) ── */}
      {displayed.length > 0 && groups && (
        <>
          {groups.upcoming.length > 0 && (
            <div className="booking-group">
              <h3 className="group-heading">
                <span className="group-heading-dot group-dot-upcoming" aria-hidden="true" />
                Upcoming
                <span className="group-count">{groups.upcoming.length}</span>
              </h3>
              <div className="cards-grid">
                {groups.upcoming.map((b) => (
                  <BookingCard key={b.id} booking={b} showAdminControls={false} currentUserId={currentUserId} />
                ))}
              </div>
            </div>
          )}

          {groups.past.length > 0 && (
            <div className="booking-group">
              <h3 className="group-heading group-heading-muted">
                <span className="group-heading-dot group-dot-past" aria-hidden="true" />
                Past
                <span className="group-count">{groups.past.length}</span>
              </h3>
              <div className="cards-grid">
                {groups.past.map((b) => (
                  <BookingCard key={b.id} booking={b} showAdminControls={false} currentUserId={currentUserId} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Flat list (admin scope or list view mode) ── */}
      {displayed.length > 0 && !groups && (
        <div className={viewMode === 'grid' ? 'cards-grid' : 'cards-list'}>
          {displayed.map((b) => (
            <BookingCard key={b.id} booking={b} showAdminControls={showAdminControls} />
          ))}
        </div>
      )}
    </section>
  )
}

export default BookingList

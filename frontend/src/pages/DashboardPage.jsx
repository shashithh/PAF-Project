import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Building2, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookingContext } from '../context/BookingContext.jsx'

const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

const statusBadge = s => ({
  APPROVED: 'badge-green', PENDING: 'badge-warn',
  REJECTED: 'badge-red', CANCELLED: 'badge-gray',
}[s] || 'badge-gray')

export default function DashboardPage() {
  const { currentUser, isAdmin } = useAuth()
  const { bookings, stats, loading } = useBookingContext()

  const myBookings = useMemo(() =>
    bookings.filter(b => b.userId === currentUser?.id).slice(0, 5),
    [bookings, currentUser]
  )

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = currentUser?.name?.split(' ')[0]

  const myTotal   = bookings.filter(b => b.userId === currentUser?.id).length
  const myPending = bookings.filter(b => b.userId === currentUser?.id && b.status === 'PENDING').length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-3)', marginBottom: 6 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
          {greeting}, {firstName} 👋
        </h1>
        <p style={{ color: 'var(--text-2)', marginTop: 6 }}>
          Here's what's happening at your campus today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'My Bookings',  value: myTotal,    Icon: CalendarDays, color: 'var(--primary)', to: '/bookings' },
          { label: 'Pending',      value: myPending,  Icon: TrendingUp,   color: 'var(--warn)',    to: '/bookings' },
          { label: 'Resources',    value: 5,          Icon: Building2,    color: 'var(--accent)',  to: '/book' },
          { label: 'Role',         value: currentUser?.role, Icon: ShieldCheck, color: '#c084fc', to: '#' },
          ...(isAdmin ? [
            { label: 'All Bookings', value: stats.TOTAL,    Icon: CalendarDays, color: 'var(--primary)', to: '/admin' },
            { label: 'Approved',     value: stats.APPROVED, Icon: TrendingUp,   color: 'var(--accent)',  to: '/admin' },
          ] : []),
        ].slice(0, 4).map(({ label, value, Icon, color, to }) => (
          <Link to={to} key={label} style={{ textDecoration: 'none' }}>
            <div
              className="stat-card"
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = ''}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="stat-label">{label}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={color} />
                </div>
              </div>
              <div className="stat-value" style={{ color }}>{value}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: 'var(--text-2)' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to="/bookings" className="btn btn-primary">
            <CalendarDays size={16} /> New Booking
          </Link>
          <Link to="/book" className="btn btn-ghost">
            <Building2 size={16} /> Browse Resources
          </Link>
          {isAdmin && (
            <Link to="/admin" className="btn btn-ghost">
              <ShieldCheck size={16} /> Admin Panel
            </Link>
          )}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Bookings</h2>
          <Link to="/bookings" style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : myBookings.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px 0' }}>
            <CalendarDays size={28} />
            <div style={{ fontSize: '0.85rem' }}>No bookings yet</div>
          </div>
        ) : (
          myBookings.map(b => (
            <div key={b.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid var(--card-border)',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{b.resourceName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>
                  {fmtDate(b.date)} · {b.startTime?.slice(0,5)}–{b.endTime?.slice(0,5)}
                </div>
              </div>
              <span className={`badge ${statusBadge(b.status)}`}>{b.status}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

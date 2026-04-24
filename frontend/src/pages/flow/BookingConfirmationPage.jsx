import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle, Building2, CalendarDays, Clock,
  FileText, Hash, ArrowRight, BookOpen, PlusCircle
} from 'lucide-react'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import '../../styles/flow.css'

const fmtDate = d => d
  ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  : '—'
const fmtT = t => {
  if (!t) return '—'
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

const STATUS_STYLES = {
  PENDING:   { bg: 'var(--amber-light)',  color: '#b45309', border: '#fde68a' },
  APPROVED:  { bg: 'var(--green-light)',  color: '#15803d', border: '#86efac' },
  REJECTED:  { bg: 'var(--red-light)',    color: '#b91c1c', border: '#fca5a5' },
  CANCELLED: { bg: 'var(--bg-muted)',     color: 'var(--muted)', border: 'var(--border)' },
}

export default function BookingConfirmationPage() {
  const navigate = useNavigate()
  const { confirmedBooking, selectedResource, selectedDate, selectedSlot, reset } = useBookingFlow()

  const name   = confirmedBooking?.resourceName ?? selectedResource?.name ?? '—'
  const date   = confirmedBooking?.date         ?? selectedDate            ?? '—'
  const start  = confirmedBooking?.startTime    ?? selectedSlot?.startTime ?? '—'
  const end    = confirmedBooking?.endTime      ?? selectedSlot?.endTime   ?? '—'
  const purp   = confirmedBooking?.purpose      ?? '—'
  const id     = confirmedBooking?.id           ?? null
  const status = confirmedBooking?.status       ?? 'PENDING'
  const sc     = STATUS_STYLES[status] ?? STATUS_STYLES.PENDING

  return (
    <div className="flow-page">
      <div className="confirm-page">
        {/* Success icon */}
        <div className="confirm-icon-wrap">
          <CheckCircle size={36} strokeWidth={2} />
        </div>

        <h1 className="confirm-title">Booking submitted!</h1>
        <p className="confirm-sub">
          Your request is <strong>pending admin approval</strong>.<br />
          You'll be notified once it's reviewed.
        </p>

        {/* Details card */}
        <div className="confirm-card">
          <dl style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { Icon: Building2,    label: 'Resource', val: name },
              { Icon: CalendarDays, label: 'Date',     val: fmtDate(date) },
              { Icon: Clock,        label: 'Time',     val: `${fmtT(start)} – ${fmtT(end)}` },
              { Icon: FileText,     label: 'Purpose',  val: purp },
            ].map(({ Icon, label, val }) => (
              <div key={label} className="confirm-row">
                <dt>
                  <Icon size={14} strokeWidth={2} />
                  {label}
                </dt>
                <dd>{val}</dd>
              </div>
            ))}

            {/* Status */}
            <div className="confirm-row">
              <dt>Status</dt>
              <dd>
                <span style={{
                  padding: '.22rem .7rem', borderRadius: '999px',
                  fontSize: '.7rem', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '.05em', background: sc.bg, color: sc.color,
                  border: `1px solid ${sc.border}`,
                }}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </span>
              </dd>
            </div>

            {/* Reference ID */}
            {id && (
              <div className="confirm-row">
                <dt>
                  <Hash size={14} strokeWidth={2} />
                  Reference
                </dt>
                <dd className="confirm-ref">{id}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Actions */}
        <div className="confirm-actions">
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={() => { reset(); navigate('/book') }}
          >
            <PlusCircle size={16} strokeWidth={2} />
            Book another resource
          </button>
          <button
            className="btn btn-outline btn-full"
            onClick={() => navigate('/')}
          >
            <BookOpen size={16} strokeWidth={2} />
            View my bookings
          </button>
        </div>
      </div>
    </div>
  )
}

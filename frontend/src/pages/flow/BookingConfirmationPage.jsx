import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import '../../styles/flow.css'

const fmt = d => d ? new Date(d+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'}) : '—'
const fmtT = t => { if(!t) return '—'; const [h,m]=t.split(':').map(Number); return `${h%12||12}:${String(m).padStart(2,'0')} ${h<12?'AM':'PM'}` }

const STATUS_COLORS = {
  PENDING:   { bg:'#fff8e1', color:'#e65100', border:'#ffe082' },
  APPROVED:  { bg:'#e8f5e9', color:'#2e7d32', border:'#a5d6a7' },
  REJECTED:  { bg:'#fce4ec', color:'#c62828', border:'#f48fb1' },
  CANCELLED: { bg:'#f5f5f0', color:'#6b6b60', border:'#d0cdc5' },
}

export default function BookingConfirmationPage() {
  const navigate = useNavigate()
  const { confirmedBooking, selectedResource, selectedDate, selectedSlot, reset } = useBookingFlow()

  const name  = confirmedBooking?.resourceName ?? selectedResource?.name ?? '—'
  const date  = confirmedBooking?.date         ?? selectedDate            ?? '—'
  const start = confirmedBooking?.startTime    ?? selectedSlot?.startTime ?? '—'
  const end   = confirmedBooking?.endTime      ?? selectedSlot?.endTime   ?? '—'
  const purp  = confirmedBooking?.purpose      ?? '—'
  const id    = confirmedBooking?.id           ?? null
  const status = confirmedBooking?.status      ?? 'PENDING'
  const sc    = STATUS_COLORS[status] ?? STATUS_COLORS.PENDING

  return (
    <div className="flow-page">
      <div className="confirm-page">
        <div className="confirm-icon">✅</div>
        <h1 className="confirm-title">Booking Submitted!</h1>
        <p className="confirm-sub">
          Your request is <strong>pending admin approval</strong>. You'll be notified once it's reviewed.
        </p>

        <div className="confirm-card">
          <dl className="confirm-details" style={{display:'flex',flexDirection:'column'}}>
            {[
              ['📦 Resource', name],
              ['📅 Date', fmt(date)],
              ['🕐 Time', `${fmtT(start)} – ${fmtT(end)}`],
              ['📝 Purpose', purp],
            ].map(([k,v]) => (
              <div key={k} className="confirm-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div className="confirm-row">
              <dt>🔖 Status</dt>
              <dd>
                <span style={{padding:'.2rem .65rem',borderRadius:'999px',fontSize:'.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',background:sc.bg,color:sc.color,border:`1px solid ${sc.border}`}}>
                  {status}
                </span>
              </dd>
            </div>
            {id && (
              <div className="confirm-row">
                <dt># Reference</dt>
                <dd style={{fontFamily:'monospace',fontSize:'.82rem',color:'var(--green)',wordBreak:'break-all'}}>{id}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="confirm-actions">
          <button className="btn btn-primary btn-full btn-lg" onClick={() => { reset(); navigate('/book') }}>
            Book another resource
          </button>
          <button className="btn btn-outline btn-full" onClick={() => navigate('/')}>
            View my bookings
          </button>
        </div>
      </div>
    </div>
  )
}

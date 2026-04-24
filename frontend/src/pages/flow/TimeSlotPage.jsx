import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, CheckCircle, XCircle, MinusCircle } from 'lucide-react'
import { checkConflict } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import '../../styles/flow.css'

function generateSlots() {
  const slots = []
  for (let h = 7; h < 22; h++) {
    const s = `${String(h).padStart(2, '0')}:00`
    const e = `${String(h + 1).padStart(2, '0')}:00`
    const fmt = t => {
      const [hh] = t.split(':').map(Number)
      return `${hh % 12 || 12}:00 ${hh < 12 ? 'AM' : 'PM'}`
    }
    slots.push({ startTime: s, endTime: e, label: `${fmt(s)} – ${fmt(e)}` })
  }
  return slots
}
const ALL_SLOTS = generateSlots()

function getDates() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return {
      iso: d.toISOString().split('T')[0],
      label: i === 0
        ? 'Today'
        : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    }
  })
}
const DATES = getDates()

export default function TimeSlotPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const { selectedResource, selectedDate, setSelectedDate, setSelectedSlot } = useBookingFlow()
  const [statuses, setStatuses] = useState({})
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    if (!selectedDate) setSelectedDate(DATES[0].iso)
  }, [selectedDate, setSelectedDate])

  const checkAll = useCallback(async (date) => {
    if (!date || !resourceId) return
    setChecking(true)
    const s = {}
    await Promise.all(ALL_SLOTS.map(async ({ startTime, endTime }) => {
      try {
        const r = await checkConflict({ resourceId, date, startTime, endTime })
        s[startTime] = r.conflict ? 'taken' : 'free'
      } catch {
        s[startTime] = 'free'
      }
    }))
    setStatuses(s)
    setChecking(false)
  }, [resourceId])

  useEffect(() => {
    if (selectedDate) checkAll(selectedDate)
  }, [selectedDate, checkAll])

  const now = new Date()
  const todayIso = now.toISOString().split('T')[0]
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const isPast = s => selectedDate === todayIso && parseInt(s.startTime) * 60 <= nowMins

  const pick = (slot) => {
    if (statuses[slot.startTime] === 'taken' || isPast(slot)) return
    setSelectedSlot(slot)
    navigate(`/book/${resourceId}/form`)
  }

  const freeCount = ALL_SLOTS.filter(s => !isPast(s) && statuses[s.startTime] !== 'taken').length

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <button className="back-link" onClick={() => navigate(`/book/${resourceId}`)}>
          <ArrowLeft size={15} strokeWidth={2} />
          Back to resource
        </button>

        <div className="page-header">
          <h1 className="page-title">{selectedResource?.name ?? 'Select a time slot'}</h1>
          <p className="page-sub">
            {checking
              ? 'Checking availability…'
              : `${freeCount} slot${freeCount !== 1 ? 's' : ''} available on this day`}
          </p>
        </div>

        {/* Date strip */}
        <div className="slot-date-strip">
          {DATES.map(({ iso, label }) => (
            <button
              key={iso}
              className={`slot-date-btn${selectedDate === iso ? ' active' : ''}`}
              onClick={() => setSelectedDate(iso)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="slot-legend">
          <span>
            <span className="slot-legend-dot" style={{ background: 'var(--green-light)', border: '1px solid #86efac' }} />
            Available
          </span>
          <span>
            <span className="slot-legend-dot" style={{ background: 'var(--red-light)', border: '1px solid #fca5a5' }} />
            Taken
          </span>
          <span>
            <span className="slot-legend-dot" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }} />
            Past / Unavailable
          </span>
        </div>

        {/* Slot grid */}
        <div className="slot-grid">
          {ALL_SLOTS.map(slot => {
            const past = isPast(slot)
            const st = past ? 'past' : (checking ? 'checking' : (statuses[slot.startTime] ?? 'free'))
            return (
              <button
                key={slot.startTime}
                className={`slot-btn slot-${st}`}
                onClick={() => pick(slot)}
                disabled={st === 'taken' || st === 'past' || st === 'checking'}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.35rem' }}>
                  {st === 'free'     && <CheckCircle  size={13} strokeWidth={2} />}
                  {st === 'taken'    && <XCircle      size={13} strokeWidth={2} />}
                  {st === 'past'     && <MinusCircle  size={13} strokeWidth={2} />}
                  {st === 'checking' && <Clock        size={13} strokeWidth={2} />}
                  {slot.label}
                </div>
                {st === 'taken' && <div className="slot-sub">Taken</div>}
                {st === 'past'  && <div className="slot-sub">Past</div>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { checkConflict } from '../../services/bookingService.js'
import { useBookingFlow } from '../../context/BookingFlowContext.jsx'
import '../../styles/flow.css'

function generateSlots() {
  const slots = []
  for (let h = 7; h < 22; h++) {
    const s = `${String(h).padStart(2,'0')}:00`
    const e = `${String(h+1).padStart(2,'0')}:00`
    const fmt = t => { const [hh]=t.split(':').map(Number); return `${hh%12||12}:00 ${hh<12?'AM':'PM'}` }
    slots.push({ startTime:s, endTime:e, label:`${fmt(s)} – ${fmt(e)}` })
  }
  return slots
}
const ALL_SLOTS = generateSlots()

function getDates() {
  return Array.from({length:14},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()+i)
    return {
      iso: d.toISOString().split('T')[0],
      label: i===0 ? 'Today' : d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}),
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

  useEffect(() => { if (!selectedDate) setSelectedDate(DATES[0].iso) }, [selectedDate, setSelectedDate])

  const checkAll = useCallback(async (date) => {
    if (!date || !resourceId) return
    setChecking(true)
    const s = {}
    await Promise.all(ALL_SLOTS.map(async ({startTime,endTime}) => {
      try {
        const r = await checkConflict({resourceId,date,startTime,endTime})
        s[startTime] = r.conflict ? 'taken' : 'free'
      } catch { s[startTime] = 'free' }
    }))
    setStatuses(s)
    setChecking(false)
  }, [resourceId])

  useEffect(() => { if (selectedDate) checkAll(selectedDate) }, [selectedDate, checkAll])

  const now = new Date()
  const todayIso = now.toISOString().split('T')[0]
  const nowMins = now.getHours()*60+now.getMinutes()
  const isPast = s => selectedDate===todayIso && (parseInt(s.startTime)*60+0) <= nowMins

  const pick = (slot) => {
    if (statuses[slot.startTime]==='taken' || isPast(slot)) return
    setSelectedSlot(slot)
    navigate(`/book/${resourceId}/form`)
  }

  return (
    <div className="flow-page">
      <div className="flow-inner">
        <button className="back-link" onClick={() => navigate(`/book/${resourceId}`)}>
          ← Back to resource
        </button>

        <div className="page-header">
          <h1 className="page-title">{selectedResource?.name ?? 'Select a time slot'}</h1>
          <p className="page-sub">Pick a date and an available 1-hour slot.</p>
        </div>

        {/* Date strip */}
        <div className="slot-date-strip">
          {DATES.map(({iso,label}) => (
            <button key={iso} className={`slot-date-btn${selectedDate===iso?' active':''}`} onClick={() => setSelectedDate(iso)}>
              {label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="slot-legend">
          <span><span className="slot-legend-dot" style={{background:'#e8f5e9',border:'1px solid #a5d6a7'}} />Available</span>
          <span><span className="slot-legend-dot" style={{background:'#fce4ec',border:'1px solid #f48fb1'}} />Taken</span>
          <span><span className="slot-legend-dot" style={{background:'var(--surface-2)',border:'1px solid var(--border)'}} />Past</span>
        </div>

        {/* Slots */}
        <div className="slot-grid">
          {ALL_SLOTS.map(slot => {
            const past = isPast(slot)
            const st = past ? 'past' : (checking ? 'checking' : (statuses[slot.startTime] ?? 'free'))
            return (
              <button
                key={slot.startTime}
                className={`slot-btn slot-${st==='free'?'free':st==='taken'?'taken':st==='past'?'past':'checking'}`}
                onClick={() => pick(slot)}
                disabled={st==='taken'||st==='past'||st==='checking'}
              >
                {slot.label}
                {st==='taken' && <div style={{fontSize:'.68rem',opacity:.8}}>Taken</div>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

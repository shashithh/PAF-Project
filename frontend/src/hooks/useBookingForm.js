import { useState, useMemo, useCallback, useRef } from 'react'
import { resources } from '../data/mockBookings.js'
import { useBookingContext } from '../context/BookingContext.jsx'
import { submitBooking, createBookingPayload } from '../services/bookingService.js'

/* ══════════════════════════════════════
   Constants
   ══════════════════════════════════════ */
export const PURPOSE_MAX = 200

/** Earliest bookable hour (inclusive), 24-h */
export const OPERATING_START = 7    // 07:00
/** Latest bookable end hour (inclusive), 24-h */
export const OPERATING_END   = 22   // 22:00
/** Minimum booking length in minutes */
export const MIN_DURATION_MINS = 30
/** Maximum booking length in minutes */
export const MAX_DURATION_MINS = 8 * 60  // 8 hours

const EMPTY_FORM = {
  resourceId: '',
  date:       '',
  startTime:  '',
  endTime:    '',
  purpose:    '',
}

/* ══════════════════════════════════════
   Pure time helpers
   ══════════════════════════════════════ */

/** Convert "HH:MM" → total minutes since midnight */
function toMins(timeStr) {
  if (!timeStr) return null
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/** Format minutes-since-midnight → "H:MM am/pm" */
function fmtTime(mins) {
  const h   = Math.floor(mins / 60)
  const m   = mins % 60
  const ampm = h < 12 ? 'am' : 'pm'
  const h12  = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

/** Format a minute count → "Xh Ym" / "Xh" / "Ym" */
export function formatDuration(mins) {
  if (mins == null || mins <= 0) return null
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

/* ══════════════════════════════════════
   Time validation rules
   Each rule receives the parsed form values
   and returns an error string or null.
   ══════════════════════════════════════ */
const TIME_RULES = [
  // 1. Both fields must be present (handled by required check, but guard here too)
  ({ startMins, endMins }) => {
    if (startMins === null || endMins === null) return null
    return null
  },

  // 2. End must be strictly after start
  ({ startMins, endMins }) => {
    if (startMins === null || endMins === null) return null
    if (endMins <= startMins)
      return { field: 'endTime', msg: 'End time must be after start time.' }
    return null
  },

  // 3. Minimum duration
  ({ startMins, endMins }) => {
    if (startMins === null || endMins === null) return null
    const dur = endMins - startMins
    if (dur > 0 && dur < MIN_DURATION_MINS)
      return {
        field: 'endTime',
        msg: `Minimum booking duration is ${MIN_DURATION_MINS} minutes.`,
      }
    return null
  },

  // 4. Maximum duration
  ({ startMins, endMins }) => {
    if (startMins === null || endMins === null) return null
    const dur = endMins - startMins
    if (dur > MAX_DURATION_MINS)
      return {
        field: 'endTime',
        msg: `Maximum booking duration is ${formatDuration(MAX_DURATION_MINS)}.`,
      }
    return null
  },

  // 5. Start time within operating hours
  ({ startMins }) => {
    if (startMins === null) return null
    if (startMins < OPERATING_START * 60)
      return {
        field: 'startTime',
        msg: `Bookings open from ${fmtTime(OPERATING_START * 60)}.`,
      }
    return null
  },

  // 6. End time within operating hours
  ({ endMins }) => {
    if (endMins === null) return null
    if (endMins > OPERATING_END * 60)
      return {
        field: 'endTime',
        msg: `Bookings must end by ${fmtTime(OPERATING_END * 60)}.`,
      }
    return null
  },

  // 7. On today's date, start time must not be in the past
  ({ startMins, date }) => {
    if (startMins === null || !date) return null
    const today = new Date().toISOString().split('T')[0]
    if (date !== today) return null
    const now = new Date()
    const nowMins = now.getHours() * 60 + now.getMinutes()
    if (startMins <= nowMins)
      return { field: 'startTime', msg: 'Start time has already passed today.' }
    return null
  },
]

/* ══════════════════════════════════════
   useBookingForm
   ══════════════════════════════════════ */
export function useBookingForm(currentUser) {
  const { bookings, addBooking, reportSubmitError, notify } = useBookingContext()

  const [form,       setForm]       = useState(EMPTY_FORM)
  const [errors,     setErrors]     = useState({})
  const [touched,    setTouched]    = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [submitErr,  setSubmitErr]  = useState(null)

  // Ref-based guard: prevents a second submission while one is in-flight
  const inFlight = useRef(false)

  /* ── Mark field as touched on blur ── */
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }))
  }, [])

  /* ── Field change ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name] && !prev.conflict) return prev
      const next = { ...prev }
      delete next[name]
      delete next.conflict
      return next
    })
  }, [])

  /* ── Full validation (run on submit) ── */
  const validate = useCallback(() => {
    const errs = {}

    // Required fields
    if (!form.resourceId)     errs.resourceId = 'Please select a resource.'
    if (!form.date)           errs.date       = 'Please select a date.'
    if (!form.startTime)      errs.startTime  = 'Please enter a start time.'
    if (!form.endTime)        errs.endTime    = 'Please enter an end time.'
    if (!form.purpose.trim()) errs.purpose    = 'Please describe the purpose.'

    // Date: not in the past
    if (form.date) {
      const today = new Date().toISOString().split('T')[0]
      if (form.date < today)
        errs.date = 'Date cannot be in the past.'
    }

    // Time rules (only when both fields are present and no date error)
    if (form.startTime && form.endTime && !errs.date) {
      const ctx = {
        startMins: toMins(form.startTime),
        endMins:   toMins(form.endTime),
        date:      form.date,
      }
      for (const rule of TIME_RULES) {
        const result = rule(ctx)
        if (result && !errs[result.field]) {
          errs[result.field] = result.msg
        }
      }
    }

    return errs
  }, [form])

  /* ── Live time warnings (shown after a field is touched) ── */
  const timeWarnings = useMemo(() => {
    if (!form.startTime && !form.endTime) return {}
    const warns = {}
    const ctx = {
      startMins: toMins(form.startTime),
      endMins:   toMins(form.endTime),
      date:      form.date,
    }
    for (const rule of TIME_RULES) {
      const result = rule(ctx)
      if (result && (touched[result.field] || touched.startTime || touched.endTime)) {
        if (!warns[result.field]) warns[result.field] = result.msg
      }
    }
    return warns
  }, [form.startTime, form.endTime, form.date, touched])

  /* ── Conflict detection ── */
  const findConflict = useCallback(() => {
    const newStart = `${form.date}T${form.startTime}`
    const newEnd   = `${form.date}T${form.endTime}`
    return bookings.find(
      (b) =>
        b.resourceId === form.resourceId &&
        (b.status === 'PENDING' || b.status === 'APPROVED') &&
        `${b.date}T${b.startTime}` < newEnd &&
        `${b.date}T${b.endTime}`   > newStart
    )
  }, [bookings, form.resourceId, form.date, form.startTime, form.endTime])

  /* ── Reset — clears every piece of form state ── */
  const reset = useCallback(() => {
    setForm(EMPTY_FORM)
    setErrors({})
    setTouched({})
    setSubmitErr(null)
    setSubmitted(false)
    inFlight.current = false
  }, [])

  /* ── Submit ── */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    // Double-submission guard
    if (inFlight.current) return
    inFlight.current = true

    // Mark every field touched so live warnings surface immediately
    setTouched({
      resourceId: true, date: true,
      startTime:  true, endTime: true, purpose: true,
    })
    setSubmitErr(null)

    // 1. Validate
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      inFlight.current = false
      return
    }

    // 2. Conflict check
    const conflict = findConflict()
    if (conflict) {
      setErrors({
        conflict: `Already booked ${conflict.startTime}–${conflict.endTime} on ${conflict.date}.`,
      })
      inFlight.current = false
      return
    }

    // 3. Submit to service
    setSubmitting(true)
    try {
      const resource = resources.find((r) => r.id === form.resourceId)
      const payload  = createBookingPayload(form, currentUser, resource)
      const saved    = await submitBooking(payload)

      // 4. Commit to context
      addBooking(saved)
      notify('Booking submitted successfully!')

      // 5. Show success state, then reset after a short delay
      setSubmitted(true)
      setTimeout(reset, 2000)

    } catch (err) {
      const msg = err?.message ?? 'Something went wrong. Please try again.'
      setSubmitErr(msg)
      reportSubmitError(msg)
      notify(msg, 'error')
      inFlight.current = false
    } finally {
      setSubmitting(false)
    }
  }, [validate, findConflict, form, currentUser, addBooking, reportSubmitError, notify, reset])

  /* ── Derived values ── */
  const selectedResource = useMemo(
    () => resources.find((r) => r.id === form.resourceId) ?? null,
    [form.resourceId]
  )

  const durationMins = useMemo(() => {
    const s = toMins(form.startTime)
    const e = toMins(form.endTime)
    if (s === null || e === null || e <= s) return null
    return e - s
  }, [form.startTime, form.endTime])

  const duration = useMemo(
    () => formatDuration(durationMins),
    [durationMins]
  )

  const formattedDate = useMemo(() => formatDate(form.date), [form.date])

  const showPreview = useMemo(
    () =>
      Boolean(form.resourceId && form.date && form.startTime && form.endTime) &&
      form.endTime > form.startTime,
    [form.resourceId, form.date, form.startTime, form.endTime]
  )

  // Merge submit errors with live time warnings — submit errors take priority
  const displayErrors = useMemo(
    () => ({ ...timeWarnings, ...errors }),
    [timeWarnings, errors]
  )

  return {
    form,
    errors: displayErrors,
    touched,
    submitting,
    submitted,
    submitErr,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    selectedResource,
    duration,
    durationMins,
    formattedDate,
    showPreview,
    purposeLength: form.purpose.length,
  }
}

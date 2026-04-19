import { useState, useMemo, useCallback } from 'react'
import { resources } from '../data/mockBookings.js'
import { useBookingContext } from '../context/BookingContext.jsx'

/* ── Constants ─────────────────────────────────────────────── */
export const PURPOSE_MAX = 200

const EMPTY_FORM = {
  resourceId: '',
  date:        '',
  startTime:  '',
  endTime:    '',
  purpose:    '',
}

/* ── Helpers ───────────────────────────────────────────────── */
function calcDuration(startTime, endTime) {
  if (!startTime || !endTime) return null
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  const mins = (eh * 60 + em) - (sh * 60 + sm)
  if (mins <= 0) return null
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
   useBookingForm
   ══════════════════════════════════════ */
export function useBookingForm(currentUser) {
  const { bookings, addBooking, notify } = useBookingContext()

  const [form,      setForm]      = useState(EMPTY_FORM)
  const [errors,    setErrors]    = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)

  /* ── Field change handler ── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear the specific field error and any conflict error on change
    setErrors((prev) => {
      if (!prev[name] && !prev.conflict) return prev
      const next = { ...prev }
      delete next[name]
      delete next.conflict
      return next
    })
  }, [])

  /* ── Validation ── */
  const validate = useCallback(() => {
    const errs = {}
    if (!form.resourceId)      errs.resourceId = 'Please select a resource.'
    if (!form.date)            errs.date       = 'Please select a date.'
    if (!form.startTime)       errs.startTime  = 'Please enter a start time.'
    if (!form.endTime)         errs.endTime    = 'Please enter an end time.'
    if (!form.purpose.trim())  errs.purpose    = 'Please describe the purpose.'

    if (form.startTime && form.endTime && form.endTime <= form.startTime)
      errs.endTime = 'End time must be after start time.'

    const today = new Date().toISOString().split('T')[0]
    if (form.date && form.date < today)
      errs.date = 'Date cannot be in the past.'

    return errs
  }, [form])

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

  /* ── Reset ── */
  const reset = useCallback(() => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitted(false)
  }, [])

  /* ── Submit ── */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const conflict = findConflict()
    if (conflict) {
      setErrors({
        conflict: `Already booked ${conflict.startTime}–${conflict.endTime} on ${conflict.date}.`,
      })
      return
    }

    setSubmitting(true)

    // Simulate async API call — replace with real fetch when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 900))

    const resource = resources.find((r) => r.id === form.resourceId)
    addBooking({
      id:           `b${Date.now()}`,
      userId:       currentUser.id,
      userName:     currentUser.name,
      resourceId:   form.resourceId,
      resourceName: resource?.name ?? form.resourceId,
      date:         form.date,
      startTime:    form.startTime,
      endTime:      form.endTime,
      purpose:      form.purpose.trim(),
      status:       'PENDING',
      createdAt:    new Date().toISOString(),
    })

    notify('Booking submitted successfully!')
    setSubmitting(false)
    setSubmitted(true)

    // Reset after the success flash
    setTimeout(reset, 1800)
  }, [validate, findConflict, form, currentUser, addBooking, notify, reset])

  /* ── Derived values ── */
  const selectedResource = useMemo(
    () => resources.find((r) => r.id === form.resourceId) ?? null,
    [form.resourceId]
  )

  const duration = useMemo(
    () => calcDuration(form.startTime, form.endTime),
    [form.startTime, form.endTime]
  )

  const formattedDate = useMemo(
    () => formatDate(form.date),
    [form.date]
  )

  // Show the summary preview when resource + date + valid time range are all set
  const showPreview = useMemo(
    () =>
      Boolean(form.resourceId && form.date && form.startTime && form.endTime) &&
      form.endTime > form.startTime,
    [form.resourceId, form.date, form.startTime, form.endTime]
  )

  const purposeLength = form.purpose.length

  return {
    // Controlled field values
    form,
    // Validation errors
    errors,
    // Submission state
    submitting,
    submitted,
    // Handlers
    handleChange,
    handleSubmit,
    reset,
    // Derived / computed
    selectedResource,
    duration,
    formattedDate,
    showPreview,
    purposeLength,
  }
}

import { mockBookings } from '../data/mockBookings.js'

/**
 * bookingService.js
 *
 * Thin async layer between the form hook and the backend.
 * All functions return a Promise — resolves with data, rejects with Error.
 *
 * To connect the real Spring Boot backend, uncomment the fetch() blocks
 * and remove the mock implementations. The hook and context don't change.
 */

const SIMULATED_LATENCY_MS = 600

/* ── Error helper ────────────────────────────────────────── */

/**
 * Parse a ProblemDetail JSON body (RFC 9457) from a failed response.
 * Falls back to a generic message if the body isn't JSON.
 */
async function parseError(res) {
  try {
    const body = await res.json()
    // ProblemDetail shape: { title, detail, status, errors? }
    return body.detail ?? body.message ?? `Server error ${res.status}`
  } catch {
    return `Server error ${res.status}`
  }
}

/* ── Payload factory ─────────────────────────────────────── */

/**
 * Build a complete booking object ready to POST.
 * @param {object} formValues  — validated form fields
 * @param {object} currentUser — { id, name }
 * @param {object} resource    — { id, name }
 */
export function createBookingPayload(formValues, currentUser, resource) {
  return {
    userId:       currentUser.id,
    userName:     currentUser.name,
    resourceId:   formValues.resourceId,
    resourceName: resource?.name ?? formValues.resourceId,
    date:         formValues.date,
    startTime:    formValues.startTime,
    endTime:      formValues.endTime,
    purpose:      formValues.purpose.trim(),
  }
}

/* ── API functions ───────────────────────────────────────── */

/**
 * Fetch all bookings.
 * Real: GET /api/bookings
 */
export async function fetchBookings() {
  // ── Real API ──────────────────────────────────────────────
  // const res = await fetch('/api/bookings')
  // if (!res.ok) throw new Error(await parseError(res))
  // return res.json()
  // ─────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, SIMULATED_LATENCY_MS))
  return mockBookings
}

/**
 * Pre-submit conflict check — call this before showing the submit button
 * or on blur of the time fields to give early feedback.
 *
 * Returns: { conflict: false }
 *       or { conflict: true, detail: "Already booked 09:00–11:00 on 2026-04-20 (status: APPROVED)." }
 *
 * Real: POST /api/bookings/check-conflict
 */
export async function checkConflict({ resourceId, date, startTime, endTime, excludeId = null }) {
  // ── Real API ──────────────────────────────────────────────
  // const res = await fetch('/api/bookings/check-conflict', {
  //   method:  'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify({ resourceId, date, startTime, endTime, excludeId }),
  // })
  // if (!res.ok) throw new Error(await parseError(res))
  // return res.json()   // { conflict: boolean, detail?: string }
  // ─────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 150))   // fast — just a check

  const newStart = `${date}T${startTime}`
  const newEnd   = `${date}T${endTime}`

  const hit = mockBookings.find(
    (b) =>
      b.resourceId === resourceId &&
      (b.status === 'PENDING' || b.status === 'APPROVED') &&
      (excludeId == null || b.id !== excludeId) &&
      `${b.date}T${b.startTime}` < newEnd &&
      `${b.date}T${b.endTime}`   > newStart
  )

  if (!hit) return { conflict: false }

  return {
    conflict: true,
    detail: `Already booked ${hit.startTime}–${hit.endTime} on ${hit.date} (status: ${hit.status.toLowerCase()}).`,
  }
}

/**
 * Submit a new booking.
 * Real: POST /api/bookings  →  returns the created booking (with server id/createdAt).
 *
 * Throws on HTTP 409 (conflict) or any other non-2xx response.
 */
export async function submitBooking(payload) {
  // ── Real API ──────────────────────────────────────────────
  // const res = await fetch('/api/bookings', {
  //   method:  'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(payload),
  // })
  // if (!res.ok) throw new Error(await parseError(res))
  // return res.json()
  // ─────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, SIMULATED_LATENCY_MS))

  // Uncomment to test the error path:
  // throw new Error('Server unavailable. Please try again.')

  // Assign a local id and timestamp (server would do this)
  return {
    ...payload,
    id:        `b${Date.now()}`,
    status:    'PENDING',
    createdAt: new Date().toISOString(),
  }
}

/**
 * Cancel a booking (user action).
 * Real: DELETE /api/bookings/{id}?userId={userId}
 */
export async function cancelBooking(id, userId) {
  // ── Real API ──────────────────────────────────────────────
  // const res = await fetch(`/api/bookings/${id}?userId=${encodeURIComponent(userId)}`, {
  //   method: 'DELETE',
  // })
  // if (!res.ok) throw new Error(await parseError(res))
  // return res.json()
  // ─────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 300))
  return { id, status: 'CANCELLED' }
}

/**
 * Update a booking's status (admin: approve / reject).
 * Real: PATCH /api/bookings/{id}/status
 */
export async function updateBookingStatus(id, status) {
  // ── Real API ──────────────────────────────────────────────
  // const res = await fetch(`/api/bookings/${id}/status`, {
  //   method:  'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify({ status }),
  // })
  // if (!res.ok) throw new Error(await parseError(res))
  // return res.json()
  // ─────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 200))
  return { id, status }
}

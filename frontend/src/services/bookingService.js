/**
 * bookingService.js
 * All functions call the real Spring Boot API at /api/*.
 * The Vite dev server proxies /api/* → http://localhost:5000.
 */

/* ── Error helper ────────────────────────────────────────── */
async function parseError(res) {
  try {
    const body = await res.json()
    return body.detail ?? body.message ?? `Server error ${res.status}`
  } catch {
    return `Server error ${res.status}`
  }
}

/* ── Payload factory ─────────────────────────────────────── */
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

/* ── Resources ───────────────────────────────────────────── */

/** GET /api/resources */
export async function fetchResources() {
  const res = await fetch('/api/resources')
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/* ── Bookings ────────────────────────────────────────────── */

/** GET /api/bookings */
export async function fetchBookings() {
  const res = await fetch('/api/bookings')
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/** POST /api/bookings/check-conflict */
export async function checkConflict({ resourceId, date, startTime, endTime, excludeId = null }) {
  const res = await fetch('/api/bookings/check-conflict', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ resourceId, date, startTime, endTime, excludeId }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()  // { conflict: boolean, detail?: string }
}

/** POST /api/bookings */
export async function submitBooking(payload) {
  const res = await fetch('/api/bookings', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/** DELETE /api/bookings/{id}?userId={userId} */
export async function cancelBooking(id, userId) {
  const res = await fetch(`/api/bookings/${id}?userId=${encodeURIComponent(userId)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

/** PATCH /api/bookings/{id}/status */
export async function updateBookingStatus(id, status, reason = null) {
  const res = await fetch(`/api/bookings/${id}/status`, {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ status, reason }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

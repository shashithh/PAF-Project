import { mockBookings } from '../data/mockBookings.js'

/**
 * bookingService.js
 *
 * Thin async layer between the form hook and the backend.
 * All functions return a Promise that resolves with the result
 * or rejects with an Error — the hook handles the error boundary.
 *
 * To connect a real backend, replace the bodies of these functions
 * with fetch() / axios calls. The hook and context don't change.
 */

const SIMULATED_LATENCY_MS = 800

/* ── Helpers ─────────────────────────────────────────────── */

/**
 * Build a complete booking object ready to be stored.
 * Keeps the assembly logic in one place so the hook stays clean.
 *
 * @param {object} formValues  — validated form fields
 * @param {object} currentUser — { id, name }
 * @param {object} resource    — { id, name }
 * @returns {object} booking
 */
export function createBookingPayload(formValues, currentUser, resource) {
  return {
    id:           `b${Date.now()}`,
    userId:       currentUser.id,
    userName:     currentUser.name,
    resourceId:   formValues.resourceId,
    resourceName: resource?.name ?? formValues.resourceId,
    date:         formValues.date,
    startTime:    formValues.startTime,
    endTime:      formValues.endTime,
    purpose:      formValues.purpose.trim(),
    status:       'PENDING',
    createdAt:    new Date().toISOString(),
  }
}

/**
 * Submit a new booking to the backend.
 *
 * Mock: resolves with the booking after a short delay.
 * Real: POST /api/bookings  →  returns the created booking from the server.
 *
 * @param {object} booking — payload from createBookingPayload()
 * @returns {Promise<object>} the persisted booking (may have server-assigned id/createdAt)
 */
export async function submitBooking(booking) {
  // ── Replace this block with a real API call ──────────────
  // const res = await fetch('/api/bookings', {
  //   method:  'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body:    JSON.stringify(booking),
  // })
  // if (!res.ok) {
  //   const err = await res.json().catch(() => ({}))
  //   throw new Error(err.message ?? `Server error ${res.status}`)
  // }
  // return res.json()
  // ────────────────────────────────────────────────────────

  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS))

  // Simulate an occasional server error for testing (remove in production)
  // if (Math.random() < 0.1) throw new Error('Server unavailable. Please try again.')

  return booking   // echo back the same object (server would return its own id/timestamps)
}

/**
 * Fetch all bookings for the current user.
 * Mock: returns a filtered slice of the mock array.
 * Real: GET /api/bookings?userId=...
 *
 * @param {string} userId
 * @returns {Promise<object[]>}
 */
export async function fetchBookings() {
  // Real: return fetch('/api/bookings').then(r => r.json())
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockBookings
}

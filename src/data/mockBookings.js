/* ══════════════════════════════════════
   Mock data
   Replace API calls with real endpoints
   when the backend is ready.
   ══════════════════════════════════════ */

// ── Users ────────────────────────────────────────────────────
export const mockUsers = [
  { id: 'u1', name: 'Alice Tan',    email: 'alice@campus.edu',   role: 'USER'  },
  { id: 'u2', name: 'Bob Lim',      email: 'bob@campus.edu',     role: 'USER'  },
  { id: 'u3', name: 'Carol Ng',     email: 'carol@campus.edu',   role: 'USER'  },
  { id: 'u4', name: 'David Koh',    email: 'david@campus.edu',   role: 'USER'  },
  { id: 'u5', name: 'Eve Rahman',   email: 'eve@campus.edu',     role: 'ADMIN' },
]

// ── Resources ────────────────────────────────────────────────
export const resources = [
  { id: 'r1', name: 'Computer Lab A',      capacity: 30, type: 'lab'       },
  { id: 'r2', name: 'Computer Lab B',      capacity: 30, type: 'lab'       },
  { id: 'r3', name: 'Conference Room 101', capacity: 12, type: 'room'      },
  { id: 'r4', name: 'Physics Lab',         capacity: 20, type: 'lab'       },
  { id: 'r5', name: 'Projector Kit #3',    capacity:  1, type: 'equipment' },
]

// ── Bookings ─────────────────────────────────────────────────
// Dates are relative to April 2026 (current month in this project).
// Past dates show historical records; future dates are upcoming.
export const mockBookings = [

  // ── Alice (u1) — current user ──────────────────────────────

  {
    id: 'b1',
    userId: 'u1',
    userName: 'Alice Tan',
    resourceId: 'r1',
    resourceName: 'Computer Lab A',
    date: '2026-04-20',
    startTime: '09:00',
    endTime: '11:00',
    purpose: 'Final year project — frontend integration sprint',
    status: 'APPROVED',
    createdAt: '2026-04-15T08:30:00',
  },
  {
    id: 'b2',
    userId: 'u1',
    userName: 'Alice Tan',
    resourceId: 'r3',
    resourceName: 'Conference Room 101',
    date: '2026-04-22',
    startTime: '14:00',
    endTime: '15:30',
    purpose: 'Capstone project team sync — milestone review',
    status: 'PENDING',
    createdAt: '2026-04-16T10:00:00',
  },
  {
    id: 'b3',
    userId: 'u1',
    userName: 'Alice Tan',
    resourceId: 'r5',
    resourceName: 'Projector Kit #3',
    date: '2026-04-25',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Presentation rehearsal for CS401 demo day',
    status: 'PENDING',
    createdAt: '2026-04-17T09:15:00',
  },
  {
    id: 'b4',
    userId: 'u1',
    userName: 'Alice Tan',
    resourceId: 'r2',
    resourceName: 'Computer Lab B',
    date: '2026-04-10',
    startTime: '13:00',
    endTime: '15:00',
    purpose: 'Database assignment — group session',
    status: 'APPROVED',
    createdAt: '2026-04-07T11:00:00',
  },
  {
    id: 'b5',
    userId: 'u1',
    userName: 'Alice Tan',
    resourceId: 'r4',
    resourceName: 'Physics Lab',
    date: '2026-04-08',
    startTime: '08:00',
    endTime: '10:00',
    purpose: 'Lab report experiment — optics module',
    status: 'CANCELLED',
    createdAt: '2026-04-05T14:20:00',
  },
  {
    id: 'b6',
    userId: 'u1',
    userName: 'Alice Tan',
    resourceId: 'r3',
    resourceName: 'Conference Room 101',
    date: '2026-04-28',
    startTime: '16:00',
    endTime: '17:00',
    purpose: 'Mock interview practice with career advisor',
    status: 'APPROVED',
    createdAt: '2026-04-18T08:00:00',
  },

  // ── Bob (u2) ────────────────────────────────────────────────

  {
    id: 'b7',
    userId: 'u2',
    userName: 'Bob Lim',
    resourceId: 'r2',
    resourceName: 'Computer Lab B',
    date: '2026-04-22',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Data structures lab — binary tree implementation',
    status: 'REJECTED',
    createdAt: '2026-04-14T09:00:00',
  },
  {
    id: 'b8',
    userId: 'u2',
    userName: 'Bob Lim',
    resourceId: 'r1',
    resourceName: 'Computer Lab A',
    date: '2026-04-23',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Machine learning assignment — model training session',
    status: 'PENDING',
    createdAt: '2026-04-17T15:30:00',
  },
  {
    id: 'b9',
    userId: 'u2',
    userName: 'Bob Lim',
    resourceId: 'r4',
    resourceName: 'Physics Lab',
    date: '2026-04-11',
    startTime: '09:00',
    endTime: '11:30',
    purpose: 'Electromagnetic induction experiment',
    status: 'APPROVED',
    createdAt: '2026-04-08T10:00:00',
  },
  {
    id: 'b10',
    userId: 'u2',
    userName: 'Bob Lim',
    resourceId: 'r5',
    resourceName: 'Projector Kit #3',
    date: '2026-04-30',
    startTime: '11:00',
    endTime: '12:00',
    purpose: 'Club recruitment presentation — Robotics Society',
    status: 'PENDING',
    createdAt: '2026-04-18T11:45:00',
  },

  // ── Carol (u3) ──────────────────────────────────────────────

  {
    id: 'b11',
    userId: 'u3',
    userName: 'Carol Ng',
    resourceId: 'r3',
    resourceName: 'Conference Room 101',
    date: '2026-04-21',
    startTime: '09:00',
    endTime: '10:00',
    purpose: 'Study group — Advanced Algorithms revision',
    status: 'APPROVED',
    createdAt: '2026-04-15T13:00:00',
  },
  {
    id: 'b12',
    userId: 'u3',
    userName: 'Carol Ng',
    resourceId: 'r1',
    resourceName: 'Computer Lab A',
    date: '2026-04-24',
    startTime: '15:00',
    endTime: '17:00',
    purpose: 'Web development project — React component testing',
    status: 'PENDING',
    createdAt: '2026-04-18T09:30:00',
  },
  {
    id: 'b13',
    userId: 'u3',
    userName: 'Carol Ng',
    resourceId: 'r2',
    resourceName: 'Computer Lab B',
    date: '2026-04-09',
    startTime: '10:00',
    endTime: '11:00',
    purpose: 'Operating systems tutorial — process scheduling',
    status: 'APPROVED',
    createdAt: '2026-04-06T08:00:00',
  },
  {
    id: 'b14',
    userId: 'u3',
    userName: 'Carol Ng',
    resourceId: 'r4',
    resourceName: 'Physics Lab',
    date: '2026-04-29',
    startTime: '13:00',
    endTime: '15:00',
    purpose: 'Thermodynamics experiment — heat transfer lab',
    status: 'REJECTED',
    createdAt: '2026-04-17T16:00:00',
  },

  // ── David (u4) ──────────────────────────────────────────────

  {
    id: 'b15',
    userId: 'u4',
    userName: 'David Koh',
    resourceId: 'r5',
    resourceName: 'Projector Kit #3',
    date: '2026-04-21',
    startTime: '13:00',
    endTime: '14:00',
    purpose: 'Entrepreneurship pitch deck — startup competition',
    status: 'APPROVED',
    createdAt: '2026-04-14T12:00:00',
  },
  {
    id: 'b16',
    userId: 'u4',
    userName: 'David Koh',
    resourceId: 'r3',
    resourceName: 'Conference Room 101',
    date: '2026-04-26',
    startTime: '10:00',
    endTime: '11:30',
    purpose: 'Internship interview preparation — mock session',
    status: 'PENDING',
    createdAt: '2026-04-18T14:00:00',
  },
  {
    id: 'b17',
    userId: 'u4',
    userName: 'David Koh',
    resourceId: 'r1',
    resourceName: 'Computer Lab A',
    date: '2026-04-07',
    startTime: '11:00',
    endTime: '13:00',
    purpose: 'Network security assignment — packet analysis',
    status: 'CANCELLED',
    createdAt: '2026-04-04T09:00:00',
  },
  {
    id: 'b18',
    userId: 'u4',
    userName: 'David Koh',
    resourceId: 'r2',
    resourceName: 'Computer Lab B',
    date: '2026-05-02',
    startTime: '09:00',
    endTime: '11:00',
    purpose: 'Final exam revision — compiler design',
    status: 'PENDING',
    createdAt: '2026-04-18T16:30:00',
  },
]

// ── Helpers ──────────────────────────────────────────────────

/**
 * Returns bookings belonging to a specific user.
 * @param {string} userId
 */
export function getBookingsByUser(userId) {
  return mockBookings.filter((b) => b.userId === userId)
}

/**
 * Returns bookings for a specific resource on a given date.
 * Only includes PENDING and APPROVED (i.e. active) bookings.
 * @param {string} resourceId
 * @param {string} date  — 'YYYY-MM-DD'
 */
export function getActiveBookingsForResource(resourceId, date) {
  return mockBookings.filter(
    (b) =>
      b.resourceId === resourceId &&
      b.date === date &&
      (b.status === 'PENDING' || b.status === 'APPROVED')
  )
}

/**
 * Returns a summary count object: { PENDING, APPROVED, REJECTED, CANCELLED, TOTAL }
 */
export function getBookingStats() {
  return mockBookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1
      acc.TOTAL += 1
      return acc
    },
    { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0, TOTAL: 0 }
  )
}

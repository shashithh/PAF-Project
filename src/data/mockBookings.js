// Mock resources available for booking
export const resources = [
  { id: 'r1', name: 'Computer Lab A' },
  { id: 'r2', name: 'Computer Lab B' },
  { id: 'r3', name: 'Conference Room 101' },
  { id: 'r4', name: 'Physics Lab' },
  { id: 'r5', name: 'Projector Kit #3' },
]

// Mock bookings — replace with API calls when backend is ready
export const mockBookings = [
  {
    id: 'b1',
    userId: 'u1',
    resourceId: 'r1',
    resourceName: 'Computer Lab A',
    date: '2026-04-20',
    startTime: '09:00',
    endTime: '11:00',
    purpose: 'Final year project work',
    status: 'APPROVED',
  },
  {
    id: 'b2',
    userId: 'u1',
    resourceId: 'r3',
    resourceName: 'Conference Room 101',
    date: '2026-04-21',
    startTime: '14:00',
    endTime: '15:30',
    purpose: 'Team meeting',
    status: 'PENDING',
  },
  {
    id: 'b3',
    userId: 'u2',
    resourceId: 'r2',
    resourceName: 'Computer Lab B',
    date: '2026-04-22',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Data structures lab',
    status: 'REJECTED',
  },
]

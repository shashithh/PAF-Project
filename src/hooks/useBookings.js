import { useState, useEffect, useCallback } from 'react'
import {
  mockBookings,
  getBookingsByUser,
  getBookingStats,
} from '../data/mockBookings.js'

/**
 * useBookings
 *
 * Manages all booking state for the app.
 * Currently backed by mock data — swap the useEffect body
 * for a real API call (fetch / axios) when the backend is ready.
 *
 * Returns:
 *   bookings          — full list
 *   loading           — true while data is being fetched
 *   addBooking        — append a new booking
 *   updateBookingStatus(id, status) — mutate a booking's status
 *   getMyBookings(userId) — filtered list for one user
 *   stats             — { PENDING, APPROVED, REJECTED, CANCELLED, TOTAL }
 */
export function useBookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    // Simulate network latency — remove the timeout when using a real API
    const timer = setTimeout(() => {
      setBookings(mockBookings)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const addBooking = useCallback((booking) => {
    setBookings((prev) => [booking, ...prev])
  }, [])

  const updateBookingStatus = useCallback((id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
  }, [])

  const getMyBookings = useCallback(
    (userId) => bookings.filter((b) => b.userId === userId),
    [bookings]
  )

  // Derive stats from live state (reflects in-session changes)
  const stats = bookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1
      acc.TOTAL += 1
      return acc
    },
    { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0, TOTAL: 0 }
  )

  return {
    bookings,
    loading,
    addBooking,
    updateBookingStatus,
    getMyBookings,
    stats,
  }
}

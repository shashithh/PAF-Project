import { useState, useEffect } from 'react'
import { mockBookings } from '../data/mockBookings.js'

// Custom hook to manage booking state
// Replace mock data with real API calls when backend is ready
export function useBookings() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    setBookings(mockBookings)
  }, [])

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking])
  }

  const updateBookingStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    )
  }

  return { bookings, addBooking, updateBookingStatus }
}

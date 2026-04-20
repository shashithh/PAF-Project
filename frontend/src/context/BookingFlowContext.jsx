import React, { createContext, useContext, useState, useCallback } from 'react'

/**
 * BookingFlowContext
 * Holds the wizard state as the user moves through the 5-screen flow:
 *   Screen 1 → Browse Resources
 *   Screen 2 → Resource Detail
 *   Screen 3 → Time Slot Selection (modal)
 *   Screen 4 → Booking Form
 *   Screen 5 → Confirmation
 */
const BookingFlowContext = createContext(null)

export function BookingFlowProvider({ children }) {
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedDate,     setSelectedDate]     = useState('')
  const [selectedSlot,     setSelectedSlot]     = useState(null)  // { startTime, endTime }
  const [confirmedBooking, setConfirmedBooking] = useState(null)  // saved booking from API

  const reset = useCallback(() => {
    setSelectedResource(null)
    setSelectedDate('')
    setSelectedSlot(null)
    setConfirmedBooking(null)
  }, [])

  return (
    <BookingFlowContext.Provider value={{
      selectedResource, setSelectedResource,
      selectedDate,     setSelectedDate,
      selectedSlot,     setSelectedSlot,
      confirmedBooking, setConfirmedBooking,
      reset,
    }}>
      {children}
    </BookingFlowContext.Provider>
  )
}

export function useBookingFlow() {
  const ctx = useContext(BookingFlowContext)
  if (!ctx) throw new Error('useBookingFlow must be used inside <BookingFlowProvider>')
  return ctx
}

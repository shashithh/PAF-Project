import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { fetchBookings, cancelBooking as apiCancelBooking } from '../services/bookingService.js'

/* ══════════════════════════════════════
   Action types
   ══════════════════════════════════════ */
export const ACTIONS = {
  LOAD_START:          'LOAD_START',
  LOAD_SUCCESS:        'LOAD_SUCCESS',
  LOAD_ERROR:          'LOAD_ERROR',
  ADD_BOOKING:         'ADD_BOOKING',
  ADD_BOOKING_ERROR:   'ADD_BOOKING_ERROR',
  UPDATE_STATUS:       'UPDATE_STATUS',
  CANCEL_BOOKING:      'CANCEL_BOOKING',       // optimistic cancel
  CANCEL_BOOKING_ERROR:'CANCEL_BOOKING_ERROR', // rollback on failure
  SHOW_TOAST:          'SHOW_TOAST',
  HIDE_TOAST:          'HIDE_TOAST',
}

/* ══════════════════════════════════════
   Initial state
   ══════════════════════════════════════ */
const initialState = {
  bookings:    [],
  loading:     true,
  error:       null,          // load error
  submitError: null,          // booking creation error
  toast:       null,          // { message, type: 'success' | 'error' }
}

/* ══════════════════════════════════════
   Reducer
   ══════════════════════════════════════ */
function bookingReducer(state, action) {
  switch (action.type) {

    case ACTIONS.LOAD_START:
      return { ...state, loading: true, error: null }

    case ACTIONS.LOAD_SUCCESS:
      return { ...state, loading: false, bookings: action.payload }

    case ACTIONS.LOAD_ERROR:
      return { ...state, loading: false, error: action.payload }

    case ACTIONS.ADD_BOOKING:
      return {
        ...state,
        submitError: null,
        bookings: [action.payload, ...state.bookings],
      }

    case ACTIONS.ADD_BOOKING_ERROR:
      return { ...state, submitError: action.payload }

    case ACTIONS.UPDATE_STATUS:
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload.id
            ? { ...b, status: action.payload.status }
            : b
        ),
      }

    // Optimistic cancel — immediately marks the booking as CANCELLED in UI
    case ACTIONS.CANCEL_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload ? { ...b, status: 'CANCELLED' } : b
        ),
      }

    // Rollback — restores the previous status if the API call failed
    case ACTIONS.CANCEL_BOOKING_ERROR:
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload.id ? { ...b, status: action.payload.previousStatus } : b
        ),
      }

    case ACTIONS.SHOW_TOAST:
      return { ...state, toast: action.payload }

    case ACTIONS.HIDE_TOAST:
      return { ...state, toast: null }

    default:
      return state
  }
}

/* ══════════════════════════════════════
   Context
   ══════════════════════════════════════ */
const BookingContext = createContext(null)

/* ══════════════════════════════════════
   Provider
   ══════════════════════════════════════ */
export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  // ── Load bookings on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false
    dispatch({ type: ACTIONS.LOAD_START })

    fetchBookings()
      .then((data) => {
        if (!cancelled)
          dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: data })
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: ACTIONS.LOAD_ERROR, payload: err.message })
      })

    return () => { cancelled = true }
  }, [])

  // ── Toast auto-dismiss ──────────────────────────────────────
  useEffect(() => {
    if (!state.toast) return
    const timer = setTimeout(
      () => dispatch({ type: ACTIONS.HIDE_TOAST }),
      3000
    )
    return () => clearTimeout(timer)
  }, [state.toast])

  // ── Action creators ─────────────────────────────────────────

  /**
   * Called by useBookingForm after the service resolves.
   * Receives the persisted booking returned by the server.
   */
  const addBooking = useCallback((booking) => {
    dispatch({ type: ACTIONS.ADD_BOOKING, payload: booking })
  }, [])

  /**
   * Called by useBookingForm if the service rejects.
   */
  const reportSubmitError = useCallback((message) => {
    dispatch({ type: ACTIONS.ADD_BOOKING_ERROR, payload: message })
  }, [])

  const updateBookingStatus = useCallback((id, status) => {
    dispatch({ type: ACTIONS.UPDATE_STATUS, payload: { id, status } })
  }, [])

  /**
   * Cancel a booking optimistically, then confirm with the service.
   * Rolls back the UI if the API call fails.
   */
  const cancelBooking = useCallback(async (id, userId) => {
    // Find the current status before we change it (needed for rollback)
    const previousStatus = state.bookings.find((b) => b.id === id)?.status
    if (!previousStatus) return

    // 1. Optimistic update — card flips to CANCELLED immediately
    dispatch({ type: ACTIONS.CANCEL_BOOKING, payload: id })

    try {
      await apiCancelBooking(id, userId)
      dispatch({ type: ACTIONS.SHOW_TOAST, payload: { message: 'Booking cancelled.', type: 'success' } })
    } catch (err) {
      // 2. Rollback — restore the previous status
      dispatch({
        type: ACTIONS.CANCEL_BOOKING_ERROR,
        payload: { id, previousStatus },
      })
      dispatch({
        type: ACTIONS.SHOW_TOAST,
        payload: {
          message: err?.message ?? 'Could not cancel booking. Please try again.',
          type: 'error',
        },
      })
    }
  }, [state.bookings])

  const notify = useCallback((message, type = 'success') => {
    dispatch({ type: ACTIONS.SHOW_TOAST, payload: { message, type } })
  }, [])

  // ── Derived values ──────────────────────────────────────────
  const stats = useMemo(
    () =>
      state.bookings.reduce(
        (acc, b) => {
          acc[b.status] = (acc[b.status] ?? 0) + 1
          acc.TOTAL += 1
          return acc
        },
        { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0, TOTAL: 0 }
      ),
    [state.bookings]
  )

  const getMyBookings = useCallback(
    (userId) => state.bookings.filter((b) => b.userId === userId),
    [state.bookings]
  )

  // ── Context value ───────────────────────────────────────────
  const value = useMemo(
    () => ({
      bookings:     state.bookings,
      loading:      state.loading,
      error:        state.error,
      submitError:  state.submitError,
      toast:        state.toast,
      stats,
      getMyBookings,
      addBooking,
      reportSubmitError,
      cancelBooking,
      updateBookingStatus,
      notify,
    }),
    [
      state.bookings,
      state.loading,
      state.error,
      state.submitError,
      state.toast,
      stats,
      getMyBookings,
      addBooking,
      reportSubmitError,
      cancelBooking,
      updateBookingStatus,
      notify,
    ]
  )

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

/* ══════════════════════════════════════
   Consumer hook
   ══════════════════════════════════════ */
export function useBookingContext() {
  const ctx = useContext(BookingContext)
  if (!ctx) {
    throw new Error('useBookingContext must be used inside <BookingProvider>')
  }
  return ctx
}

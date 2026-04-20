import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import BrowseResourcesPage     from './pages/flow/BrowseResourcesPage.jsx'
import ResourceDetailPage      from './pages/flow/ResourceDetailPage.jsx'
import TimeSlotPage            from './pages/flow/TimeSlotPage.jsx'
import BookingFormPage         from './pages/flow/BookingFormPage.jsx'
import BookingConfirmationPage from './pages/flow/BookingConfirmationPage.jsx'
import MyBookingsPage          from './pages/MyBookingsPage.jsx'
import NewBookingPage          from './pages/NewBookingPage.jsx'
import AdminPage               from './pages/AdminPage.jsx'
import UnauthorizedPage        from './pages/UnauthorizedPage.jsx'
import { ROLES } from './context/AuthContext.jsx'
import { useBookingContext } from './context/BookingContext.jsx'

export default function App() {
  const { toast } = useBookingContext()

  return (
    <div className="app">
      <Navbar />

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          {toast.type === 'success' ? '✓' : '✕'} {toast.message}
        </div>
      )}

      <Routes>
        {/* Resources flow */}
        <Route path="/book"                          element={<ProtectedRoute><BrowseResourcesPage /></ProtectedRoute>} />
        <Route path="/book/:resourceId"              element={<ProtectedRoute><ResourceDetailPage /></ProtectedRoute>} />
        <Route path="/book/:resourceId/slots"        element={<ProtectedRoute><TimeSlotPage /></ProtectedRoute>} />
        <Route path="/book/:resourceId/form"         element={<ProtectedRoute><BookingFormPage /></ProtectedRoute>} />
        <Route path="/book/:resourceId/confirmation" element={<ProtectedRoute><BookingConfirmationPage /></ProtectedRoute>} />

        {/* New booking shortcut */}
        <Route path="/new-booking" element={<ProtectedRoute><NewBookingPage /></ProtectedRoute>} />

        {/* My bookings (home) */}
        <Route path="/" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute requiredRole={ROLES.ADMIN}><AdminPage /></ProtectedRoute>} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

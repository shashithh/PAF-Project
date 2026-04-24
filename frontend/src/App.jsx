import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar                     from './components/Sidebar.jsx'
import Topbar                      from './components/Topbar.jsx'
import ProtectedRoute              from './components/ProtectedRoute.jsx'
import BrowseResourcesPage         from './pages/flow/BrowseResourcesPage.jsx'
import ResourceDetailPage          from './pages/flow/ResourceDetailPage.jsx'
import TimeSlotPage                from './pages/flow/TimeSlotPage.jsx'
import BookingFormPage             from './pages/flow/BookingFormPage.jsx'
import BookingConfirmationPage     from './pages/flow/BookingConfirmationPage.jsx'
import MyBookingsPage              from './pages/MyBookingsPage.jsx'
import NewBookingPage              from './pages/NewBookingPage.jsx'
import AdminPage                   from './pages/AdminPage.jsx'
import UnauthorizedPage            from './pages/UnauthorizedPage.jsx'
import DashboardPage               from './pages/DashboardPage.jsx'
import { ROLES }                   from './context/AuthContext.jsx'
import { useBookingContext }        from './context/BookingContext.jsx'
import { useAuth }                 from './context/AuthContext.jsx'

function AppShell() {
  const { currentUser } = useAuth()
  const { toast } = useBookingContext()

  if (!currentUser) return <Navigate to="/unauthorized" replace />

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-area">
        <Topbar />

        {toast && (
          <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
            {toast.type === 'success' ? '✓' : '✕'} {toast.message}
          </div>
        )}

        <main className="page-content">
          <Routes>
            <Route path="/"            element={<DashboardPage />} />
            <Route path="/bookings"    element={<MyBookingsPage />} />
            <Route path="/book"                          element={<BrowseResourcesPage />} />
            <Route path="/book/:resourceId"              element={<ResourceDetailPage />} />
            <Route path="/book/:resourceId/slots"        element={<TimeSlotPage />} />
            <Route path="/book/:resourceId/form"         element={<BookingFormPage />} />
            <Route path="/book/:resourceId/confirmation" element={<BookingConfirmationPage />} />
            <Route path="/new-booking" element={<NewBookingPage />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole={ROLES.ADMIN}><AdminPage /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/*" element={<AppShell />} />
    </Routes>
  )
}
